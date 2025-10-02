import { NextResponse } from 'next/server';

export async function GET() {
  const requiredEnvVars = ['STYTCH_PROJECT_ID', 'STYTCH_PROJECT_SECRET', 'STYTCH_DOMAIN'];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Missing required environment variables',
        missingVars,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'tasklist-nextjs-vercelsdk-fullstack',
  });
}
