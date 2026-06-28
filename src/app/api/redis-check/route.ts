import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Initialize the client (automatically looks for UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in env)
  const redis = Redis.fromEnv();

  try {
    // 2. Perform a ping command
    const pingResponse = await redis.ping(); // Should return "PONG"

    // 3. Test a quick write/read operation to ensure full permissions work
    await redis.set('test_connection_key', 'success', { ex: 10 }); // Expires in 10 seconds
    const writeTest = await redis.get('test_connection_key');

    return NextResponse.json({
      status: 'connected',
      ping: pingResponse,
      readWriteTest: writeTest === 'success' ? 'working' : 'failed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to Upstash Redis',
        details: error.message || error,
      },
      { status: 500 }
    );
  }
}
