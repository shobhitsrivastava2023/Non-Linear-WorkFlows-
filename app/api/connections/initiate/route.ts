import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import composio from '@/lib/services/composio';
import { initiateConnectionSchema } from './schema';
import { ChatSDKError } from '@/lib/errors';
// ConnectionRequest type is not exported from @composio/core
type ConnectionRequestResponse = {
  id: string;
  redirectUrl?: string | null;
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  let requestBody: { authConfigId: string };

  try {
    const json = await request.json();
    requestBody = initiateConnectionSchema.parse(json);
  } catch (_) {
    return new ChatSDKError(
      'bad_request:api',
      'Invalid request body',
    ).toResponse();
  }

  try {
    const { authConfigId } = requestBody;
    console.log(authConfigId)
    // Initiate connection with Composio
    const connectionRequest = (await composio.connectedAccounts.initiate(
      session.user.id,
      authConfigId,
      // {
      //   callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/connections/callback`,
      // },
    )) as ConnectionRequestResponse;

    return NextResponse.json({
      redirectUrl: connectionRequest.redirectUrl,
      connectionId: connectionRequest.id,
    });
  } catch (error) {
    console.error('Failed to initiate connection:', error);

    if (error instanceof Error && 'code' in error) {
      // Handle Composio specific errors
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to initiate connection' },
      { status: 500 },
    );
  }
}
