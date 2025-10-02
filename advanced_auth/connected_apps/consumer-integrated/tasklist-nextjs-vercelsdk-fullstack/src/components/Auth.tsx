'use client';

import React from 'react';
import { StytchLogin, IdentityProvider as BaseIdentityProvider, useStytch, useStytchUser } from '@stytch/nextjs';
import { useEffect, useMemo } from 'react';
import { OAuthProviders, OTPMethods, Products, StytchEvent, StytchLoginConfig } from '@stytch/vanilla-js';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * A higher-order component that enforces a login requirement for the wrapped component.
 * If the user is not logged in, the user is redirected to the login page and the
 * current URL is stored in localStorage to enable return after authentication.
 */
export const withLoginRequired = (Component: React.FC) => {
  const WithLoginRequired = () => {
    const router = useRouter();
    const { user, fromCache, isInitialized } = useStytchUser();

    useEffect(() => {
      if (!isInitialized) return;
      if (!user && !fromCache) {
        localStorage.setItem('returnTo', window.location.href);
        router.push('/');
      }
    }, [user, fromCache, isInitialized, router]);

    if (!user) {
      return null;
    }
    return <Component />;
  };

  WithLoginRequired.displayName = `withLoginRequired(${Component.displayName || Component.name})`;
  return WithLoginRequired;
};

/**
 * The other half of the withLoginRequired flow
 * Redirects the user to a specified URL stored in local storage or a default location.
 * Behavior:
 * - Checks for a `returnTo` entry in local storage to determine the redirection target.
 * - If `returnTo` exists, clears its value from local storage and navigates to the specified URL.
 * - If `returnTo` does not exist, redirects the user to the default '/apikey' location.
 */
const onLoginComplete = (router: AppRouterInstance) => {
  const returnTo = localStorage.getItem('returnTo');
  if (returnTo) {
    router.push(returnTo);
  } else {
    router.push('/todos');
  }
};

/*
 * Login configures and renders the StytchLogin component which is a prebuilt UI component for auth powered by Stytch.
 *
 * This component accepts style, config, and callbacks props. To learn more about possible options review the documentation at
 * https://stytch.com/docs/sdks/javascript-sdk#ui-configs.
 */
export const Login = () => {
  const router = useRouter();
  const loginConfig = useMemo<StytchLoginConfig>(
    () => ({
      products: [Products.otp, Products.oauth],
      otpOptions: {
        expirationMinutes: 10,
        methods: [OTPMethods.Email],
      },
      oauthOptions: {
        providers: [{ type: OAuthProviders.Google }],
        loginRedirectURL: window.location.origin + '/authenticate',
        signupRedirectURL: window.location.origin + '/authenticate',
      },
    }),
    [],
  );

  const handleOnLoginComplete = (evt: StytchEvent) => {
    if (evt.type !== 'AUTHENTICATE_FLOW_COMPLETE') return;
    onLoginComplete(router);
  };

  return <StytchLogin config={loginConfig} callbacks={{ onEvent: handleOnLoginComplete }} />;
};

/**
 * The Authentication callback page implementation. Handles completing the login flow after OAuth
 */
export function Authenticate() {
  const client = useStytch();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    client.oauth.authenticate(token, { session_duration_minutes: 60 }).then(() => onLoginComplete(router));
  }, [client, router]);

  return <>Loading...</>;
}

export const IdentityProvider = withLoginRequired(BaseIdentityProvider);

export const Logout = function Logout() {
  const stytch = useStytch();
  const { user } = useStytchUser();

  if (!user) return null;

  return (
    <button type="submit" className="primary" onClick={() => stytch.session.revoke()}>
      {' '}
      Log Out{' '}
    </button>
  );
};
