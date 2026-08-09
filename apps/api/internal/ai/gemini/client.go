package gemini

import (
	"context"
	"log"

	"ai-fitness/api/internal/config"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func NewClient(cfg config.Config) *genai.Client {
	if cfg.GeminiAPIKey == "" || cfg.GeminiAPIKey == "dummy-api-key" {
		log.Println("WARNING: GEMINI_API_KEY is missing or dummy. AI features will fail if invoked.")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(cfg.GeminiAPIKey))
	if err != nil {
		log.Fatalf("failed to initialize gemini client: %v", err)
	}

	return client
}
