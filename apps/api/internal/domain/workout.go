package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type WorkoutPlan struct {
	ID                       uuid.UUID             `gorm:"type:uuid;primary_key" json:"id"`
	UserID                   uuid.UUID             `gorm:"type:uuid;not null" json:"-"`
	Name                     string                `gorm:"type:text;not null" json:"title"`
	Description              *string               `gorm:"type:text" json:"description"`
	Difficulty               *string               `gorm:"type:varchar(50)" json:"difficulty"`
	EstimatedDurationMinutes *int16                `gorm:"type:smallint" json:"estimatedDurationMinutes"`
	GeneratedByAI            bool                  `gorm:"not null;default:false" json:"generatedByAI"`
	AIMetadata               datatypes.JSON        `gorm:"type:jsonb" json:"aiMetadata"`
	CreatedAt                time.Time             `gorm:"not null;default:current_timestamp" json:"createdAt"`
	UpdatedAt                time.Time             `gorm:"not null;default:current_timestamp" json:"updatedAt"`
	DeletedAt                *time.Time            `json:"-"`
	Exercises                []WorkoutPlanExercise `gorm:"foreignKey:WorkoutPlanID" json:"exercises"`
}

type WorkoutPlanExercise struct {
	ID                    uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	WorkoutPlanID         uuid.UUID `gorm:"type:uuid;not null" json:"-"`
	ExerciseID            uuid.UUID `gorm:"type:uuid;not null" json:"exerciseId"`
	OrderIndex            int16     `gorm:"type:smallint;not null" json:"orderIndex"`
	TargetSets            int16     `gorm:"type:smallint;not null" json:"targetSets"`
	TargetReps            *int16    `gorm:"type:smallint" json:"targetReps"`
	TargetDurationSeconds *int16    `gorm:"type:smallint" json:"targetDurationSeconds"`
	TargetRestSeconds     *int16    `gorm:"type:smallint" json:"restSeconds"`
	CreatedAt             time.Time `gorm:"not null;default:current_timestamp" json:"createdAt"`
	Exercise              Exercise  `gorm:"foreignKey:ExerciseID" json:"exercise"`
}

type WorkoutSession struct {
	ID             uuid.UUID       `gorm:"type:uuid;primary_key" json:"id"`
	UserID         uuid.UUID       `gorm:"type:uuid;not null" json:"-"`
	WorkoutPlanID  *uuid.UUID      `gorm:"type:uuid" json:"planId"`
	ClientEventID  uuid.UUID       `gorm:"type:uuid;uniqueIndex;not null" json:"clientEventId"`
	StartTime      time.Time       `gorm:"not null" json:"startTime"`
	EndTime        *time.Time      `json:"endTime"`
	Status         string          `gorm:"type:varchar(50);not null;default:'in_progress'" json:"status"`
	CaloriesBurned *float64        `gorm:"type:numeric(6,2)" json:"caloriesBurned"`
	CreatedAt      time.Time       `gorm:"not null;default:current_timestamp" json:"createdAt"`
	UpdatedAt      time.Time       `gorm:"not null;default:current_timestamp" json:"updatedAt"`
	Logs           []WorkoutSetLog `gorm:"foreignKey:SessionID" json:"logs"`
}

type WorkoutSetLog struct {
	ID              uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	SessionID       uuid.UUID      `gorm:"type:uuid;not null" json:"-"`
	ExerciseID      uuid.UUID      `gorm:"type:uuid;not null" json:"exerciseId"`
	SetNumber       int16          `gorm:"type:smallint;not null" json:"setNumber"`
	Reps            *int16         `gorm:"type:smallint" json:"reps"`
	WeightKg        *float64       `gorm:"type:numeric(6,2)" json:"weightKg"`
	DurationSeconds *int16         `gorm:"type:smallint" json:"durationSeconds"`
	AIPoseFeedback  datatypes.JSON `gorm:"type:jsonb" json:"aiPoseFeedback"`
	CreatedAt       time.Time      `gorm:"not null;default:current_timestamp" json:"createdAt"`
}
