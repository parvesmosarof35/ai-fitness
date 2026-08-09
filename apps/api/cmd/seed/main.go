package main

import (
	"encoding/json"
	"log"
	"os"

	"ai-fitness/api/internal/config"
	"ai-fitness/api/internal/domain"
	"ai-fitness/api/internal/repository/database"
	"gorm.io/gorm/clause"
)

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("cannot load config: %v", err)
	}

	db := database.NewDB(cfg)

	data, err := os.ReadFile("seeds/exercises.json")
	if err != nil {
		log.Fatalf("failed to read seed file: %v", err)
	}

	var exercises []domain.Exercise
	if err := json.Unmarshal(data, &exercises); err != nil {
		log.Fatalf("failed to parse seed file: %v", err)
	}

	for _, ex := range exercises {
		if err := db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "id"}},
			DoUpdates: clause.AssignmentColumns([]string{"slug", "name", "description", "instructions", "muscle_groups", "equipment", "difficulty", "pose_config"}),
		}).Create(&ex).Error; err != nil {
			log.Printf("failed to seed exercise %s: %v", ex.Name, err)
		}
	}

	log.Println("Successfully seeded exercises")
}
