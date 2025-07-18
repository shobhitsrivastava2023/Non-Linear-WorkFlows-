'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import { setCookie } from 'cookies-next';

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.type === 'regular') {
      router.push('/');
    }
  }, [session, router]);

  const handleGitHubSignIn = () => {
    // If current user is a guest, show confirmation
    if (session?.user?.type === 'guest' && session.user.id) {
      const confirmLink = window.confirm(
        'Linking your GitHub account will preserve your current chat history ' +
          'and allow you to access it from any device. Your guest account will ' +
          'be upgraded to a full account.\n\n' +
          'Do you want to continue?',
      );

      if (confirmLink) {
        // Store guest ID for the upgrade process
        setCookie('guest-upgrade-id', session.user.id, {
          maxAge: 60 * 5, // 5 minutes - enough time for OAuth flow
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        signIn('github', { callbackUrl: '/' });
      }
    } else {
      // Regular GitHub sign-in for non-guest users
      signIn('github', { callbackUrl: '/' });
    }
  };

  const handleGuestSignIn = () => {
    signIn('guest', { callbackUrl: '/' });
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {session?.user?.type === 'guest'
              ? 'Link your GitHub account to save your chat history'
              : "Choose how you'd like to continue"}
          </p>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-16">
          <Button onClick={handleGitHubSignIn} className="w-full" size="lg">
            {session?.user?.type === 'guest'
              ? 'Link GitHub Account'
              : 'Continue with GitHub'}
          </Button>
          <Button
            onClick={handleGuestSignIn}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}
