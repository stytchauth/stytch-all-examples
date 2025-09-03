package discovery

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/stytchauth/stytch-go/v16/stytch/b2b/discovery/organizations"

	"backend/golang/pkg/internal"
)

const listOrganizationsMethod = "Discovery.Organizations.List"
const createOrganizationViaDiscoveryMethod = "Discovery.Organizations.Create"

func (c *Controller) ListOrganizations(w http.ResponseWriter, r *http.Request) {
	// If an intermediate session token exists, use it.
	// Otherwise, look for a session token.
	istUsed := true
	token, ok := c.cookieStore.GetIntermediateSession(r)
	if !ok {
		istUsed = false

		token, ok = c.cookieStore.GetSession(r)
		if !ok {
			log.Println("No session or intermediate session cookie found")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}

	req := &organizations.ListParams{}
	if istUsed {
		req.IntermediateSessionToken = token
	} else {
		req.SessionToken = token
	}
	resp, err := c.api.Discovery.Organizations.List(r.Context(), req)
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: listOrganizationsMethod,
			Error:  err.Error(),
		})
		return
	}

	codeSnippet := `resp, err := c.api.Discovery.Organizations.List(
	r.Context(),
	&organizations.ListParams{
		SessionToken: token,
	},
)`
	if istUsed {
		codeSnippet = `resp, err := c.api.Discovery.Organizations.List(
	r.Context(),
	&organizations.ListParams{
		IntermediateSessionToken: token,
	},
)`
	}

	internal.SendResponse(w, &internal.Response{
		Method:      listOrganizationsMethod,
		APIResponse: resp,
		CodeSnippet: codeSnippet,
		Metadata: map[string]any{
			"canCreateOrganization": istUsed,
		},
	})
}

type createOrganizationViaDiscoveryRequest struct {
	OrganizationName string `json:"organizationName"`
}

func (c *Controller) CreateOrganizationViaDiscovery(w http.ResponseWriter, r *http.Request) {
	var req createOrganizationViaDiscoveryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	ist, ok := c.cookieStore.GetIntermediateSession(r)
	if !ok {
		log.Println("No intermediate session token found")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := c.api.Discovery.Organizations.Create(r.Context(), &organizations.CreateParams{
		IntermediateSessionToken: ist,
		OrganizationName:         req.OrganizationName,
	})
	if err != nil {
		internal.SendResponse(w, &internal.Response{
			Method: createOrganizationViaDiscoveryMethod,
			Error:  err.Error(),
		})
		return
	}

	c.cookieStore.StoreSession(w, r, resp.SessionToken)
	c.cookieStore.ClearIntermediateSession(w, r)

	internal.SendResponse(w, &internal.Response{
		Method:      createOrganizationViaDiscoveryMethod,
		APIResponse: resp,
		CodeSnippet: `resp, err := c.api.Discovery.Organizations.Create(
	r.Context(),
	&organizations.CreateParams{
		IntermediateSessionToken: ist,
		OrganizationName:         req.OrganizationName,
	},
)`,
	})
}
