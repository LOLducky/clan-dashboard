import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { user_id, status, reason, author } = await request.json();

    if (!user_id || !status) {
      return NextResponse.json({ error: 'Missing user_id or status choice' }, { status: 400 });
    }

    const response = await fetch(`${process.env.DISCORD_BOT_URL}/api/application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOT_API_SECRET}`,
      },
      body: JSON.stringify({ user_id, status, reason, author: author || 'Web Recruiter' }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to dispatch notification' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Vercel API Proxy Error:', error);
    return NextResponse.json({ error: 'Could not reach the Discord bot system.' }, { status: 500 });
  }
}