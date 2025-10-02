package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/auth"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/handlers"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/mcpserver"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/storage"
)

func main() {
	_ = godotenv.Load(".env.local")
	cfg := config.Load()

	if err := storage.Init(cfg); err != nil {
		log.Fatalf("failed to init storage: %v", err)
	}

	r := mux.NewRouter()

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Health & config check
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/healthcheck", handlers.HealthcheckHandler(cfg)).Methods(http.MethodGet)

	// OAuth metadata
	r.HandleFunc("/.well-known/oauth-authorization-server", handlers.OAuthAuthorizationServerHandler(cfg)).Methods(http.MethodGet)
	r.HandleFunc("/.well-known/oauth-protected-resource", handlers.OAuthProtectedResourceHandler(cfg)).Methods(http.MethodGet)
	r.PathPrefix("/.well-known/oauth-protected-resource/").Handler(handlers.OAuthProtectedResourceHandler(cfg)).Methods(http.MethodGet)

	// Tasks REST (protected) - uses session middleware for cookie-based auth
	handlers.RegisterTaskRoutes(api, cfg)

	// MCP HTTP endpoint (mounted under /mcp) - uses token middleware for header-based auth
	r.PathPrefix("/mcp").Handler(auth.TokenMiddleware(cfg)(http.StripPrefix("/mcp", mcpserver.HTTPHandler(cfg))))

	srv := &http.Server{
		Addr:              fmt.Sprintf(":%d", cfg.Port),
		Handler:           c.Handler(r),
		ReadTimeout:       15 * time.Second,
		ReadHeaderTimeout: 10 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       120 * time.Second,
		ErrorLog:          log.New(os.Stderr, "server: ", log.LstdFlags|log.Lshortfile),
	}

	log.Printf("Tasklist Go backend listening on http://localhost:%d", cfg.Port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}
