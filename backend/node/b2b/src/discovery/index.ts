import { Request, Response } from "express";
import { clearIntermediateSession, getCookies, setSessionCookie } from "../utils/cookies.js";
import { StytchClient } from "../utils/stytchClient.js";
import {
  B2BDiscoveryOrganizationsCreateResponse,
  B2BDiscoveryOrganizationsListRequest, B2BDiscoveryOrganizationsListResponse
} from "stytch";
import { ResponseBody } from "../utils/response.js";
import { codeSnippets } from "../utils/snippets.js";

/**
 * Uses the intermediate or full session token in the request and returns a list of
 * Organizations that the user is eligible to authenticate into based on the authentication
 * requirements implemented by the Organizations.
 */
export async function listOrganizations(req: Request, res: Response) {
  const cookieJar = getCookies(req);
  if (!cookieJar.sessionCookie && !cookieJar.intermediateSessionCookie) {
    throw new Error("Must have at least one kind of session cookie present.");
  }

  const listOrgRequest: B2BDiscoveryOrganizationsListRequest = {};
  if (cookieJar.sessionCookie) {
    listOrgRequest.session_token = cookieJar.sessionCookie;
  } else if (cookieJar.intermediateSessionCookie) {
    listOrgRequest.intermediate_session_token = cookieJar.intermediateSessionCookie;
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
  const cookieJar = getCookies(req);
  if (!cookieJar.intermediateSessionCookie) {
    throw new Error("No intermediate session token found.");
  }

  const reqBody = req.body as CreateOrgViaDiscoveryRequest;
  const resp = await StytchClient.discovery.organizations.create({
    intermediate_session_token: cookieJar.intermediateSessionCookie,
    organization_name: reqBody.organizationName,
  });

  res = setSessionCookie(res, resp.session_token);
  res = clearIntermediateSession(res);

  res.json({
    method: codeSnippets.Discovery.CreateOrganization.method,
    codeSnippet: codeSnippets.Discovery.CreateOrganization.method,
    stytchResponse: resp,
  } as ResponseBody<B2BDiscoveryOrganizationsCreateResponse>);
}
