package main

import (
	"log"

	"ai-fitness/api/internal/ai/gemini"
	"ai-fitness/api/internal/config"
	"ai-fitness/api/internal/repository/database"
	"ai-fitness/api/internal/service/auth"
	"ai-fitness/api/internal/service/nutrition"
	"ai-fitness/api/internal/service/profile"
	"ai-fitness/api/internal/service/workout"
	httpTransport "ai-fitness/api/internal/transport/http"
	"ai-fitness/api/internal/transport/http/handler"
)

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	db := database.NewDB(cfg)
	geminiClient := gemini.NewClient(cfg)

	// Services
	authService := auth.NewAuthService(db, cfg)
	profileService := profile.NewProfileService(db)
	exerciseService := workout.NewExerciseService(db)
	workoutService := workout.NewWorkoutService(db)
	generatorService := workout.NewGeneratorService(db, geminiClient, cfg)
	mealService := nutrition.NewMealService(db, geminiClient, cfg)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	profileHandler := handler.NewProfileHandler(profileService)
	workoutHandler := handler.NewWorkoutHandler(workoutService, exerciseService, generatorService)
	mealHandler := handler.NewMealHandler(mealService)

	// Router
	router := httpTransport.NewRouter(cfg, authHandler, profileHandler, workoutHandler, mealHandler)

	log.Printf("Starting server on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server failed to start: %v", err)
	}
}
