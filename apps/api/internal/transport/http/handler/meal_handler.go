package handler

import (
	"io"
	"net/http"

	"ai-fitness/api/internal/service/nutrition"
	"github.com/gin-gonic/gin"
)

type MealHandler struct {
	mealService *nutrition.MealService
}

func NewMealHandler(mealService *nutrition.MealService) *MealHandler {
	return &MealHandler{mealService: mealService}
}

func (h *MealHandler) AnalyzeMeal(c *gin.Context) {
	userID := c.GetString("userID")

	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image file is required"})
		return
	}
	defer file.Close()

	imgData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read image file"})
		return
	}

	mealLog, err := h.mealService.AnalyzeMeal(userID, imgData, header.Header.Get("Content-Type"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": mealLog})
}

func (h *MealHandler) GetMealLogs(c *gin.Context) {
	userID := c.GetString("userID")
	meals, err := h.mealService.GetMealLogs(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": meals})
}
