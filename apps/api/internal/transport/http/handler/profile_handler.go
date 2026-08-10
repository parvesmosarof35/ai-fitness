package handler

import (
	"net/http"
	"time"

	"ai-fitness/api/internal/domain"
	"ai-fitness/api/internal/service/profile"
	"github.com/gin-gonic/gin"
)

type ProfileHandler struct {
	profileService *profile.ProfileService
}

func NewProfileHandler(profileService *profile.ProfileService) *ProfileHandler {
	return &ProfileHandler{profileService: profileService}
}

func (h *ProfileHandler) GetMe(c *gin.Context) {
	userID := c.GetString("userID")
	user, err := h.profileService.GetMe(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"user": gin.H{
				"id":                     user.ID,
				"email":                  user.Email,
				"hasCompletedOnboarding": user.Profile != nil,
			},
		},
	})
}

type ProfileOnboardingRequest struct {
	Age                        int      `json:"age"`
	Language                   string   `json:"language"`
	UnitSystem                 string   `json:"unitSystem"`
	HeightCm                   float64  `json:"heightCm"`
	WeightKg                   float64  `json:"weightKg"`
	PrimaryGoal                string   `json:"primaryGoal"`
	ActivityLevel              string   `json:"activityLevel"`
	DailyTimeMinutes           int16    `json:"dailyTimeMinutes"`
	DietaryPreferences         []string `json:"dietaryPreferences"`
	HealthDisclaimerAccepted   bool     `json:"healthDisclaimerAccepted"`
}

func (h *ProfileHandler) UpdateOnboarding(c *gin.Context) {
	userID := c.GetString("userID")
	var req ProfileOnboardingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Compute an approximate birthdate from age
	birthDate := time.Now().AddDate(-req.Age, 0, 0)
	
	profile := domain.UserProfile{
		BirthDate:           &birthDate,
		Language:            &req.Language,
		UnitSystem:          &req.UnitSystem,
		HeightCm:            &req.HeightCm,
		WeightKg:            &req.WeightKg,
		PrimaryGoal:         &req.PrimaryGoal,
		ActivityLevel:       &req.ActivityLevel,
		DailyTimeMinutes:    &req.DailyTimeMinutes,
		DietaryPreferences:  req.DietaryPreferences,
	}

	if err := h.profileService.UpsertProfile(userID, &profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": profile})
}
