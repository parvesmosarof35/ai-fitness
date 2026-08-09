package http

import (
	"time"

	"ai-fitness/api/internal/config"
	"ai-fitness/api/internal/transport/http/handler"
	"ai-fitness/api/internal/transport/http/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter(cfg config.Config, authHandler *handler.AuthHandler, profileHandler *handler.ProfileHandler, workoutHandler *handler.WorkoutHandler, mealHandler *handler.MealHandler) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           12 * time.Hour,
	}))

	r.Use(gin.Recovery())

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", middleware.RateLimit(10, time.Minute), authHandler.Register)
			auth.POST("/login", middleware.RateLimit(20, time.Minute), authHandler.Login)
		}

		protected := v1.Group("")
		protected.Use(middleware.JWTAuth(cfg))
		{
			me := protected.Group("/me")
			{
				me.GET("", profileHandler.GetMe)
				me.GET("/profile", profileHandler.GetMe)
				me.PUT("/profile/onboarding", profileHandler.UpdateOnboarding)
			}

			exercises := protected.Group("/exercises")
			{
				exercises.GET("", workoutHandler.ListExercises)
				exercises.GET("/:id", workoutHandler.GetExercise)
			}

			workouts := protected.Group("/workouts")
			{
				workouts.POST("/generate", workoutHandler.GenerateWorkout)
			}

			sessions := protected.Group("/workout-sessions")
			{
				sessions.POST("", workoutHandler.CreateSession)
				sessions.PUT("/:id/complete", workoutHandler.CompleteSession)
			}

			meals := protected.Group("/meals")
			{
				meals.GET("", mealHandler.GetMealLogs)
				meals.POST("/analyze", mealHandler.AnalyzeMeal)
			}
		}
	}

	return r
}
