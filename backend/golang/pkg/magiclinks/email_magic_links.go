package magiclinks

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/b2b/magiclinks"
	mldiscovery "github.com/stytchauth/stytch-go/v16/stytch/b2b/magiclinks/discovery"
	"github.com/stytchauth/stytch-go/v16/stytch/b2b/magiclinks/email"
	"github.com/stytchauth/stytch-go/v16/stytch/b2b/magiclinks/email/discovery"

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
		internal.SendResponse(w, &internal.Response{
			Method: inviteMethod,
			Error:  err.Error(),
		})
		return
	}

	internal.SendResponse(w, &internal.Response{
		Method:      inviteMethod,
		APIResponse: resp,
		CodeSnippet: `resp, err := c.api.MagicLinks.Email.Invite(
	r.Context(),
	&email.InviteParams{
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		EmailAddress:   req.EmailAddress,
	},
)`,
	})
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
		internal.SendResponse(w, &internal.Response{
			Method: loginOrSignupMethod,
			Error:  err.Error(),
		})
		return
	}

	internal.SendResponse(w, &internal.Response{
		Method:      loginOrSignupMethod,
		APIResponse: resp,
		CodeSnippet: `resp, err := c.api.MagicLinks.Email.LoginOrSignup(
	r.Context(),
	&email.LoginOrSignupParams{
		OrganizationID: req.OrganizationID,
		EmailAddress:   req.EmailAddress,
	},
)`,
	})
}

const discoveryMethod = "MagicLinks.Discovery.Send"

type discoveryRequest struct {
	EmailAddress string `json:"email_address"`
}

func (c *Controller) DiscoveryEmailSend(w http.ResponseWriter, r *http.Request) {
	var req discoveryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := c.api.MagicLinks.Email.Discovery.Send(r.Context(), &discovery.SendParams{
		EmailAddress: req.EmailAddress,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: discoveryMethod,
			Error:  err.Error(),
		})
		return
	}

	internal.SendResponse(w, &internal.Response{
		Method:      discoveryMethod,
		APIResponse: resp,
		CodeSnippet: `resp, err := c.api.MagicLinks.Email.Discovery.Send(
	r.Context(),
	&discovery.SendParams{
		EmailAddress: req.EmailAddress,
	},
)`,
	})
}

const authenticateMethod = "MagicLinks.Authenticate"

func (c *Controller) Authenticate(w http.ResponseWriter, r *http.Request) {
	// Retrieve the token from the query parameter.
	token := r.URL.Query().Get("token")
	resp, err := c.api.MagicLinks.Authenticate(r.Context(), &magiclinks.AuthenticateParams{
		MagicLinksToken: token,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: authenticateMethod,
			Error:  err.Error(),
		})
		return
	}

	// A full session OR and intermediate session may be returned, depending on the
	// auth requirements of the organization that the user is attempting to
	// authenticate into.
	if resp.SessionToken != "" {
		c.cookieStore.StoreSession(w, r, resp.SessionToken)
	}
	if resp.IntermediateSessionToken != "" {
		c.cookieStore.StoreIntermediateSession(w, r, resp.IntermediateSessionToken)
	}

	internal.SendResponse(w, &internal.Response{
		Method:      authenticateMethod,
		APIResponse: resp,
		CodeSnippet: `resp, err := c.api.MagicLinks.Authenticate(
	r.Context(),
	&magiclinks.AuthenticateParams{
		MagicLinksToken: token,
	},
)`,
	})
}

const discoveryAuthenticateMethod = "MagicLinks.Discovery.Authenticate"

func (c *Controller) DiscoveryAuthenticate(w http.ResponseWriter, r *http.Request) {
	// Retrieve the token from the query parameter.
	token := r.URL.Query().Get("token")
	resp, err := c.api.MagicLinks.Discovery.Authenticate(r.Context(), &mldiscovery.AuthenticateParams{
		DiscoveryMagicLinksToken: token,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: discoveryAuthenticateMethod,
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
