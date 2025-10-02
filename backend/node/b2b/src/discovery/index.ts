import { Request, Response } from "express";
import {
  B2BDiscoveryOrganizationsCreateResponse,
  B2BDiscoveryOrganizationsListRequest,
  B2BDiscoveryOrganizationsListResponse
} from "stytch";
import { parseTokensFromCookies, StytchIntermediateSessionKey, StytchSessionKey } from "../utils/cookies.js";
import { ResponseBody } from "../utils/response.js";
import { codeSnippets } from "../utils/snippets.js";
import { StytchClient } from "../utils/stytchClient.js";

/**
 * Uses the intermediate or full session token in the request and returns a list of
 * Organizations that the user is eligible to authenticate into based on the authentication
 * requirements implemented by the Organizations.
 */
export async function listOrganizations(req: Request, res: Response) {
  const { sessionToken, intermediateSessionToken } = parseTokensFromCookies(req);
  if (!sessionToken && !intermediateSessionToken) {
    throw new Error("Must have at least one kind of session cookie present.");
  }

  const listOrgRequest: B2BDiscoveryOrganizationsListRequest = {};
  if (sessionToken) {
    listOrgRequest.session_token = sessionToken;
  } else if (intermediateSessionToken) {
    listOrgRequest.intermediate_session_token = intermediateSessionToken;
  }

  const resp = await StytchClient.discovery.organizations.list(listOrgRequest);

  res.json({
    method: codeSnippets.Discovery.ListOrganizations.method,
    codeSnippet: codeSnippets.Discovery.ListOrganizations.snippet,
    stytchResponse: resp,
  } as ResponseBody<B2BDiscoveryOrganizationsListResponse>);
}

type CreateOrgViaDiscoveryRequest = {
  organizationName: string;
};

/**
 * Allows the end user to create a new Organization with an intermediate session token
 * and authenticate into it.
 */
export async function createOrgViaDiscovery(req: Request, res: Response) {
  const { intermediateSessionToken } = parseTokensFromCookies(req);
  if (!intermediateSessionToken) {
    throw new Error("No intermediate session token found.");
  }

  const createReq = req.body as CreateOrgViaDiscoveryRequest;
  const resp = await StytchClient.discovery.organizations.create({
    intermediate_session_token: intermediateSessionToken,
    organization_name: createReq.organizationName,
  });

  // Set full session token in a cookie and clear the intermediate session cookie.
  res.cookie(StytchSessionKey, resp.session_token);
  res.clearCookie(StytchIntermediateSessionKey);

  res.json({
    method: codeSnippets.Discovery.CreateOrganization.method,
    codeSnippet: codeSnippets.Discovery.CreateOrganization.method,
    stytchResponse: resp,
  } as ResponseBody<B2BDiscoveryOrganizationsCreateResponse>);
}
