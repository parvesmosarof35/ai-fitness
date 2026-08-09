package workout

import (
	"ai-fitness/api/internal/domain"
	"gorm.io/gorm"
)

type ExerciseService struct {
	db *gorm.DB
}

func NewExerciseService(db *gorm.DB) *ExerciseService {
	return &ExerciseService{db: db}
}

func (s *ExerciseService) ListExercises() ([]domain.Exercise, error) {
	var exercises []domain.Exercise
	if err := s.db.Where("is_active = ?", true).Find(&exercises).Error; err != nil {
		return nil, err
	}
	return exercises, nil
}

func (s *ExerciseService) GetExercise(id string) (*domain.Exercise, error) {
	var exercise domain.Exercise
	if err := s.db.Where("id = ?", id).First(&exercise).Error; err != nil {
		return nil, err
	}
	return &exercise, nil
}
