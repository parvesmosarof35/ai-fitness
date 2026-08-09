package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type Exercise struct {
	ID                uuid.UUID      `gorm:"type:uuid;primary_key"`
	Slug              string         `gorm:"type:text;uniqueIndex;not null"`
	Name              string         `gorm:"type:text;not null"`
	Description       *string        `gorm:"type:text"`
	Instructions      *string        `gorm:"type:text"`
	MuscleGroups      []string       `gorm:"type:jsonb;serializer:json"`
	Equipment         []string       `gorm:"type:jsonb;serializer:json"`
	Difficulty        *string        `gorm:"type:varchar(50)"`
	MediaURL          *string        `gorm:"type:text"`
	ThumbnailURL      *string        `gorm:"type:text"`
	PoseConfig        datatypes.JSON `gorm:"type:jsonb"`
	Source            *string        `gorm:"type:text"`
	SourceAttribution *string        `gorm:"type:text"`
	IsActive          bool           `gorm:"not null;default:true"`
	CreatedAt         time.Time      `gorm:"not null;default:current_timestamp"`
	UpdatedAt         time.Time      `gorm:"not null;default:current_timestamp"`
	DeletedAt         *time.Time
}
