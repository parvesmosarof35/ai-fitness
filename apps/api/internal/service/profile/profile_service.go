package profile

import (
	"errors"
	"time"

	"ai-fitness/api/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ProfileService struct {
	db *gorm.DB
}

func NewProfileService(db *gorm.DB) *ProfileService {
	return &ProfileService{db: db}
}

func (s *ProfileService) UpsertProfile(userID string, profile *domain.UserProfile) error {
	id, err := uuid.Parse(userID)
	if err != nil {
		return errors.New("invalid user id")
	}

	profile.UserID = id

	now := time.Now()
	profile.HealthDisclaimerAcceptedAt = &now

	return s.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"birth_date", "height_cm", "weight_kg", "language", "unit_system", "primary_goal", "activity_level", "daily_time_minutes", "dietary_preferences", "dietary_restrictions", "injuries_or_limitations", "health_disclaimer_accepted_at", "updated_at"}),
	}).Create(profile).Error
}

func (s *ProfileService) GetProfile(userID string) (*domain.UserProfile, error) {
	var profile domain.UserProfile
	if err := s.db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		return nil, err
	}
	return &profile, nil
}

func (s *ProfileService) GetMe(userID string) (*domain.User, error) {
	var user domain.User
	if err := s.db.Preload("Profile").Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
