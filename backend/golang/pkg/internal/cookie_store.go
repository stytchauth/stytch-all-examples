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

// These constants are keys for storing Stytch sessions and Stytch intermediate
// sessions in cookie jar on the user's device.
const (
	stytchSessionKey             = "stytch_session_key"
	stytchIntermediateSessionKey = "stytch_intermediate_session_key"
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

// GetIntermediateSession retrieves an intermediate session token from the cookie in an
// incoming HTTP request, if one exists.
func (cs *CookieStore) GetIntermediateSession(r *http.Request) (token string, exists bool) {
	return cs.get(r, stytchIntermediateSessionKey)
}

// StoreSession instructs the client's browser to store a cookie holding a Stytch session token.
func (cs *CookieStore) StoreSession(w http.ResponseWriter, r *http.Request, sessionToken string) {
	cs.store(w, r, stytchSessionKey, sessionToken)
}

// StoreIntermediateSession instructs the client's browser to store a cookie holding a Stytch
// intermediate session token.
func (cs *CookieStore) StoreIntermediateSession(w http.ResponseWriter, r *http.Request, intermediateSessionToken string) {
	cs.store(w, r, stytchIntermediateSessionKey, intermediateSessionToken)
}

// ClearSession instructs the client's browser to clear the session cookie, if one exists.
func (cs *CookieStore) ClearSession(w http.ResponseWriter, r *http.Request) {
	cs.clear(w, r, stytchSessionKey)
}

// ClearIntermediateSession instructs the client's browser to clear the intermediate session
// cookie, if one exists.
func (cs *CookieStore) ClearIntermediateSession(w http.ResponseWriter, r *http.Request) {
	cs.clear(w, r, stytchIntermediateSessionKey)
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
	delete(session.Values, "token")
	_ = cs.gorillaSessions.Save(r, w, session)
}
