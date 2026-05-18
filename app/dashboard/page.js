"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  // Hardcoded Channels to make selection incredibly fast & error-proof
  const CHANNELS = [
    { id: "1423724198546898954", name: "📢 DMG App Log Channel" },
    { id: "1474157898820223006", name: "📢 Strayed App Log Channel" },
    { id: "1448801418373894255", name: "🛡️ Security Log Channel" },
    { id: "1423645026516340838", name: "🏆 Member List Channel" },
    { id: "1492158023387320450", name: "🎯 Hitman Log Channel" }
  ];

  // Announcement State
  const [channelId, setChannelId] = useState(CHANNELS[0].id);
  const [message, setMessage] = useState('');
  const [announcementStatus, setAnnouncementStatus] = useState({ type: '', text: '' });

  // Recruiter Application State
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [appStatus, setAppStatus] = useState({ type: '', text: '' });

  // History System Logs State
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Fetch recent actions from backend
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/get-bot-logs');
      const data = await res.json();
      if (res.ok) setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    setAnnouncementStatus({ type: 'loading', text: 'Sending data package...' });

    const res = await fetch('/api/send-announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channelId, message, author: 'Website UI' }),
    });

    const data = await res.json();
    if (res.ok) {
      setAnnouncementStatus({ type: 'success', text: '🚀 Message Sent Successfully!' });
      setMessage('');
      fetchLogs();
    } else {
      setAnnouncementStatus({ type: 'error', text: `❌ Failed: ${data.error}` });
    }
  };

  const handleApplicationDecision = async (statusDecision) => {
    if (!userId) {
      setAppStatus({ type: 'error', text: '⚠️ Discord User ID required.' });
      return;
    }
    setAppStatus({ type: 'loading', text: 'Processing decision rules...' });

    const res = await fetch('/api/update-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, status: statusDecision, reason, author: 'Web Recruiter' }),
    });

    const data = await res.json();
    if (res.ok) {
      setAppStatus({ type: 'success', text: `✅ User marked as ${statusDecision.toUpperCase()}` });
      setUserId('');
      setReason('');
      fetchLogs();
    } else {
      setAppStatus({ type: 'error', text: `❌ Network Error: ${data.error}` });
    }
  };

  return (
    <div style={{ backgroundColor: '#131314', color: '#e3e2e6', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HEADER SECTION */}
        <header style={{ borderBottom: '1px solid #43474e', paddingBottom: '20px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '700', margin: 0, color: '#a8c7ff', letterSpacing: '0.5px' }}>
            🛡️ DMG Clan Command Center
          </h1>
          <p style={{ color: '#c4c6d0', margin: '6px 0 0', fontSize: '0.95rem' }}>
            Direct API Interface Terminal & System Logs
          </p>
        </header>

        {/* TWO COLUMN INTERACTION PANEL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          
          {/* ANNOUNCEMENT CENTER */}
          <div style={{ backgroundColor: '#1e1f22', padding: '28px', borderRadius: '14px', border: '1px solid #43474e', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.3rem', color: '#ffffff', borderBottom: '1px solid #43474e', paddingBottom: '12px', marginBottom: '20px' }}>
              📢 Broadcast Message
            </h2>
            <form onSubmit={handleSendAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#c4c6d0' }}>Target Guild Channel</label>
                <select value={channelId} onChange={(e) => setChannelId(e.target.value)} style={inputStyle}>
                  {CHANNELS.map(ch => (
                    <option key={ch.id} value={ch.id} style={{ backgroundColor: '#1e1f22' }}>{ch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#c4c6d0' }}>Message Body</label>
                <textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type announcement markdown here..." required style={textareaStyle}></textarea>
              </div>
              <button type="submit" style={{ ...btnStyle, backgroundColor: '#a8c7ff', color: '#003062' }}>Transmit to Channel</button>
              {announcementStatus.text && <p style={{ color: getStatusColor(announcementStatus.type), margin: 0, fontSize: '0.9rem' }}>{announcementStatus.text}</p>}
            </form>
          </div>

          {/* APPLICATION REVIEWS */}
          <div style={{ backgroundColor: '#1e1f22', padding: '28px', borderRadius: '14px', border: '1px solid #43474e', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.3rem', color: '#ffffff', borderBottom: '1px solid #43474e', paddingBottom: '12px', marginBottom: '20px' }}>
              📝 Recruitment Decisions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#c4c6d0' }}>Discord User ID</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="e.g. 1207292667306975263" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#c4c6d0' }}>Decision DM Reason (Optional)</label>
                <textarea rows="4" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Add specific feedback details..." style={textareaStyle}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
                <button onClick={() => handleApplicationDecision('accepted')} style={{ ...btnStyle, flex: 1, backgroundColor: '#46e68b', color: '#003919' }}>Accept</button>
                <button onClick={() => handleApplicationDecision('denied')} style={{ ...btnStyle, flex: 1, backgroundColor: '#ffb4ab', color: '#690005' }}>Deny</button>
              </div>
              {appStatus.text && <p style={{ color: getStatusColor(appStatus.type), margin: 0, fontSize: '0.9rem' }}>{appStatus.text}</p>}
            </div>
          </div>

        </div>

        {/* BOTTOM REAL-TIME AUDIT LOGS */}
        <div style={{ backgroundColor: '#1e1f22', padding: '28px', borderRadius: '14px', border: '1px solid #43474e', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #43474e', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff' }}>📜 Recent Actions Logs Feed</h2>
            <button onClick={fetchLogs} style={{ backgroundColor: 'transparent', border: '1px solid #8e9199', color: '#a8c7ff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Refresh Logs</button>
          </div>
          
          {loadingLogs ? (
            <p style={{ color: '#c4c6d0', fontSize: '0.9rem' }}>Awaiting logs packet data...</p>
          ) : logs.length === 0 ? (
            <p style={{ color: '#909196', fontStyle: 'italic', fontSize: '0.9rem' }}>No logged entries observed during this application instance runtime cycle.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ backgroundColor: '#131314', padding: '16px', borderRadius: '10px', borderLeft: `4px solid ${log.type.includes('Accept') ? '#46e68b' : '#a8c7ff'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#909196', marginBottom: '6px' }}>
                    <span><strong>{log.type}</strong> executed by {log.author}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div style={{ color: '#e3e2e6', fontSize: '0.95rem', lineHeight: '1.4' }}>
                    <span style={{ color: '#a8c7ff', fontWeight: '600', marginRight: '8px' }}>[{log.channel}]</span> {log.content}
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

// Optimized Form Visual Elements
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #43474e', color: '#e3e2e6', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };
const textareaStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#131314', border: '1px solid #43474e', color: '#e3e2e6', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical', outline: 'none' };
const btnStyle = { border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s ease' };

const getStatusColor = (type) => {
  if (type === 'success') return '#46e68b';
  if (type === 'error') return '#ffb4ab';
  return '#e3e2e6';
};