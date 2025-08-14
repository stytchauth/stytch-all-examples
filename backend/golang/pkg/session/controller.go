package session

import (
	"github.com/stytchauth/stytch-go/v16/stytch/b2b/b2bstytchapi"

	"backend/golang/pkg/internal"
)

type Controller struct {
	api         *b2bstytchapi.API
	cookieStore *internal.CookieStore
}

func NewController(api *b2bstytchapi.API, cookieStore *internal.CookieStore) *Controller {
	return &Controller{api, cookieStore}
}
