package session

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/b2b/discovery/intermediatesessions"

	"backend/golang/pkg/internal"
)

const exchangeMethod = "Discovery.IntermediateSessions.Exchange"

type exchangeRequest struct {
	OrganizationID string `json:"organization_id"`
}

func (c *Controller) Exchange(w http.ResponseWriter, r *http.Request) {
	var req exchangeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// The end user MUST have an intermediate session available in order
	// to convert it into a full session.
	ist, ok := c.cookieStore.GetIntermediateSession(r)
	if !ok {
		log.Println("No intermediate session cookie found")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := c.api.Discovery.IntermediateSessions.Exchange(r.Context(), &intermediatesessions.ExchangeParams{
		OrganizationID:           req.OrganizationID,
		IntermediateSessionToken: ist,
	})
	if err != nil {
		internal.SendResponse(w, exchangeMethod, nil, err)
		return
	}

	internal.SendResponse(w, exchangeMethod, resp, nil)
}
