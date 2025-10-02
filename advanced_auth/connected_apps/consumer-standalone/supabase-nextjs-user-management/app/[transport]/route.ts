import { createMcpHandler, withMcpAuth } from '@vercel/mcp-adapter';
import { getStytchClient } from '@/utils/stytch';
import { initializeMCPServer } from '@/utils/mcp';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';

const authenticatedHandler = withMcpAuth(
  createMcpHandler(initializeMCPServer),
  async (_, token): Promise<AuthInfo | undefined> => {
    if (!token) return;
    const { audience, scope, expires_at, ...rest } = await getStytchClient().idp.introspectTokenLocal(token);
    return {
      token,
      clientId: audience as string,
      scopes: scope.split(' '),
      expiresAt: expires_at,
      extra: rest,
    } satisfies AuthInfo;
  },
  { required: true },
);

export { authenticatedHandler as GET, authenticatedHandler as POST, authenticatedHandler as DELETE };
