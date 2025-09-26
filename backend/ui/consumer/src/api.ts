import { User, Session } from "./types";

export type APIResponse<T> = {
  codeSnippet: string;
  error?: string;
  stytchResponse: T;
};

type BaseResponse = {
  request_id: string;
  status_code: number;
};

type SendMagicLinkEmailResponse = BaseResponse;

export const sendMagicLinkEmail = async (
  email: string
): Promise<APIResponse<SendMagicLinkEmailResponse>> => {
  const response = await fetch("http://localhost:3000/magic_links/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      login_magic_link_url: "http://localhost:3000/authenticate",
      login_expiration_minutes: 60,
      signup_magic_link_url: "http://localhost:3000/authenticate",
      signup_expiration_minutes: 60,
    }),
    credentials: "include",
  });

  return await response.json();
};

type AuthenticateMagicLinkResponse = BaseResponse & {
  user_id: string;
  session_token: string;
  session_jwt: string;
  user: User;
  session: Session;
};

export const authenticateMagicLink = async (
  token: string
): Promise<APIResponse<AuthenticateMagicLinkResponse>> => {
  const response = await fetch(
    "http://localhost:3000/magic_links/authenticate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      credentials: "include",
    }
  );

  return await response.json();
};

type AuthenticateOAuthResponse = BaseResponse & {
  user_id: string;
  session_token: string;
  session_jwt: string;
  user: User;
  session: Session;
};

export const authenticateOAuth = async (
  token: string
): Promise<APIResponse<AuthenticateOAuthResponse>> => {
  const response = await fetch("http://localhost:3000/oauth/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    credentials: "include",
  });

  return await response.json();
};

type GetCurrentSessionResponse = BaseResponse & {
  session: Session;
  session_token: string;
  session_jwt: string;
  user: User;
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
