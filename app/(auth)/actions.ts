'use server';

import { signIn } from './auth';

export const signInWithGuest = async () => {
  await signIn('guest', { redirectTo: '/' });
};

export const signInWithGitHub = async () => {
  await signIn('github', { redirectTo: '/' });
};
