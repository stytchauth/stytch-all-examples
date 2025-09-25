/**
 * This mapping is for internal use and displays metadata about the method name
 * and code excerpts for invoking it in the demo app's UI.
 *
 * You can ignore this when building your own Stytch integration.
 */
export const codeSnippets = {
  MagicLinks: {
    Invite: {
      method: "MagicLinks.Email.Invite",
      snippet: `const resp = await StytchClient.magicLinks.email.invite({ 
  organization_id: req.organization_id,
  email_address: req.email_address,
  name: req.name,
});`,
    },
    LoginSignup: {
      method: "MagicLinks.Email.LoginOrSignup",
      snippet: `const resp = await StytchClient.magicLinks.email.invite({ 
  organization_id: req.organization_id,
  email_address: req.email_address,
  name: req.name,
});`
    },
    DiscoverySend: {
      method: "MagicLinks.Email.Discovery.Send",
      snippet: `const resp = await StytchClient.magicLinks.email.discovery.send({
  email_address: req.email_address,
});`
    },
    Authenticate: {
      method: "MagicLinks.Authenticate",
      snippet: `const resp = await StytchClient.magicLinks.authenticate({
  magic_links_token: token,
});`,
    },
    DiscoveryAuthenticate: {
      method: "MagicLinks.Discovery.Authenticate",
      snippet: `const resp = await StytchClient.magicLinks.discovery.authenticate({
  discovery_magic_links_token: token,
});`,
    },
  },
  Discovery: {
    ListOrganizations: {
      method: "Discovery.Organizations.List",
      snippet: `const resp = await StytchClient.discovery.organizations.list({
  intermediate_session_token: ist,
  session_token: token,
});`,
    },
    CreateOrganization: {
      method: "Discovery.Organizations.Create",
      snippet: `const resp = await StytchClient.discovery.organizations.create({
  intermediate_session_token: ist,
  organization_name: req.organizationName,
});`
    }
  },
  Sessions: {
    IntermediateSessionExchange: {
      method: "Discovery.IntermediateSessions.Exchange",
      snippet: `const resp = await StytchClient.discovery.intermediateSessions.exchange({
  organization_id: req.organizationId,
  intermediate_session_token: ist,
});`,
    },
    SessionExchange: {
      method: "Sessions.Exchange",
      snippet: `const resp = await StytchClient.sessions.exchange({
  organization_id: req.organizationId,
  session_token: token,
});`,
    },
    Authenticate: {
      method: "Sessions.Authenticate",
      snippet: `const resp = await StytchClient.sessions.authenticate({
  session_token: token,
});`
    },
    Revoke: {
      method: "Sessions.Revoke",
      snippet: `const resp = await StytchClient.sessions.revoke({
  session_token: token,
});`
    }
  }
} as const;
