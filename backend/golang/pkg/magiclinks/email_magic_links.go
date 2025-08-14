package magiclinks

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/b2b/magiclinks"
	"github.com/stytchauth/stytch-go/v16/stytch/b2b/magiclinks/email"

	"backend/golang/pkg/internal"
)

const inviteMethod = "MagicLinks.Email.Invite"

type inviteRequest struct {
	OrganizationID string `json:"organization_id"`
	Name           string `json:"name"`
	EmailAddress   string `json:"email_address"`
}

func (c *Controller) Invite(w http.ResponseWriter, r *http.Request) {
	var req inviteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := c.api.MagicLinks.Email.Invite(r.Context(), &email.InviteParams{
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		EmailAddress:   req.EmailAddress,
	})
	if err != nil {
		internal.SendResponse(w, inviteMethod, nil, err)
		return
	}

	internal.SendResponse(w, inviteMethod, resp, nil)
}

const loginOrSignupMethod = "MagicLinks.Email.LoginOrSignup"

type loginOrSignupRequest struct {
	OrganizationID string `json:"organization_id"`
	EmailAddress   string `json:"email_address"`
}

func (c *Controller) LoginOrSignup(w http.ResponseWriter, r *http.Request) {
	var req loginOrSignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := c.api.MagicLinks.Email.LoginOrSignup(r.Context(), &email.LoginOrSignupParams{
		OrganizationID: req.OrganizationID,
		EmailAddress:   req.EmailAddress,
	})
	if err != nil {
		internal.SendResponse(w, loginOrSignupMethod, nil, err)
		return
	}

	internal.SendResponse(w, loginOrSignupMethod, resp, nil)
}

const authenticateMethod = "MagicLinks.Authenticate"

func (c *Controller) Authenticate(w http.ResponseWriter, r *http.Request) {
	// Retrieve the token from the query parameter.
	token := r.URL.Query().Get("token")
	resp, err := c.api.MagicLinks.Authenticate(r.Context(), &magiclinks.AuthenticateParams{
		MagicLinksToken: token,
	})
	if err != nil {
		internal.SendResponse(w, authenticateMethod, nil, err)
		return
	}
	if resp.SessionToken != "" {
		c.cookieStore.StoreSession(w, r, resp.SessionToken)
	}
	if resp.IntermediateSessionToken != "" {
		c.cookieStore.StoreIntermediateSession(w, r, resp.IntermediateSessionToken)
	}

	internal.SendResponse(w, authenticateMethod, resp, nil)
}
