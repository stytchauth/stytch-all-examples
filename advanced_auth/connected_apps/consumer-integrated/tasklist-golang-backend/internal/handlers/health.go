package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
)

type healthError struct {
	Variable    string `json:"variable"`
	Description string `json:"description"`
}

func HealthcheckHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		errs := []healthError{}
		if cfg.StytchProjectID == "" {
			errs = append(errs, healthError{Variable: "STYTCH_PROJECT_ID", Description: "Your Stytch project ID (e.g., project-test-...)"})
		}
		if cfg.StytchProjectSecret == "" {
			errs = append(errs, healthError{Variable: "STYTCH_PROJECT_SECRET", Description: "Your Stytch secret key from Project Settings"})
		}
		if cfg.StytchDomain == "" {
			errs = append(errs, healthError{Variable: "STYTCH_DOMAIN", Description: "Your Stytch domain (e.g., https://test.stytch.com)"})
		}

		w.Header().Set("Content-Type", "application/json")
		if len(errs) > 0 {
			w.WriteHeader(http.StatusOK)
			_ = json.NewEncoder(w).Encode(map[string]any{
				"status":     "error",
				"errors":     errs,
				"message":    "Backend configuration is incomplete. Add missing variables to .env.local file.",
				"configFile": ".env.local",
			})
			return
		}

		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok", "message": "All environment variables are configured correctly"})
	}
}
