package handler

import (
	"net/http"

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

func (h *ProfileHandler) UpdateOnboarding(c *gin.Context) {
	userID := c.GetString("userID")
	var profile domain.UserProfile

	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.profileService.UpsertProfile(userID, &profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": profile})
}
