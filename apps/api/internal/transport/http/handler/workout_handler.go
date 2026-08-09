package handler

import (
	"net/http"

	"ai-fitness/api/internal/domain"
	"ai-fitness/api/internal/service/workout"
	"github.com/gin-gonic/gin"
)

type WorkoutHandler struct {
	workoutService   *workout.WorkoutService
	exerciseService  *workout.ExerciseService
	generatorService *workout.GeneratorService
}

func NewWorkoutHandler(workoutService *workout.WorkoutService, exerciseService *workout.ExerciseService, generatorService *workout.GeneratorService) *WorkoutHandler {
	return &WorkoutHandler{
		workoutService:   workoutService,
		exerciseService:  exerciseService,
		generatorService: generatorService,
	}
}

func (h *WorkoutHandler) ListExercises(c *gin.Context) {
	exercises, err := h.exerciseService.ListExercises()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch exercises"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": exercises})
}

func (h *WorkoutHandler) GetExercise(c *gin.Context) {
	id := c.Param("id")
	exercise, err := h.exerciseService.GetExercise(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "exercise not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": exercise})
}

type CreateSessionRequest struct {
	ClientEventID string `json:"clientEventId" binding:"required"`
}

func (h *WorkoutHandler) CreateSession(c *gin.Context) {
	userID := c.GetString("userID")
	var req CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session, err := h.workoutService.CreateSession(userID, req.ClientEventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create session"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": session})
}

type CompleteSessionRequest struct {
	ClientEventID  string                 `json:"clientEventId" binding:"required"`
	CaloriesBurned float64                `json:"caloriesBurned"`
	Logs           []domain.WorkoutSetLog `json:"logs"`
}

func (h *WorkoutHandler) CompleteSession(c *gin.Context) {
	userID := c.GetString("userID")
	sessionID := c.Param("id")

	var req CompleteSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session, err := h.workoutService.CompleteSession(userID, sessionID, req.ClientEventID, req.Logs, req.CaloriesBurned)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": session})
}

func (h *WorkoutHandler) GenerateWorkout(c *gin.Context) {
	userID := c.GetString("userID")

	plan, err := h.generatorService.GenerateWorkout(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": plan})
}
