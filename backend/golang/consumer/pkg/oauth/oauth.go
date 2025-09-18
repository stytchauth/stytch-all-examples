package oauth

import (
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/consumer/oauth"

	"backend/golang/consumer/pkg/internal"
)

const authenticateMethod = "OAuth.Authenticate"

// Authenticate completes an OAuth flow by exchanging the OAuth token received from the IdP
// for a full session.
func (c *Controller) Authenticate(w http.ResponseWriter, r *http.Request) {
	// Retrieve the token from the query parameter.
	token := r.URL.Query().Get("token")
	resp, err := c.api.OAuth.Authenticate(r.Context(), &oauth.AuthenticateParams{
		Token:                  token,
		SessionDurationMinutes: 60,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: authenticateMethod,
			Error:  err.Error(),
		})
		return
	}

	// Store the session token in a cookie
	c.cookieStore.StoreSession(w, r, resp.SessionToken)

	// Redirect to the frontend after successful authentication
	http.Redirect(w, r, "http://localhost:3001/view-session", http.StatusSeeOther)
}
