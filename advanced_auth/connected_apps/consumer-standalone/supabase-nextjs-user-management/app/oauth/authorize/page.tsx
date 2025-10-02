'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IdentityProvider } from '@stytch/nextjs';
import StytchProvider from '@/components/StytchProvider';
import { createClient } from '@/utils/supabase/client';

export default function AuthenticatePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Only create Supabase client in the browser
      if (typeof window === 'undefined') return;

      const supabase = createClient();
      const res = await supabase.auth.getSession();
      const token = res.data.session?.access_token;

      if (!token) {
        const returnTo = window.location.href;
        router.replace(`/?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      setToken(token);
    };

    checkAuthentication();
  }, [router]);

  if (!token) {
    return null;
  }

  return (
    <StytchProvider>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="header">Stytch OAuth Authorization</h1>
            <IdentityProvider
              authTokenParams={{
                trustedAuthToken: token!,
                tokenProfileID: process.env.NEXT_PUBLIC_STYTCH_TOKEN_PROFILE!,
              }}
            />
          </div>
        </div>
      </div>
    </StytchProvider>
  );
}
