"use client";

import { useState } from 'react';

export default function MessagingTab() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSend} className="max-w-xl space-y-5">
      <div>
        <h3 className="text-slate-200 font-bold text-lg">Broadcast Matrix</h3>
        <p className="text-slate-400 text-xs mt-0.5">Send global notices or announcements via your clan bot directly inside your chat servers.</p>
      </div>

      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message text here..."
          rows={5}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-sm"
          disabled={status === 'sending'}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending' || !message.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 font-semibold text-sm text-white py-3 px-4 rounded-xl transition-all duration-150 transform active:scale-[0.98]"
      >
        {status === 'sending' && 'Deploying Packet...'}
        {status === 'idle' && 'Broadcast to Discord'}
        {status === 'success' && '✓ Transmission Complete'}
        {status === 'error' && '❌ Delivery Failed'}
      </button>
    </form>
  );
}