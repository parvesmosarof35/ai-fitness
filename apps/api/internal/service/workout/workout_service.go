package workout

import (
	"errors"
	"time"

	"ai-fitness/api/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WorkoutService struct {
	db *gorm.DB
}

func NewWorkoutService(db *gorm.DB) *WorkoutService {
	return &WorkoutService{db: db}
}

func (s *WorkoutService) CreateSession(userID string, clientEventID string) (*domain.WorkoutSession, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, err
	}
	eventID, err := uuid.Parse(clientEventID)
	if err != nil {
		return nil, err
	}

	session := &domain.WorkoutSession{
		ID:            uuid.New(),
		UserID:        uid,
		ClientEventID: eventID,
		StartTime:     time.Now(),
		Status:        "in_progress",
	}

	if err := s.db.Create(session).Error; err != nil {
		return nil, err
	}

	return session, nil
}

func (s *WorkoutService) CompleteSession(userID string, sessionID string, clientEventID string, logs []domain.WorkoutSetLog, caloriesBurned float64) (*domain.WorkoutSession, error) {
	uid, _ := uuid.Parse(userID)
	sid, _ := uuid.Parse(sessionID)
	eventID, _ := uuid.Parse(clientEventID)

	var session domain.WorkoutSession

	err := s.db.Where("client_event_id = ?", eventID).First(&session).Error
	if err == nil && session.Status == "completed" {
		return &session, nil
	}

	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	if session.ID == uuid.Nil {
		err = s.db.Where("id = ? AND user_id = ?", sid, uid).First(&session).Error
		if err != nil {
			return nil, errors.New("session not found")
		}
	}

	err = s.db.Transaction(func(tx *gorm.DB) error {
		now := time.Now()
		session.Status = "completed"
		session.EndTime = &now
		session.CaloriesBurned = &caloriesBurned
		session.ClientEventID = eventID

		if err := tx.Save(&session).Error; err != nil {
			return err
		}

		for i := range logs {
			logs[i].ID = uuid.New()
			logs[i].SessionID = session.ID
			if err := tx.Create(&logs[i]).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &session, nil
}

type ProgressSummary struct {
	TotalWorkouts int
	TotalMinutes  int
	TotalCalories float64
}

func (s *WorkoutService) GetWorkoutPlans(userID string) ([]domain.WorkoutPlan, error) {
	uid, _ := uuid.Parse(userID)
	var plans []domain.WorkoutPlan
	err := s.db.Where("user_id = ?", uid).Preload("Exercises").Preload("Exercises.Exercise").Order("created_at desc").Find(&plans).Error
	return plans, err
}

func (s *WorkoutService) GetSessionHistory(userID string) ([]domain.WorkoutSession, error) {
	uid, _ := uuid.Parse(userID)
	var sessions []domain.WorkoutSession
	err := s.db.Where("user_id = ? AND status = 'completed'", uid).Preload("Logs").Order("end_time desc").Limit(20).Find(&sessions).Error
	return sessions, err
}

func (s *WorkoutService) GetProgressSummary(userID string) (*ProgressSummary, error) {
	uid, _ := uuid.Parse(userID)
	var sessions []domain.WorkoutSession
	err := s.db.Where("user_id = ? AND status = 'completed'", uid).Find(&sessions).Error
	if err != nil {
		return nil, err
	}

	summary := &ProgressSummary{}
	summary.TotalWorkouts = len(sessions)
	for _, session := range sessions {
		if session.CaloriesBurned != nil {
			summary.TotalCalories += *session.CaloriesBurned
		}
		if session.EndTime != nil {
			mins := int(session.EndTime.Sub(session.StartTime).Minutes())
			summary.TotalMinutes += mins
		}
	}
	return summary, nil
}
