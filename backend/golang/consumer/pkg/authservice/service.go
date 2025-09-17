package authservice

import (
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/consumer/stytchapi"

	"backend/golang/consumer/pkg/internal"
	"backend/golang/consumer/pkg/magiclinks"
	"backend/golang/consumer/pkg/oauth"
	"backend/golang/consumer/pkg/session"
)

type Service struct {
	stytchAPI   *stytchapi.API
	cookieStore *internal.CookieStore

	MagicLinksController *magiclinks.Controller
	SessionsController   *session.Controller
	OAuthController      *oauth.Controller
}

func New(stytchAPI *stytchapi.API) *Service {
	cookieStore := internal.NewCookieStore()
	return &Service{
		stytchAPI:            stytchAPI,
		cookieStore:          cookieStore,
		MagicLinksController: magiclinks.NewController(stytchAPI, cookieStore),
		SessionsController:   session.NewController(stytchAPI, cookieStore),
		OAuthController:      oauth.NewController(stytchAPI, cookieStore),
	}
}

func (s *Service) IndexHandler(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	_, _ = w.Write([]byte("OK"))
}

// Token types are passed as query parameters in the Redirect URL and serve
// to identify which Stytch product and authentication flow the user is completing.
//
// For full list of token types, see: https://stytch.com/docs/workspace-management/redirect-urls.
const (
	tokenTypeMagicLinks = "magic_links"
	tokenTypeOAuth      = "oauth"
)

func (s *Service) AuthenticateHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve the token type from the query parameter.
	tokenType := r.URL.Query().Get("stytch_token_type")

	// Match the token type to the correct product, or return an
	// error if the token type if for an unsupported authentication
	// flow.
	switch tokenType {
	case tokenTypeMagicLinks:
		s.MagicLinksController.Authenticate(w, r)
	case tokenTypeOAuth:
		s.OAuthController.Authenticate(w, r)
	default:
		http.Error(w, "Authentication for this token type has not been implemented", http.StatusNotImplemented)
	}
}
