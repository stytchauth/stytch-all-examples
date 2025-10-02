package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port                int
	StytchProjectID     string
	StytchProjectSecret string
	StytchDomain        string
	PublicBaseURL       string
}

func Load() *Config {
	port := 3001
	if p := os.Getenv("PORT"); p != "" {
		if v, err := strconv.Atoi(p); err == nil {
			port = v
		}
	}
	return &Config{
		Port:                port,
		StytchProjectID:     os.Getenv("STYTCH_PROJECT_ID"),
		StytchProjectSecret: os.Getenv("STYTCH_PROJECT_SECRET"),
		StytchDomain:        os.Getenv("STYTCH_DOMAIN"),
		PublicBaseURL:       getenvDefault("PUBLIC_BASE_URL", "http://localhost:3001"),
	}
}

func getenvDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
