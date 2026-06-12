import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';

export default function DriveLegalDashboard({ user, onLogout }) {
  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0F172A] border-b border-slate-800 text-white z-30 px-6 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-black text-sm">DL</span>
          </div>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-tight">
              DriveLegal Portal
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
              {user.name?.charAt(0) || 'D'}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">{user.name || 'DriveLegal User'}</p>
              <p className="text-[10px] text-slate-400">Integrated Compliance Portal</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-md transform hover:scale-105"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content: Embedding DriveLegal Next.js App */}
      <main className="flex-1 bg-slate-950 p-2 relative overflow-hidden">
        <iframe
          src="http://localhost:3000"
          className="w-full h-full border-none rounded-xl bg-slate-900"
          title="DriveLegal Dashboard"
        />
      </main>
    </div>
  );
}
