import { useEffect, useState } from 'react';
import { createStytchB2BUIClient } from '@stytch/react/b2b/ui';
import { useAuth } from '@/frontend/contexts/AuthContext';
import StytchProvider from '@/frontend/components/StytchProvider';
import { IdentityProvider } from '@/frontend/components/StytchIdentityProvider';
import { Navigate } from 'react-router-dom';

const stytch = createStytchB2BUIClient(
  import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || (window as any).APP_CONFIG?.VITE_STYTCH_PUBLIC_TOKEN || '',
);

export default function StytchOAuthAuthorize() {
  const { user, token, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const attest = async () => {
      // Since we're in a ProtectedRoute, we know the user is authenticated with Firebase
      // We just need to attest the Firebase session with Stytch
      if (token && !loading) {
        // Check if we've already attested this Firebase session with Stytch
        const hasStytchSession = stytch.session.getInfo().session;
        if (!hasStytchSession) {
          await stytch.session.attest({
            profile_id:
              import.meta.env.VITE_STYTCH_TOKEN_PROFILE || (window as any).APP_CONFIG?.VITE_STYTCH_TOKEN_PROFILE || '',
            token,
            session_duration_minutes: 60,
          });
        }
        setIsReady(true);
      }
    };
    attest();
  }, [loading, token]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Preparing OAuth authorization...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <StytchProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OAuth Authorization</h1>
            <p className="text-gray-600">Complete your authentication to continue</p>
          </div>
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <IdentityProvider />
          </div>
        </div>
      </div>
    </StytchProvider>
  );
}
