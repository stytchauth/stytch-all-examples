import {
  DiscoveredOrganization,
  Member,
  MemberDevice,
  MFARequired,
  Organization,
  PrimaryRequired,
  Session,
} from "./types";

export type APIResponse<T> = {
  codeSnippet: string;
  error?: string;
  stytchResponse: T;
};

type APIResponseWithMetadata<T, TMetadata> = APIResponse<T> & {
  metadata: TMetadata;
};

type BaseResponse = {
  request_id: string;
  status_code: number;
};

type SendDiscoveryEmailResponse = BaseResponse;

export const sendDiscoveryEmail = async (
  email: string
): Promise<APIResponse<SendDiscoveryEmailResponse>> => {
  const response = await fetch(
    "http://localhost:3000/magic_links/email/discovery/send",
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ email_address: email }),
      credentials: "include",
    }
  );

  return await response.json();
};

type ListDiscoveredOrganizationsResponse = BaseResponse & {
  email_address: string;
  organization_id_hint: string;
  discovered_organizations?: DiscoveredOrganization[];
};

export const listDiscoveredOrganizations = async (): Promise<
  APIResponseWithMetadata<
    ListDiscoveredOrganizationsResponse,
    { canCreateOrganization: boolean }
  >
> => {
  const response = await fetch(
    "http://localhost:3000/discovery/organizations",
    {
      method: "GET",
      credentials: "include",
    }
  );

  return await response.json();
};

type CreateOrganizationViaDiscoveryResponse = BaseResponse & {
  member_id: string;
  member_authenticated: boolean;
  mfa_required: MFARequired;
  primary_required: PrimaryRequired;
  intermediate_session_token: string;
  session_token: string;
  session_jwt: string;
  member_session: Session;
  member: Member;
  organization: Organization;
  member_device: MemberDevice;
};

export const createOrganizationViaDiscovery = async (
  orgName: string
): Promise<APIResponse<CreateOrganizationViaDiscoveryResponse>> => {
  const response = await fetch(
    "http://localhost:3000/discovery/organizations/create",
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ organizationName: orgName }),
      credentials: "include",
    }
  );

  return await response.json();
};

type ExchangeSessionResponse = BaseResponse & {
  member_id: string;
  session_token: string;
  session_jwt: string;
  intermediate_session_token: string;
  member_authenticated: boolean;
  mfa_required: MFARequired;
  primary_required: PrimaryRequired;
  member_session: Session;
  member: Member;
  member_device: MemberDevice;
  organization: Organization;
};

export const exchangeSession = async (
  orgId: string
): Promise<APIResponse<ExchangeSessionResponse>> => {
  const response = await fetch("http://localhost:3000/sessions/exchange", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ organization_id: orgId }),
    credentials: "include",
  });

  return await response.json();
};

type GetCurrentSessionResponse = BaseResponse & {
  member_session: Session;
  session_token: string;
  session_jwt: string;
  member: Member;
  organization: Organization;
  authorized: boolean;
  verdict: {
    authorized: boolean;
    granting_roles: string[];
  };
};

export const getCurrentSession = async (): Promise<
  APIResponse<GetCurrentSessionResponse>
> => {
  const response = await fetch(`http://localhost:3000/session`, {
    method: "GET",
    credentials: "include",
  });

  return await response.json();
};

export const logout = async (): Promise<APIResponse<BaseResponse>> => {
  const response = await fetch(`http://localhost:3000/logout`, {
    credentials: "include",
  });

  return await response.json();
};
