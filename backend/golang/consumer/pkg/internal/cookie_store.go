package internal

import (
	"net/http"

	"github.com/gorilla/sessions"
)

// CookieStore wraps an instance of sessions.CookieStore, allowing us to
// store and retrieve session cookies for the client.
type CookieStore struct {
	gorillaSessions *sessions.CookieStore
}

// These constants are keys for storing Stytch sessions in cookie jar on the user's device.
const (
	stytchSessionKey = "stytch_session_key"
)

func NewCookieStore() *CookieStore {
	// Gorilla sessions requires at least one secret key for codecs
	store := sessions.NewCookieStore([]byte("stytch-example-secret"))
	return &CookieStore{store}
}

// GetSession retrieves a session token from the cookie in an incoming HTTP request,
// if one exists.
func (cs *CookieStore) GetSession(r *http.Request) (token string, exists bool) {
	return cs.get(r, stytchSessionKey)
}

// StoreSession instructs the client's browser to store a cookie holding a Stytch session token.
func (cs *CookieStore) StoreSession(w http.ResponseWriter, r *http.Request, sessionToken string) {
	cs.store(w, r, stytchSessionKey, sessionToken)
}

// ClearSession instructs the client's browser to clear the session cookie, if one exists.
func (cs *CookieStore) ClearSession(w http.ResponseWriter, r *http.Request) {
	cs.clear(w, r, stytchSessionKey)
}

func (cs *CookieStore) get(r *http.Request, key string) (token string, exists bool) {
	session, err := cs.gorillaSessions.Get(r, key)
	if session == nil || err != nil {
		return "", false
	}
	token, ok := session.Values["token"].(string)
	return token, ok && token != ""
}

func (cs *CookieStore) store(w http.ResponseWriter, r *http.Request, key string, token string) {
	session, _ := cs.gorillaSessions.Get(r, key)
	session.Values["token"] = token
	_ = session.Save(r, w)
}

func (cs *CookieStore) clear(w http.ResponseWriter, r *http.Request, key string) {
	session, _ := cs.gorillaSessions.Get(r, key)
	session.Options.MaxAge = -1
	_ = session.Save(r, w)
}
