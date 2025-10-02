'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStytchUser } from '@stytch/nextjs';
import dynamic from 'next/dynamic';

const Login = dynamic(() => import('@/components/Auth').then((mod) => mod.Login), { ssr: false });

export default function LoginPage() {
  const { user, isInitialized } = useStytchUser();
  const router = useRouter();
  // If the Stytch SDK detects a User then redirect to profile; for example if a logged in User navigated directly to this URL.
  useEffect(() => {
    if (isInitialized && user) {
      router.replace('/tasks');
    }
  }, [user, isInitialized, router]);

  return <Login />;
}
