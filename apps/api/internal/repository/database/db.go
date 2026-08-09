package database

import (
	"log"

	"ai-fitness/api/internal/config"
	"ai-fitness/api/internal/domain"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func NewDB(cfg config.Config) *gorm.DB {
	// If DB_PATH is empty in env, default to fitness.db
	dbPath := cfg.DBPath
	if dbPath == "" {
		dbPath = "fitness.db"
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Connected to SQLite database.")

	// AutoMigrate all domain models
	err = db.AutoMigrate(
		&domain.User{},
		&domain.UserProfile{},
		&domain.AuthSession{},
		&domain.Exercise{},
		&domain.WorkoutPlan{},
		&domain.WorkoutPlanExercise{},
		&domain.WorkoutSession{},
		&domain.WorkoutSetLog{},
		&domain.MealLog{},
	)
	
	if err != nil {
		log.Fatalf("Failed to auto-migrate database: %v", err)
	}

	log.Println("Database auto-migrated successfully.")

	return db
}
