package nutrition

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"ai-fitness/api/internal/config"
	"ai-fitness/api/internal/domain"
	"github.com/google/generative-ai-go/genai"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type MealService struct {
	db     *gorm.DB
	client *genai.Client
	cfg    config.Config
}

func NewMealService(db *gorm.DB, client *genai.Client, cfg config.Config) *MealService {
	return &MealService{db: db, client: client, cfg: cfg}
}

type aiMealResult struct {
	Name     string  `json:"name"`
	Calories float64 `json:"calories"`
	ProteinG float64 `json:"proteinG"`
	CarbsG   float64 `json:"carbsG"`
	FatG     float64 `json:"fatG"`
}

func (s *MealService) AnalyzeMeal(userID string, imgData []byte, mimeType string) (*domain.MealLog, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, err
	}

	modelName := s.cfg.GeminiModel
	if modelName == "" {
		modelName = "gemini-1.5-flash"
	}
	model := s.client.GenerativeModel(modelName)
	model.ResponseMIMEType = "application/json"

	cleanMime := strings.Split(mimeType, ";")[0] // e.g. "image/jpeg"

	prompt := `You are an expert nutritionist. Analyze the provided image of a meal.
Give me a short name for the dish, and your best estimate of its total calories, and macronutrients (protein, carbs, fat) in grams.

Return ONLY a raw JSON object matching this schema exactly:
{
  "name": "string",
  "calories": number,
  "proteinG": number,
  "carbsG": number,
  "fatG": number
}
`
	resp, err := model.GenerateContent(context.Background(),
		genai.ImageData(strings.TrimPrefix(cleanMime, "image/"), imgData), // genai expects "jpeg", "png", etc
		genai.Text(prompt),
	)
	if err != nil {
		return nil, fmt.Errorf("gemini vision error: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from model")
	}

	part := resp.Candidates[0].Content.Parts[0]
	textPart, ok := part.(genai.Text)
	if !ok {
		return nil, fmt.Errorf("expected text response from model")
	}

	var aiRes aiMealResult
	if err := json.Unmarshal([]byte(textPart), &aiRes); err != nil {
		return nil, fmt.Errorf("failed to parse JSON from model: %w", err)
	}

	rawMeta, _ := json.Marshal(map[string]interface{}{"model": modelName})

	meal := domain.MealLog{
		ID:         uuid.New(),
		UserID:     uid,
		Name:       aiRes.Name,
		Calories:   &aiRes.Calories,
		ProteinG:   &aiRes.ProteinG,
		CarbsG:     &aiRes.CarbsG,
		FatG:       &aiRes.FatG,
		AIAnalysis: datatypes.JSON(rawMeta),
	}

	if err := s.db.Create(&meal).Error; err != nil {
		return nil, fmt.Errorf("failed to save meal log: %w", err)
	}

	return &meal, nil
}

func (s *MealService) GetMealLogs(userID string) ([]domain.MealLog, error) {
	var meals []domain.MealLog
	if err := s.db.Where("user_id = ?", userID).Order("created_at desc").Find(&meals).Error; err != nil {
		return nil, err
	}
	return meals, nil
}
