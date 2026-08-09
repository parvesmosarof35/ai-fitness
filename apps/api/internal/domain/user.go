package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID              uuid.UUID  `gorm:"type:uuid;primary_key"`
	Email           string     `gorm:"type:varchar(255);uniqueIndex;not null"`
	PasswordHash    string     `gorm:"type:text;not null"`
	Status          string     `gorm:"type:varchar(50);not null"`
	EmailVerifiedAt *time.Time
	CreatedAt       time.Time  `gorm:"not null;default:current_timestamp"`
	UpdatedAt       time.Time  `gorm:"not null;default:current_timestamp"`
	DeletedAt       *time.Time

	Profile         *UserProfile
	AuthSessions    []AuthSession
}

type UserProfile struct {
	UserID                     uuid.UUID      `gorm:"type:uuid;primary_key"`
	BirthDate                  *time.Time     `gorm:"type:date"`
	HeightCm                   *float64       `gorm:"type:numeric(5,2)"`
	WeightKg                   *float64       `gorm:"type:numeric(6,2)"`
	Language                   *string        `gorm:"type:varchar(2)"`
	UnitSystem                 *string        `gorm:"type:varchar(10)"`
	PrimaryGoal                *string        `gorm:"type:varchar(50)"`
	ActivityLevel              *string        `gorm:"type:varchar(50)"`
	DailyTimeMinutes           *int16         `gorm:"type:smallint"`
	DietaryPreferences         []string       `gorm:"type:text;serializer:json"`
	DietaryRestrictions        []string       `gorm:"type:text;serializer:json"`
	InjuriesOrLimitations      []string       `gorm:"type:text;serializer:json"`
	HealthDisclaimerAcceptedAt *time.Time
	CreatedAt                  time.Time      `gorm:"not null;default:current_timestamp"`
	UpdatedAt                  time.Time      `gorm:"not null;default:current_timestamp"`
}

type AuthSession struct {
	ID                   uuid.UUID  `gorm:"type:uuid;primary_key"`
	UserID               uuid.UUID  `gorm:"type:uuid;not null"`
	TokenFamilyID        uuid.UUID  `gorm:"type:uuid;not null"`
	RefreshTokenHash     string     `gorm:"type:text;uniqueIndex;not null"`
	DeviceID             *string    `gorm:"type:text"`
	DeviceName           *string    `gorm:"type:text"`
	ExpiresAt            time.Time  `gorm:"not null"`
	LastUsedAt           *time.Time
	RevokedAt            *time.Time
	ReplacedBySessionID  *uuid.UUID `gorm:"type:uuid"`
	CreatedAt            time.Time  `gorm:"not null;default:current_timestamp"`
}
