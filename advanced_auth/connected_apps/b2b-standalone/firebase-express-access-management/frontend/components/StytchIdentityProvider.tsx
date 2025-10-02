import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { B2BIdentityProvider as BaseIdentityProvider, useStytchB2BClient, useStytchMember } from '@stytch/react/b2b';

/**
 * A higher-order component that enforces a login requirement for the wrapped component.
 * If the user is not logged in, the user is redirected to the login page and the
 * current URL is stored in localStorage to enable return after authentication.
 */
export const withLoginRequired = (Component: React.FC) => {
  const WrappedComponent = () => {
    const router = useNavigate();
    const { member, fromCache, isInitialized } = useStytchMember();

    useEffect(() => {
      if (!isInitialized) return;
      if (!member && !fromCache) {
        localStorage.setItem('returnTo', window.location.href);
        router('/');
      }
    }, [member, fromCache, isInitialized, router]);

    if (!member) {
      return null;
    }
    return <Component />;
  };

  WrappedComponent.displayName = `withLoginRequired(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export const IdentityProvider = withLoginRequired(BaseIdentityProvider);

/**
 * The Authentication callback page implementation. Handles completing the login flow after OAuth
 */
export const Authenticate = () => {
  const client = useStytchB2BClient();
  const router = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    client.oauth.authenticate({ oauth_token: token, session_duration_minutes: 60 }).then(() => {
      const returnTo = localStorage.getItem('returnTo');
      if (returnTo) {
        router(returnTo);
      } else {
        router('/dashboard');
      }
    });
  }, [client, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-gray-500 mb-4">Completing authentication...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
};

export const Logout = () => {
  const stytch = useStytchB2BClient();
  const { member } = useStytchMember();

  if (!member) return null;

  return (
    <button
      type="button"
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      onClick={() => stytch.session.revoke()}
    >
      Log Out
    </button>
  );
};
