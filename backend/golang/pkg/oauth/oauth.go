package oauth

import (
	"net/http"

	"backend/golang/pkg/internal"

	discoveryoauth "github.com/stytchauth/stytch-go/v16/stytch/b2b/oauth/discovery"
)

const discoveryOAuthAuthenticateMethod = "OAuth.Discovery.Authenticate"

func (c *Controller) DiscoveryOAuthAuthenticate(w http.ResponseWriter, r *http.Request) {
	// Retrieve the token from the query parameter.
	token := r.URL.Query().Get("token")
	resp, err := c.api.OAuth.Discovery.Authenticate(r.Context(), &discoveryoauth.AuthenticateParams{
		DiscoveryOAuthToken: token,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: discoveryOAuthAuthenticateMethod,
			Error:  err.Error(),
		})
		return
	}

	// An intermediate session token will be returned from successful Discovery
	// flows that establishes a session for an end user that is not associated
	// with any organization in particular.
	// This helps prevent account enumeration attacks.
	c.cookieStore.StoreIntermediateSession(w, r, resp.IntermediateSessionToken)

	// Redirect to the organizations page after successful authentication
	http.Redirect(w, r, "http://localhost:3001/organizations", http.StatusSeeOther)
}
