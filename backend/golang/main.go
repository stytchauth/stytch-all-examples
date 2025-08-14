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

	if err := http.ListenAndServe(":8080", mux); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("Unable to start server: %v", err)
	}
}
