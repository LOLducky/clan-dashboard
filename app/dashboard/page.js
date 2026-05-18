"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  // Announcement State
  const [channelId, setChannelId] = useState('');
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
      setAnnouncementStatus({ type: 'success', text: '🚀 Dispatch Successful!' });
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
    <div style={{ backgroundColor: '#1a1c1e', color: '#e3e2e6', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '1px solid #43474e', paddingBottom: '20px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0, color: '#a8c7ff' }}>🛡️ DMG Clan Management Dashboard</h1>
          <p style={{ color: '#c4c6d0', margin: '8px 0 0' }}>Connected to Vercel Core & Discord Proxy Hub</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          
          {/* ANNOUNCEMENT CENTER */}
          <div style={{ backgroundColor: '#2e3033', padding: '24px', borderRadius: '12px', border: '1px solid #43474e' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #43474e', paddingBottom: '10px' }}>📢 Broadcast Announcement</h2>
            <form onSubmit={handleSendAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Discord Channel ID</label>
                <input type="text" value={channelId} onChange={(e) => setChannelId(e.target.value)} placeholder="e.g. 1423724198546898954" required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Message Content</label>
                <textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type markdown text or patch notes..." required style={textareaStyle}></textarea>
              </div>
              <button type="submit" style={{ ...btnStyle, backgroundColor: '#385ba9', color: '#ffffff' }}>Send to Guild Channel</button>
              {announcementStatus.text && <p style={{ color: getStatusColor(announcementStatus.type), margin: 0 }}>{announcementStatus.text}</p>}
            </form>
          </div>

          {/* APPLICATION REVIEWS */}
          <div style={{ backgroundColor: '#2e3033', padding: '24px', borderRadius: '12px', border: '1px solid #43474e' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #43474e', paddingBottom: '10px' }}>📝 Remote Application Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Target Applicant Discord User ID</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="e.g. 1207292667306975263" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Decision Notes / Reason (Optional)</label>
                <textarea rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Provide context sent straight to user DMs..." style={textareaStyle}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleApplicationDecision('accepted')} style={{ ...btnStyle, flex: 1, backgroundColor: '#006e36', color: '#ffffff' }}>Accept Member</button>
                <button onClick={() => handleApplicationDecision('denied')} style={{ ...btnStyle, flex: 1, backgroundColor: '#ba1a1a', color: '#ffffff' }}>Deny Applicant</button>
              </div>
              {appStatus.text && <p style={{ color: getStatusColor(appStatus.type), margin: 0 }}>{appStatus.text}</p>}
            </div>
          </div>

        </div>

        {/* RECENT AUDIT LOG TRACKER */}
        <div style={{ backgroundColor: '#2e3033', padding: '24px', borderRadius: '12px', border: '1px solid #43474e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #43474e', paddingBottom: '10px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>📜 System Interaction Audit History</h2>
            <button onClick={fetchLogs} style={{ backgroundColor: 'transparent', border: '1px solid #8e9199', color: '#a8c7ff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Force Update</button>
          </div>
          
          {loadingLogs ? (
            <p style={{ color: '#c4c6d0' }}>Querying logs sequence...</p>
          ) : logs.length === 0 ? (
            <p style={{ color: '#909196', fontStyle: 'italic' }}>No logged adjustments caught inside this runtime iteration yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ backgroundColor: '#1a1c1e', padding: '14px', borderRadius: '8px', borderLeft: `4px solid ${log.type.includes('Accept') ? '#006e36' : '#385ba9'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#909196', marginBottom: '4px' }}>
                    <span><strong>{log.type}</strong> by {log.author}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div style={{ color: '#e3e2e6' }}>
                    <span style={{ color: '#a8c7ff' }}>[{log.channel}]</span> {log.content}
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

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#1a1c1e', border: '1px solid #43474e', color: '#e3e2e6', boxSizing: 'border-box' };
const textareaStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#1a1c1e', border: '1px solid #43474e', color: '#e3e2e6', boxSizing: 'border-box', resize: 'vertical' };
const btnStyle = { border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', transition: 'opacity 0.2s' };

const getStatusColor = (type) => {
  if (type === 'success') return '#4ade80';
  if (type === 'error') return '#f87171';
  return '#e3e2e6';
};