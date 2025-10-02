import React, { useEffect, useMemo } from 'react';
import {
  B2BIdentityProvider,
  StytchB2B,
  useStytchB2BClient,
  useStytchMember,
  useStytchMemberSession,
} from '@stytch/react/b2b';
import { B2BProducts, StytchEventType } from '@stytch/vanilla-js/b2b';
import { OAuthProviders, StytchB2BUIConfig } from '@stytch/vanilla-js';

/**
 * A higher-order component that enforces a login requirement for the wrapped component.
 * If the user is not logged in, the user is redirected to the login page and the
 * current URL is stored in localStorage to enable return after authentication.
 */
export const withLoginRequired = (Component: React.FC) => () => {
  const { session, isInitialized } = useStytchMemberSession();

  useEffect(() => {
    if (!isInitialized) return;
    if (!session) {
      localStorage.setItem('returnTo', window.location.href);
      window.location.href = '/login';
    }
  }, [session, isInitialized]);

  if (!isInitialized) return null;
  if (!session) return null;
  return <Component />;
};

/**
 * The other half of the withLoginRequired flow
 * Redirects the user to a specified URL stored in local storage or a default location.
 * Behavior:
 * - Checks for a `returnTo` entry in local storage to determine the redirection target.
 * - If `returnTo` exists, clears its value from local storage and navigates to the specified URL.
 * - If `returnTo` does not exist, redirects the user to the default '/todoapp' location.
 */
const onLoginComplete = () => {
  const returnTo = localStorage.getItem('returnTo');
  if (returnTo) {
    localStorage.setItem('returnTo', '');
    window.location.href = returnTo;
  } else {
    window.location.href = '/tickets';
  }
};

/**
 * The Login page implementation for B2B.
 * Kicks off a login flow using Email OTPs or OAuth
 * If rendered on the OAuth callback route, validates the token and starts a session
 */
export function Login() {
  const config = useMemo(
    () =>
      ({
        authFlowType: 'Discovery',
        products: [B2BProducts.oauth, B2BProducts.emailOtp],
        oauthOptions: {
          providers: [{ type: OAuthProviders.Google }],
          loginRedirectURL: window.location.origin + '/authenticate',
          signupRedirectURL: window.location.origin + '/authenticate',
        },
        sessionOptions: {
          sessionDurationMinutes: 60,
        },
      }) satisfies StytchB2BUIConfig,
    [],
  );

  return (
    <StytchB2B
      config={config}
      callbacks={{
        onEvent: (evt) => {
          console.log('StytchB2B onEvent', evt);
          if (evt.type === StytchEventType.AuthenticateFlowComplete) {
            onLoginComplete();
          }
        },
        onError: (err) => console.error('StytchB2B onError', err),
      }}
    />
  );
}

/**
 * The OAuth Authorization page implementation. Wraps the Stytch IdentityProvider UI component.
 * View all configuration options at https://stytch.com/docs/sdks/idp-ui-configuration
 */
export const Authorize = withLoginRequired(function () {
  return (
    <B2BIdentityProvider
      callbacks={{
        onEvent: (evt) => console.log('B2BIdentityProvider onEvent', evt),
        onError: (err) => console.error('B2BIdentityProvider onError', err),
      }}
    />
  );
});

export const Logout = function () {
  const stytch = useStytchB2BClient();
  const { member } = useStytchMember();

  if (!member) return null;

  return (
    <button className="primary" onClick={() => stytch.session.revoke()}>
      {' '}
      Log Out{' '}
    </button>
  );
};
