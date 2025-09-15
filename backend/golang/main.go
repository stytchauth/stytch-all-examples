package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/b2b/b2bstytchapi"

	"backend/golang/pkg/authservice"
)

var ctx = context.Background()

// corsMiddleware adds CORS headers to allow cross-origin requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from the frontend origin
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3001")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// loggingMiddleware logs the requested method and path of the incoming request.
// It ignores browser preflight requests using OPTIONS for the sake of simplicity.
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodOptions {
			log.Printf("%s %s\n", r.Method, r.URL.Path)
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load project id, project secret, and other variables from the .env file.
	conf := LoadConfig()

	// Initialize a Stytch B2B Client.
	apiClient, err := b2bstytchapi.NewClient(conf.ProjectID, conf.ProjectSecret)
	if err != nil {
		log.Fatalf("Unable to instantiate Stytch B2B client: %v", err)
	}

	// Instantiate a controller.
	service := authservice.New(apiClient)

	// Instantiate a server mux and set up HTTP routing.
	mux := http.NewServeMux()

	// Handle index.
	mux.HandleFunc("/", service.IndexHandler)

	// Handle universal authenticate endpoint.
	mux.HandleFunc("/authenticate", service.AuthenticateHandler)

	// Handle Email Magic Links routes.
	mux.HandleFunc("/magic-links/invite", service.MagicLinksController.Invite)
	mux.HandleFunc("/magic-links/login-signup", service.MagicLinksController.LoginOrSignup)
	mux.HandleFunc("/magic_links/email/discovery/send", service.MagicLinksController.DiscoveryEmailSend)

	// Handle Discovery routes.
	mux.HandleFunc("/discovery/organizations", service.DiscoveryController.ListOrganizations)
	mux.HandleFunc("/discovery/organizations/create", service.DiscoveryController.CreateOrganizationViaDiscovery)

	// Handle Sessions routes.
	mux.HandleFunc("/sessions/exchange", service.SessionsController.Exchange)
	mux.HandleFunc("/session", service.SessionsController.GetCurrentSession)
	mux.HandleFunc("/logout", service.SessionsController.Logout)

	// Wrap the mux with CORS and logging middleware
	handler := loggingMiddleware(corsMiddleware(mux))

	log.Println("Starting server on port 3000...")
	if err := http.ListenAndServe(":3000", handler); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("Unable to start server: %v", err)
	}
	log.Println("Shutting down server...")
}
