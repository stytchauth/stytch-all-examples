package session

import (
	"github.com/stytchauth/stytch-go/v16/stytch/consumer/stytchapi"

	"backend/golang/consumer/pkg/internal"
)

type Controller struct {
	api         *stytchapi.API
	cookieStore *internal.CookieStore
}

func NewController(api *stytchapi.API, cookieStore *internal.CookieStore) *Controller {
	return &Controller{api, cookieStore}
}
