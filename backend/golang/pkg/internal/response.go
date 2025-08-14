package internal

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	// Method contains the name of the SDK method that was called.
	Method string `json:"method"`
	// CodeSnippet shows the snippet of code with the SDK method invocation.
	CodeSnippet string `json:"codeSnippet"`
	// APIResponse contains the Stytch API response body.
	APIResponse any `json:"response"`

	// Error is populated with an error message if one occurred during the request.
	Error string `json:"error,omitempty"`
}

func SendResponse(w http.ResponseWriter, sdkMethod string, body any, err error) {
	response := Response{
		Method:      sdkMethod,
		APIResponse: body,
	}
	if err != nil {
		response.Error = err.Error()
		w.WriteHeader(http.StatusInternalServerError)
	}

	b, err := json.MarshalIndent(response, "", "\t")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(b)
}
