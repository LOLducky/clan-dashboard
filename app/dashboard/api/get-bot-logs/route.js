import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.DISCORD_BOT_URL}/api/logs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BOT_API_SECRET}`,
      },
      // Important for App Router: Prevent Vercel from caching the log outputs aggressively
      cache: 'no-store' 
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to fetch logs' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Vercel API Proxy Error:', error);
    return NextResponse.json({ error: 'Bot is offline or unreachable.' }, { status: 500 });
  }
}