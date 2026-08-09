package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type WorkoutPlan struct {
	ID                       uuid.UUID      `gorm:"type:uuid;primary_key"`
	UserID                   uuid.UUID      `gorm:"type:uuid;not null"`
	Name                     string         `gorm:"type:text;not null"`
	Description              *string        `gorm:"type:text"`
	Difficulty               *string        `gorm:"type:varchar(50)"`
	EstimatedDurationMinutes *int16         `gorm:"type:smallint"`
	GeneratedByAI            bool           `gorm:"not null;default:false"`
	AIMetadata               datatypes.JSON `gorm:"type:jsonb"`
	CreatedAt                time.Time      `gorm:"not null;default:current_timestamp"`
	UpdatedAt                time.Time      `gorm:"not null;default:current_timestamp"`
	DeletedAt                *time.Time

	Exercises []WorkoutPlanExercise `gorm:"foreignKey:WorkoutPlanID"`
}

type WorkoutPlanExercise struct {
	ID                    uuid.UUID `gorm:"type:uuid;primary_key"`
	WorkoutPlanID         uuid.UUID `gorm:"type:uuid;not null"`
	ExerciseID            uuid.UUID `gorm:"type:uuid;not null"`
	OrderIndex            int16     `gorm:"type:smallint;not null"`
	TargetSets            int16     `gorm:"type:smallint;not null"`
	TargetReps            *int16    `gorm:"type:smallint"`
	TargetDurationSeconds *int16    `gorm:"type:smallint"`
	TargetRestSeconds     *int16    `gorm:"type:smallint"`
	CreatedAt             time.Time `gorm:"not null;default:current_timestamp"`

	Exercise Exercise `gorm:"foreignKey:ExerciseID"`
}

type WorkoutSession struct {
	ID             uuid.UUID  `gorm:"type:uuid;primary_key"`
	UserID         uuid.UUID  `gorm:"type:uuid;not null"`
	WorkoutPlanID  *uuid.UUID `gorm:"type:uuid"`
	ClientEventID  uuid.UUID  `gorm:"type:uuid;uniqueIndex;not null"`
	StartTime      time.Time  `gorm:"not null"`
	EndTime        *time.Time
	Status         string     `gorm:"type:varchar(50);not null;default:'in_progress'"`
	CaloriesBurned *float64   `gorm:"type:numeric(6,2)"`
	CreatedAt      time.Time  `gorm:"not null;default:current_timestamp"`
	UpdatedAt      time.Time  `gorm:"not null;default:current_timestamp"`

	Logs []WorkoutSetLog `gorm:"foreignKey:SessionID"`
}

type WorkoutSetLog struct {
	ID              uuid.UUID      `gorm:"type:uuid;primary_key"`
	SessionID       uuid.UUID      `gorm:"type:uuid;not null"`
	ExerciseID      uuid.UUID      `gorm:"type:uuid;not null"`
	SetNumber       int16          `gorm:"type:smallint;not null"`
	Reps            *int16         `gorm:"type:smallint"`
	WeightKg        *float64       `gorm:"type:numeric(6,2)"`
	DurationSeconds *int16         `gorm:"type:smallint"`
	AIPoseFeedback  datatypes.JSON `gorm:"type:jsonb"`
	CreatedAt       time.Time      `gorm:"not null;default:current_timestamp"`
}
