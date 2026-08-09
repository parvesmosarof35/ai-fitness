package workout

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"ai-fitness/api/internal/config"
	"ai-fitness/api/internal/domain"
	"github.com/google/generative-ai-go/genai"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type GeneratorService struct {
	db     *gorm.DB
	client *genai.Client
	cfg    config.Config
}

func NewGeneratorService(db *gorm.DB, client *genai.Client, cfg config.Config) *GeneratorService {
	return &GeneratorService{db: db, client: client, cfg: cfg}
}

type generatedExercise struct {
	Slug                  string `json:"slug"`
	TargetSets            int16  `json:"targetSets"`
	TargetReps            int16  `json:"targetReps"`
	TargetDurationSeconds int16  `json:"targetDurationSeconds"`
	TargetRestSeconds     int16  `json:"targetRestSeconds"`
}

type generatedWorkout struct {
	Name                     string              `json:"name"`
	Description              string              `json:"description"`
	Difficulty               string              `json:"difficulty"`
	EstimatedDurationMinutes int16               `json:"estimatedDurationMinutes"`
	Exercises                []generatedExercise `json:"exercises"`
}

func (s *GeneratorService) GenerateWorkout(userID string) (*domain.WorkoutPlan, error) {
	var user domain.User
	if err := s.db.Preload("Profile").Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	if user.Profile == nil {
		return nil, fmt.Errorf("user must complete onboarding before generating workouts")
	}

	var activeExercises []domain.Exercise
	if err := s.db.Where("is_active = ?", true).Find(&activeExercises).Error; err != nil {
		return nil, fmt.Errorf("could not fetch exercises: %w", err)
	}

	exerciseListStr := "Available exercises:\n"
	exerciseMap := make(map[string]domain.Exercise)
	for _, ex := range activeExercises {
		exerciseListStr += fmt.Sprintf("- %s (slug: %s, muscle_groups: %v)\n", ex.Name, ex.Slug, ex.MuscleGroups)
		exerciseMap[ex.Slug] = ex
	}

	prompt := fmt.Sprintf(`You are an expert personal trainer. 
Create a workout for a user with the following profile:
- Primary Goal: %s
- Activity Level: %s
- Daily Time Available: %d minutes
- Injuries: %v

Using ONLY the available exercises below, generate a JSON workout plan.
%s

You MUST return a raw JSON object (no markdown wrappers) with this exact schema:
{
  "name": "string",
  "description": "string",
  "difficulty": "beginner|intermediate|advanced",
  "estimatedDurationMinutes": number,
  "exercises": [
    {
      "slug": "must_match_one_of_the_provided_slugs",
      "targetSets": number,
      "targetReps": number,
      "targetDurationSeconds": number,
      "targetRestSeconds": number
    }
  ]
}
`, *user.Profile.PrimaryGoal, *user.Profile.ActivityLevel, *user.Profile.DailyTimeMinutes, user.Profile.InjuriesOrLimitations, exerciseListStr)

	modelName := s.cfg.GeminiModel
	if modelName == "" {
		modelName = "gemini-1.5-flash"
	}
	model := s.client.GenerativeModel(modelName)
	model.ResponseMIMEType = "application/json"

	resp, err := model.GenerateContent(context.Background(), genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("failed to generate workout: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from model")
	}

	part := resp.Candidates[0].Content.Parts[0]
	textPart, ok := part.(genai.Text)
	if !ok {
		return nil, fmt.Errorf("expected text response from model")
	}

	var generated generatedWorkout
	if err := json.Unmarshal([]byte(textPart), &generated); err != nil {
		return nil, fmt.Errorf("failed to parse JSON from model: %w", err)
	}

	plan := domain.WorkoutPlan{
		ID:                       uuid.New(),
		UserID:                   user.ID,
		Name:                     generated.Name,
		Description:              &generated.Description,
		Difficulty:               &generated.Difficulty,
		EstimatedDurationMinutes: &generated.EstimatedDurationMinutes,
		GeneratedByAI:            true,
	}

	rawMeta, _ := json.Marshal(map[string]interface{}{"model": modelName})
	plan.AIMetadata = datatypes.JSON(rawMeta)

	for i, ex := range generated.Exercises {
		dbEx, exists := exerciseMap[ex.Slug]
		if !exists {
			log.Printf("Model Hallucination: Generated slug %s not in DB, skipping.", ex.Slug)
			continue
		}

		planEx := domain.WorkoutPlanExercise{
			ID:                    uuid.New(),
			WorkoutPlanID:         plan.ID,
			ExerciseID:            dbEx.ID,
			OrderIndex:            int16(i),
			TargetSets:            ex.TargetSets,
			TargetReps:            &ex.TargetReps,
			TargetDurationSeconds: &ex.TargetDurationSeconds,
			TargetRestSeconds:     &ex.TargetRestSeconds,
		}
		plan.Exercises = append(plan.Exercises, planEx)
	}

	if err := s.db.Create(&plan).Error; err != nil {
		return nil, fmt.Errorf("failed to save generated workout to db: %w", err)
	}

	return &plan, nil
}
