package handler

import (
	"net/http"
	"time"

	"ai-fitness/api/internal/service/auth"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *auth.AuthService
}

func NewAuthHandler(authService *auth.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type AuthRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.Register(req.Email, req.Password)
	if err != nil {
		if err.Error() == "email already registered" {
			c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered. Please log in."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register user"})
		return
	}

	accessToken, refreshToken, user, err := h.authService.GenerateTokens(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"accessToken":          accessToken,
			"refreshToken":         refreshToken,
			"accessTokenExpiresAt": time.Now().Add(15 * time.Minute),
			"user": gin.H{
				"id":                     user.ID,
				"email":                  user.Email,
				"hasCompletedOnboarding": false,
			},
		},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken, refreshToken, user, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"accessToken":          accessToken,
			"refreshToken":         refreshToken,
			"accessTokenExpiresAt": time.Now().Add(15 * time.Minute),
			"user": gin.H{
				"id":                     user.ID,
				"email":                  user.Email,
				"hasCompletedOnboarding": user.Profile != nil,
			},
		},
	})
}
