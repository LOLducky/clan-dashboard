"use client";

import { motion } from 'framer-motion';

export default function UptimeTab() {
  const percentage = 99.7; // Hardcoded example; pull dynamically in production
  const totalOutages = 1;
  const isHealthy = percentage >= 95;

  // SVG math for circle circumference
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Circle Card */}
      <div className="md:col-span-1 bg-slate-900/60 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center">
        <h3 className="text-slate-400 font-semibold text-sm mb-4">Current Uptime</h3>
        
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Gray Background Loop */}
            <circle className="text-slate-800" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={50} cy={50} />
            {/* Animated Glow Progress Loop */}
            <motion.circle
              className={isHealthy ? "text-indigo-500" : "text-rose-500"}
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={50}
              cy={50}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black tracking-tight">{percentage}%</span>
            <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">Past 30d</span>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-slate-200 font-bold text-lg mb-1">System Health Diagnostic</h3>
          <p className="text-slate-400 text-xs">Monitored continuously every 5 minutes from your Vercel deployment.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <p className="text-slate-500 text-xs font-semibold uppercase">Incidents</p>
            <p className="text-xl font-bold text-slate-200 mt-1">{totalOutages} Outage</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <p className="text-slate-500 text-xs font-semibold uppercase">Response Speed</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">42 ms</p>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
          isHealthy ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'} animate-ping`} />
          {isHealthy ? 'All backend bot routines running flawlessly.' : 'Minor degradation detected.'}
        </div>
      </div>
    </div>
  );
}