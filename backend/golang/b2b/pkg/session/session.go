package session

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/b2b/discovery/intermediatesessions"
	"github.com/stytchauth/stytch-go/v16/stytch/b2b/sessions"

	"backend/golang/b2b/pkg/internal"
)

const exchangeMethod = "Discovery.IntermediateSessions.Exchange"

type exchangeRequest struct {
	OrganizationID string `json:"organization_id"`
}

// Exchange exchanges an intermediate session token for a full session in the specified
// Stytch Organization. If the incoming request already has a full session attached, it
// attempts to perform a full session exchange and return a new session in the specified
// Organization.
func (c *Controller) Exchange(w http.ResponseWriter, r *http.Request) {
	var req exchangeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// If an intermediate session token exists, use it.
	// Otherwise, look for a session token.
	istUsed := true
	token, ok := c.cookieStore.GetIntermediateSession(r)
	if !ok {
		istUsed = false

		token, ok = c.cookieStore.GetSession(r)
		if !ok {
			log.Println("No session or intermediate session cookie found")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}

	if istUsed {
		resp, err := c.api.Discovery.IntermediateSessions.Exchange(r.Context(), &intermediatesessions.ExchangeParams{
			OrganizationID:           req.OrganizationID,
			IntermediateSessionToken: token,
		})
		if err != nil {
			internal.SendResponse(w, &internal.Response{
				Method: exchangeMethod,
				Error:  err.Error(),
			})
			return
		}

		c.cookieStore.StoreSession(w, r, resp.SessionToken)
		c.cookieStore.ClearIntermediateSession(w, r)

		internal.SendResponse(w, &internal.Response{
			Method:      exchangeMethod,
			APIResponse: resp,
			CodeSnippet: `resp, err := c.api.Discovery.IntermediateSessions.Exchange(
	r.Context(),
	&intermediatesessions.ExchangeParams{
		OrganizationID:           req.OrganizationID,
		IntermediateSessionToken: token,
	},
)`,
		})

	} else {
		resp, err := c.api.Sessions.Exchange(r.Context(), &sessions.ExchangeParams{
			OrganizationID: req.OrganizationID,
			SessionToken:   token,
		})
		if err != nil {
			internal.SendResponse(w, &internal.Response{
				Method: exchangeMethod,
				Error:  err.Error(),
			})
			return
		}
		c.cookieStore.StoreSession(w, r, resp.SessionToken)

		internal.SendResponse(w, &internal.Response{
			Method:      exchangeMethod,
			APIResponse: resp,
			CodeSnippet: `resp, err := c.api.Sessions.Exchange(
	r.Context(),
	&sessions.ExchangeParams{
		OrganizationID: req.OrganizationID,
		SessionToken:   token,
	},
)`,
		})
	}
}

// GetCurrentSession wraps Stytch's SessionAuthenticate endpoint and returns information
// about the requester's current session, as determined by the presence of session cookies
// in the request headers.
func (c *Controller) GetCurrentSession(w http.ResponseWriter, r *http.Request) {
	st, ok := c.cookieStore.GetSession(r)
	if !ok {
		log.Println("No session token found")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	session, err := c.api.Sessions.Authenticate(r.Context(), &sessions.AuthenticateParams{
		SessionToken: st,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: "Session.GetCurrentSession",
			Error:  err.Error(),
		})
	}

	internal.SendResponse(w, &internal.Response{
		Method:      "Session.GetCurrentSession",
		APIResponse: session,
		CodeSnippet: `// To get the current session, you can call the Sessions.Authenticate method.
session, err := c.api.Sessions.Authenticate(
	r.Context(),
	&sessions.AuthenticateParams{
		SessionToken: st,
	},
)`,
	})
}

// Logout revokes any active sessions on the request and clears the requester's
// session cookie cache.
func (c *Controller) Logout(w http.ResponseWriter, r *http.Request) {
	st, ok := c.cookieStore.GetSession(r)
	if !ok {
		log.Println("No session token found")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := c.api.Sessions.Revoke(r.Context(), &sessions.RevokeParams{
		SessionToken: st,
	})

	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: "Session.Revoke",
			Error:  err.Error(),
		})
		return
	}

	c.cookieStore.ClearSession(w, r)
	c.cookieStore.ClearIntermediateSession(w, r)

	internal.SendResponse(w, &internal.Response{
		Method:      "Session.Revoke",
		APIResponse: resp,
		CodeSnippet: `resp, err := c.api.Sessions.Revoke(
	r.Context(),
	&sessions.RevokeParams{
		SessionToken: st,
	},
)`,
	})
}
