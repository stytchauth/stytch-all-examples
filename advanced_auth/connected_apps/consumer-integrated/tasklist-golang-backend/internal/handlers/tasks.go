package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/auth"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/config"
	"github.com/stytchauth/mcp-examples/consumer-integrated/tasklist-golang-backend/internal/storage"
)

type tasksResponse struct {
	Tasks []storage.Task `json:"tasks"`
}

type createTaskBody struct {
	TaskText string `json:"taskText"`
}

func RegisterTaskRoutes(r *mux.Router, cfg *config.Config) *mux.Router {
	// Wrap with session auth middleware (for cookie-based auth)
	sr := r.NewRoute().Subrouter()
	sr.Use(auth.SessionMiddleware(cfg))

	sr.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		userID, _ := auth.UserIDFrom(r.Context())
		tasks, err := storage.Get().List(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, tasksResponse{Tasks: tasks})
	}).Methods(http.MethodGet)

	sr.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		userID, _ := auth.UserIDFrom(r.Context())
		var body createTaskBody
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}
		tasks, err := storage.Get().Add(userID, body.TaskText)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, tasksResponse{Tasks: tasks})
	}).Methods(http.MethodPost)

	sr.HandleFunc("/tasks/{taskID}/complete", func(w http.ResponseWriter, r *http.Request) {
		userID, _ := auth.UserIDFrom(r.Context())
		taskID := mux.Vars(r)["taskID"]
		tasks, err := storage.Get().MarkCompleted(userID, taskID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, tasksResponse{Tasks: tasks})
	}).Methods(http.MethodPost)

	sr.HandleFunc("/tasks/{taskID}", func(w http.ResponseWriter, r *http.Request) {
		userID, _ := auth.UserIDFrom(r.Context())
		taskID := mux.Vars(r)["taskID"]
		tasks, err := storage.Get().Delete(userID, taskID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, tasksResponse{Tasks: tasks})
	}).Methods(http.MethodDelete)

	return sr
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, "failed to encode JSON response", http.StatusInternalServerError)
	}
}
