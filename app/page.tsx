"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UptimeTab from '@/components/UptimeTab';
import MessagingTab from '@/components/MessagingTab';
import TrialTab from '@/components/TrialTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'uptime' | 'messaging' | 'trials'>('uptime');

  const tabs = [
    { id: 'uptime', label: 'Bot Uptime' },
    { id: 'messaging', label: 'Send Message' },
    { id: 'trials', label: 'Clan Trials' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 selection:bg-indigo-500/30">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Clan Bot HQ
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage bot commands, uptime monitoring, and trial applications.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected to Discord API
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 mb-8 p-1 bg-slate-900/50 backdrop-blur rounded-xl max-w-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg z-10 ${
                activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-indigo-600 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Section */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {activeTab === 'uptime' && <UptimeTab />}
              {activeTab === 'messaging' && <MessagingTab />}
              {activeTab === 'trials' && <TrialTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}