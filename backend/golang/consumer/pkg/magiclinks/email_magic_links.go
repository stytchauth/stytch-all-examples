package magiclinks

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/consumer/magiclinks"
	"github.com/stytchauth/stytch-go/v16/stytch/consumer/magiclinks/email"

	"backend/golang/consumer/pkg/internal"
)

const sendEmailMethod = "MagicLinks.Email.Send"

type sendEmailRequest struct {
	EmailAddress            string `json:"email_address"`
	LoginMagicLinkURL       string `json:"login_magic_link_url"`
	LoginExpirationMinutes  int32  `json:"login_expiration_minutes"`
	SignupMagicLinkURL      string `json:"signup_magic_link_url"`
	SignupExpirationMinutes int32  `json:"signup_expiration_minutes"`
}

// SendEmail wraps Stytch's Email Magic Links Send endpoint and sends an email to the specified
// email address that can be used to login or create an account.
func (c *Controller) SendEmail(w http.ResponseWriter, r *http.Request) {
	var req sendEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := c.api.MagicLinks.Email.Send(r.Context(), &email.SendParams{
		Email:                   req.EmailAddress,
		LoginMagicLinkURL:       req.LoginMagicLinkURL,
		LoginExpirationMinutes:  req.LoginExpirationMinutes,
		SignupMagicLinkURL:      req.SignupMagicLinkURL,
		SignupExpirationMinutes: req.SignupExpirationMinutes,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: sendEmailMethod,
			Error:  err.Error(),
		})
		return
	}

	internal.SendResponse(w, &internal.Response{
		Method:      sendEmailMethod,
		APIResponse: resp,
		CodeSnippet: `resp, err := c.api.MagicLinks.Email.Send(
	r.Context(),
	&email.SendParams{
		Email:                   req.EmailAddress,
		LoginMagicLinkURL:       req.LoginMagicLinkURL,
		LoginExpirationMinutes:  req.LoginExpirationMinutes,
		SignupMagicLinkURL:      req.SignupMagicLinkURL,
		SignupExpirationMinutes: req.SignupExpirationMinutes,
	},
)`,
	})
}

const authenticateMethod = "MagicLinks.Authenticate"

// Authenticate is the final step in Email Magic Links flows where the Magic Links token
// (retrieved when the user clicks the link in the email they received) can be exchanged
// for a full session.
func (c *Controller) Authenticate(w http.ResponseWriter, r *http.Request) {
	// Retrieve the token from the query parameter.
	token := r.URL.Query().Get("token")
	resp, err := c.api.MagicLinks.Authenticate(r.Context(), &magiclinks.AuthenticateParams{
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
