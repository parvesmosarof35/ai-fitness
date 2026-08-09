package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	Port         string `mapstructure:"PORT"`
	DBPath       string `mapstructure:"DB_PATH"`
	JWTSecret    string `mapstructure:"JWT_SECRET"`
	GeminiAPIKey string `mapstructure:"GEMINI_API_KEY"`
	GeminiModel  string `mapstructure:"GEMINI_MODEL"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	if err = viper.ReadInConfig(); err != nil {
		log.Println("No .env file found or error reading it. Proceeding with environment variables.")
		err = nil
	}

	err = viper.Unmarshal(&config)
	return
}
