"use client";

import { motion } from 'framer-motion';

const mockTrials = [
  { id: '1', name: 'AlphaSniper', status: 'Active', daysLeft: 4 },
  { id: '2', name: 'Vortex_FX', status: 'Pending Review', daysLeft: 0 },
  { id: '3', name: 'GhostRider', status: 'Active', daysLeft: 11 },
];

export default function TrialTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-slate-200 font-bold text-lg">Clan Trial Roster</h3>
        <p className="text-slate-400 text-xs mt-0.5">Promote, extend, or terminate competitive roster trials.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-medium">
              <th className="p-4">Candidate Username</th>
              <th className="p-4">Trial Status</th>
              <th className="p-4">Time Remaining</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            {mockTrials.map((trial) => (
              <tr key={trial.id} className="hover:bg-slate-900/20 transition-colors">
                <td className="p-4 font-semibold text-white">{trial.name}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trial.status === 'Active' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {trial.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{trial.daysLeft} days remaining</td>
                <td className="p-4 text-right space-x-2">
                  <button type="button" className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 font-medium rounded-lg transition-colors">
                    Accept
                  </button>
                  <button type="button" className="text-xs bg-slate-900 hover:bg-rose-950 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-rose-400 px-3 py-1.5 font-medium rounded-lg transition-colors">
                    Fail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}