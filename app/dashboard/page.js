"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [channels, setChannels] = useState([]);
  const [channelId, setChannelId] = useState('');
  const [message, setMessage] = useState('');
  const [announcementStatus, setAnnouncementStatus] = useState({ type: '', text: '' });

  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [appStatus, setAppStatus] = useState({ type: '', text: '' });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);

  const syncDashboardData = async () => {
    try {
      const res = await fetch('/api/get-bot-logs');
      const data = await res.json();
      
      if (res.ok) {
        setLogs(data.logs || []);
        if (data.channels && data.channels.length > 0) {
          setChannels(data.channels);
          if (!channelId) setChannelId(data.channels[0].id);
        }
        setNetworkError(null);
      } else {
        setNetworkError(data.error || 'Failed to read operational framework data.');
      }
    } catch (err) {
      setNetworkError('Bot backend link down. Check DISCORD_BOT_URL on Vercel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncDashboardData();
    const ticker = setInterval(syncDashboardData, 12000);
    return () => clearInterval(ticker);
  }, [channelId]);

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!channelId) return;
    setAnnouncementStatus({ type: 'loading', text: 'Processing outbound broadcast request...' });

    const res = await fetch('/api/send-announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channelId, message, author: 'Dashboard Administrator' }),
    });

    const data = await res.json();
    if (res.ok) {
      setAnnouncementStatus({ type: 'success', text: '🚀 Message delivered to Discord successfully!' });
      setMessage('');
      syncDashboardData();
    } else {
      setAnnouncementStatus({ type: 'error', text: `❌ Dispatch Failure: ${data.error}` });
    }
  };

  const handleApplicationDecision = async (statusDecision) => {
    if (!userId) {
      setAppStatus({ type: 'error', text: '⚠️ A valid Discord snowflake user ID is required.' });
      return;
    }
    setAppStatus({ type: 'loading', text: 'Transmitting membership directive packet...' });

    const res = await fetch('/api/update-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, status: statusDecision, reason, author: 'Web Portal Reviewer' }),
    });

    const data = await res.json();
    if (res.ok) {
      setAppStatus({ type: 'success', text: `✅ User registration marked as ${statusDecision.toUpperCase()}` });
      setUserId('');
      setReason('');
      syncDashboardData();
    } else {
      setAppStatus({ type: 'error', text: `❌ Communication Failure: ${data.error}` });
    }
  };

  return (
    <div style={{ display: 'block !important', position: 'relative', zIndex: 999999, backgroundColor: '#0e0f11', color: '#e2e2e5', minHeight: '100vh', width: '100vw', fontFamily: 'system-ui, sans-serif', padding: '40px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'block' }}>
        
        <header style={{ borderBottom: '1px solid #2d3139', paddingBottom: '24px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#a8c7ff', letterSpacing: '-0.5px' }}>
            🛡️ DMG Command Terminal
          </h1>
          {networkError ? (
            <div style={{ display: 'inline-block', marginTop: '12px', padding: '6px 12px', backgroundColor: '#561214', border: '1px solid #ba1a1a', borderRadius: '6px', fontSize: '0.85rem', color: '#ffb4ab' }}>
              ⚠️ Connection Alert: {networkError}
            </div>
          ) : (
            <p style={{ color: '#909196', margin: '6px 0 0', fontSize: '0.9rem' }}>
              Connected and streaming runtime event signals.
            </p>
          )}
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          <div style={{ backgroundColor: '#1b1c1f', padding: '24px', borderRadius: '12px', border: '1px solid #2d3139' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.2rem', color: '#ffffff', marginBottom: '16px' }}>
              Broadcast Announcement
            </h2>
            <form onSubmit={handleSendAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: '#c4c6d0', fontWeight: '600' }}>Destination Channel</label>
                {channels.length === 0 ? (
                  <select disabled style={inputStyle}>
                    <option>Loading live channels from bot...</option>
                  </select>
                ) : (
                  <select value={channelId} onChange={(e) => setChannelId(e.target.value)} style={inputStyle}>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id} style={{ backgroundColor: '#1b1c1f' }}>{ch.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: '#c4c6d0', fontWeight: '600' }}>Message Body</label>
                <textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter markdown payload to target channel..." required style={textareaStyle}></textarea>
              </div>
              <button type="submit" disabled={channels.length === 0} style={{ ...btnStyle, backgroundColor: '#385ba9', color: '#ffffff', opacity: channels.length === 0 ? 0.5 : 1 }}>
                Execute Transmission
              </button>
              {announcementStatus.text && <p style={{ color: getStatusColor(announcementStatus.type), margin: 0, fontSize: '0.85rem' }}>{announcementStatus.text}</p>}
            </form>
          </div>

          <div style={{ backgroundColor: '#1b1c1f', padding: '24px', borderRadius: '12px', border: '1px solid #2d3139' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.2rem', color: '#ffffff', marginBottom: '16px' }}>
              Recruitment Decisions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: '#c4c6d0', fontWeight: '600' }}>Applicant Snowflake User ID</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Numerical identifier string..." style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: '#c4c6d0', fontWeight: '600' }}>DM Notice Context Reason (Optional)</label>
                <textarea rows="4" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Provide direct context parameters..." style={textareaStyle}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button onClick={() => handleApplicationDecision('accepted')} style={{ ...btnStyle, flex: 1, backgroundColor: '#006e36', color: '#ffffff' }}>Approve</button>
                <button onClick={() => handleApplicationDecision('denied')} style={{ ...btnStyle, flex: 1, backgroundColor: '#ba1a1a', color: '#ffffff' }}>Reject</button>
              </div>
              {appStatus.text && <p style={{ color: getStatusColor(appStatus.type), margin: 0, fontSize: '0.85rem' }}>{appStatus.text}</p>}
            </div>
          </div>

        </div>

        <div style={{ backgroundColor: '#1b1c1f', padding: '24px', borderRadius: '12px', border: '1px solid #2d3139' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>System Audit Feed Logs</h2>
            <button onClick={syncDashboardData} style={{ backgroundColor: 'transparent', border: '1px solid #43474e', color: '#a8c7ff', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Poll System Feed</button>
          </div>
          
          {loading ? (
            <p style={{ color: '#909196', fontSize: '0.85rem' }}>Querying runtime segments...</p>
          ) : logs.length === 0 ? (
            <p style={{ color: '#68696e', fontStyle: 'italic', fontSize: '0.85rem', margin: 0 }}>No network state changes recorded in this session environment layout.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ backgroundColor: '#0e0f11', padding: '12px 16px', borderRadius: '8px', borderLeft: `3px solid ${log.type.includes('Accept') ? '#006e36' : '#385ba9'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#68696e', marginBottom: '4px' }}>
                    <span><strong>{log.type}</strong> by {log.author}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div style={{ color: '#e2e2e5', fontSize: '0.9rem' }}>
                    <span style={{ color: '#a8c7ff', marginRight: '6px' }}>[{log.channel}]</span> {log.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0e0f11', border: '1px solid #2d3139', color: '#e2e2e5', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' };
const textareaStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#0e0f11', border: '1px solid #2d3139', color: '#e2e2e5', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'none', outline: 'none' };
const btnStyle = { border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' };

const getStatusColor = (type) => {
  if (type === 'success') return '#4ade80';
  if (type === 'error') return '#f87171';
  return '#e2e2e5';
};