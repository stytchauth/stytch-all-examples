package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
)

func OAuthProtectedResourceHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"resource":              cfg.PublicBaseURL,
			"authorization_servers": []string{cfg.StytchDomain},
			"scopes_supported":      []string{"openid", "email", "profile"},
		})
	}
}

func OAuthAuthorizationServerHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		baseURL := cfg.PublicBaseURL
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"issuer":                                cfg.StytchDomain,
			"authorization_endpoint":                baseURL + "/oauth/authorize",
			"token_endpoint":                        cfg.StytchDomain + "/v1/oauth2/token",
			"registration_endpoint":                 cfg.StytchDomain + "/v1/oauth2/register",
			"scopes_supported":                      []string{"openid", "email", "profile"},
			"response_types_supported":              []string{"code"},
			"response_modes_supported":              []string{"query"},
			"grant_types_supported":                 []string{"authorization_code", "refresh_token"},
			"token_endpoint_auth_methods_supported": []string{"none"},
			"code_challenge_methods_supported":      []string{"S256"},
		})
	}
}
