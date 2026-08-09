package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type MealLog struct {
	ID         uuid.UUID      `gorm:"type:uuid;primary_key"`
	UserID     uuid.UUID      `gorm:"type:uuid;not null"`
	Name       string         `gorm:"type:text;not null"`
	Calories   *float64       `gorm:"type:numeric(6,2)"`
	ProteinG   *float64       `gorm:"type:numeric(6,2)"`
	CarbsG     *float64       `gorm:"type:numeric(6,2)"`
	FatG       *float64       `gorm:"type:numeric(6,2)"`
	AIAnalysis datatypes.JSON `gorm:"type:jsonb"`
	CreatedAt  time.Time      `gorm:"not null;default:current_timestamp"`
	UpdatedAt  time.Time      `gorm:"not null;default:current_timestamp"`
}
