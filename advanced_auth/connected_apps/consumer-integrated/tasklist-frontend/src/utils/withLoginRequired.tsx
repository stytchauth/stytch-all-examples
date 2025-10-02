import React, { useEffect } from 'react';
import { useStytchUser } from '@stytch/react';

/**
 * A higher-order component that enforces a login requirement for the wrapped component.
 * If the user is not logged in, the user is redirected to the login page and the
 * current URL is stored in localStorage to enable return after authentication.
 */
export const withLoginRequired = (Component: React.FC) => () => {
  const { user, fromCache } = useStytchUser();

  useEffect(() => {
    if (!user && !fromCache) {
      localStorage.setItem('returnTo', window.location.href);
      window.location.href = '/login';
    }
  }, [user, fromCache]);

  if (!user) {
    return null;
  }
  return <Component />;
};
