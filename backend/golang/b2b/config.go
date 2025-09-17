package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ProjectID     string
	ProjectSecret string
}

// envFilePath is the path to the .env file located in the golang
// directory.
// In order to run the example apps you will need to populate this
// with your project variables.
const envFilepath = ".env"

func LoadConfig() Config {
	if _, err := os.Stat(envFilepath); os.IsNotExist(err) {
		log.Fatalf(".env file does not exist at path '%s'. Please follow the setup instructions to populate it.", envFilepath)
	}

	vars, err := godotenv.Read(envFilepath)
	if err != nil {
		log.Fatalf("Error reading from .env file: %v", err)
	}

	projectID, ok := vars["PROJECT_ID"]
	if !ok {
		log.Fatal("PROJECT_ID environment variable not found in .env file")
	}
	projectSecret, ok := vars["PROJECT_SECRET"]
	if !ok {
		log.Fatal("PROJECT_SECRET environment variable not found in .env file")
	}

	return Config{
		ProjectID:     projectID,
		ProjectSecret: projectSecret,
	}
}
