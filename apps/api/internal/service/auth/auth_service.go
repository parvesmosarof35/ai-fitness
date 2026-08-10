package auth

import (
	"errors"
	"strings"
	"time"

	"ai-fitness/api/internal/config"
	"ai-fitness/api/internal/domain"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	db  *gorm.DB
	cfg config.Config
}

func NewAuthService(db *gorm.DB, cfg config.Config) *AuthService {
	return &AuthService{db: db, cfg: cfg}
}

func (s *AuthService) Register(email, password string) (*domain.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: string(hash),
		Status:       "active",
	}

	if err := s.db.Create(user).Error; err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed: users.email") || errors.Is(err, gorm.ErrDuplicatedKey) {
			return nil, errors.New("email already registered")
		}
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(email, password string) (string, string, *domain.User, error) {
	var user domain.User
	if err := s.db.Preload("Profile").Where("email = ?", email).First(&user).Error; err != nil {
		return "", "", nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", "", nil, errors.New("invalid credentials")
	}

	return s.GenerateTokens(&user)
}

func (s *AuthService) GenerateTokens(user *domain.User) (string, string, *domain.User, error) {
	// Access Token
	accessClaims := jwt.MapClaims{
		"sub": user.ID.String(),
		"exp": time.Now().Add(15 * time.Minute).Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessString, err := accessToken.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return "", "", nil, err
	}

	// Refresh Token
	refreshTokenString := uuid.New().String()
	hash, _ := bcrypt.GenerateFromPassword([]byte(refreshTokenString), bcrypt.DefaultCost)

	session := domain.AuthSession{
		ID:               uuid.New(),
		UserID:           user.ID,
		TokenFamilyID:    uuid.New(),
		RefreshTokenHash: string(hash),
		ExpiresAt:        time.Now().Add(7 * 24 * time.Hour),
	}

	if err := s.db.Create(&session).Error; err != nil {
		return "", "", nil, err
	}

	return accessString, refreshTokenString, user, nil
}

func (s *AuthService) Logout(userID string) error {
	// For simplicity, revoke all active sessions for the user to ensure logout is comprehensive across devices
	// Alternately, could pass specific refresh token and compare hash to delete just one session.
	if err := s.db.Where("user_id = ?", userID).Delete(&domain.AuthSession{}).Error; err != nil {
		return err
	}
	return nil
}
