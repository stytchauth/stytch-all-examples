package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/stytchauth/stytch-go/v16/stytch/consumer/sessions"
	"github.com/stytchauth/stytch-go/v16/stytch/consumer/stytchapi"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
)

type contextKey string

const userIDKey contextKey = "userID"

func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDKey, userID)
}

func UserIDFrom(ctx context.Context) (string, bool) {
	v := ctx.Value(userIDKey)
	s, ok := v.(string)
	return s, ok
}

// SessionMiddleware authenticates requests using Stytch session JWT from cookies
func SessionMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	// Initialize Stytch client
	client, err := stytchapi.NewClient(cfg.StytchProjectID, cfg.StytchProjectSecret, stytchapi.WithBaseURI(cfg.StytchDomain))
	if err != nil {
		// If client creation fails, return middleware that always rejects
		return func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				unauthorized(w)
			})
		}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract JWT from cookie
			jwt := ""
			if c, err := r.Cookie("stytch_session_jwt"); err == nil && c.Value != "" {
				jwt = c.Value
			}
			if jwt == "" {
				unauthorized(w)
				return
			}

			// Authenticate JWT with Stytch
			resp, err := client.Sessions.Authenticate(context.Background(), &sessions.AuthenticateParams{
				SessionJWT: jwt,
			})
			if err != nil {
				unauthorized(w)
				return
			}

			// Extract user ID from session
			userID := resp.Session.UserID
			if userID == "" {
				unauthorized(w)
				return
			}

			ctx := WithUserID(r.Context(), userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// TokenMiddleware authenticates requests using Stytch JWT from Authorization header
func TokenMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	// Initialize Stytch client
	client, err := stytchapi.NewClient(cfg.StytchProjectID, cfg.StytchProjectSecret, stytchapi.WithBaseURI(cfg.StytchDomain))
	if err != nil {
		// If client creation fails, return middleware that always rejects
		return func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				unauthorized(w)
			})
		}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract JWT from Authorization header
			authz := r.Header.Get("Authorization")
			if !strings.HasPrefix(strings.ToLower(authz), "bearer ") {
				unauthorized(w)
				return
			}
			jwt := strings.TrimSpace(authz[7:])
			if jwt == "" {
				unauthorized(w)
				return
			}

			// Authenticate JWT with Stytch
			resp, err := client.Sessions.Authenticate(context.Background(), &sessions.AuthenticateParams{
				SessionJWT: jwt,
			})
			if err != nil {
				unauthorized(w)
				return
			}

			// Extract user ID from session
			userID := resp.Session.UserID
			if userID == "" {
				unauthorized(w)
				return
			}

			ctx := WithUserID(r.Context(), userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func unauthorized(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
}
