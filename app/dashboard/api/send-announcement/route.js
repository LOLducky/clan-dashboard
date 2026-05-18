import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { channel_id, message, author } = await request.json();

    if (!channel_id || !message) {
      return NextResponse.json({ error: 'Missing channel_id or message content' }, { status: 400 });
    }

    const response = await fetch(`${process.env.DISCORD_BOT_URL}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOT_API_SECRET}`,
      },
      body: JSON.stringify({ channel_id, message, author: author || 'Web Dashboard' }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Bot processing failed' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Vercel API Proxy Error:', error);
    return NextResponse.json({ error: 'Could not connect to the Discord bot backend.' }, { status: 500 });
  }
}