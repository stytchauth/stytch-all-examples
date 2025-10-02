import { ReactNode } from 'react';
import { StytchB2BProvider as ProviderActual } from '@stytch/react/b2b';
import { createStytchB2BUIClient } from '@stytch/react/b2b/ui';

// We initialize the Stytch client using our project's public token which can be found in the Stytch dashboard
const stytch = createStytchB2BUIClient(
  import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || (window as any).APP_CONFIG?.VITE_STYTCH_PUBLIC_TOKEN || '',
);

const StytchProvider = ({ children }: { children: ReactNode }) => {
  return <ProviderActual stytch={stytch}>{children}</ProviderActual>;
};

export default StytchProvider;
