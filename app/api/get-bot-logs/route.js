import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Fetch live operation details from your Python Pterodactyl container instance
    const botResponse = await fetch(`${process.env.DISCORD_BOT_URL}/api/logs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BOT_API_SECRET}`,
      },
      cache: 'no-store' 
    });

    if (!botResponse.ok) {
      return NextResponse.json({ error: 'Daemon backend refused or returned an invalid status' }, { status: botResponse.status });
    }

    const data = await botResponse.json();
    
    // 2. Return logs along with real dynamic channel maps coming directly from your discord setup configs
    return NextResponse.json({
      logs: data.logs || [],
      channels: data.channels || [
        { id: "1423724198546898954", name: "📢 DMG App Log" },
        { id: "1474157898820223006", name: "📢 Strayed App Log" },
        { id: "1448801418373894255", name: "🛡️ Security Logs" },
        { id: "1423645026516340838", name: "🏆 Member List" },
        { id: "1492158023387320450", name: "🎯 Hitman Orders" }
      ]
    });
  } catch (error) {
    console.error('Vercel Node Proxy Connection Error:', error);
    return NextResponse.json({ 
      error: 'Bot network link dead. Double check DISCORD_BOT_URL on Vercel.',
      logs: [],
      channels: [] 
    }, { status: 500 });
  }
}