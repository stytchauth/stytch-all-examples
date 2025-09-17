package session

import (
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/consumer/sessions"

	"backend/golang/consumer/pkg/internal"
)

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
		return
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
