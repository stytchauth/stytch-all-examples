'use client';

import { ReactNode } from 'react';
import { StytchProvider as ProviderActual, createStytchClient } from '@stytch/nextjs';

// We initialize the Stytch client using our project's public token which can be found in the Stytch dashboard
const stytch = createStytchClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || '');

const StytchProvider = ({ children }: { children: ReactNode }) => {
  return <ProviderActual stytch={stytch}>{children}</ProviderActual>;
};

export default StytchProvider;
