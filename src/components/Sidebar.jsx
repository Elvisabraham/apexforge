import React from 'react';
import logo from '../assets/logo.jpg';

// 🚀 FIXED: We are now explicitly accepting the `userProfile` prop!
export default function Sidebar({ currentView, setCurrentView, userProfile }) {
  const navItems = [
    {
      id: 'Home',
      label: 'Home',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
      id: 'Watch',
      label: 'Watch',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
    },
    {
      id: 'Launch',
      label: 'Forge', // <-- Rebranded!
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
    },
    {
      id: 'Ranks',
      label: 'Ranks',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      id: 'Wallet',
      label: 'Wallet',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    },
  ];

  return (
    <aside className="w-full h-screen sticky top-0 flex flex-col p-4 bg-[#0A0A0A] text-white">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <img src={logo} alt="ApexForge Logo" className="w-8 h-8 rounded-lg object-cover" />
        <span className="font-black text-xl tracking-wider text-white">
          APEX<span className="text-[#089981]">FORGE</span>
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id.toLowerCase())} // Ensures consistent lowercase routing for App.jsx
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all outline-none ${
              currentView.toLowerCase() === item.id.toLowerCase()
                ? 'bg-gradient-to-r from-[#089981]/10 to-transparent text-[#089981] border-l-2 border-[#089981]'
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50 border-l-2 border-transparent'
            }`}
          >
            {item.icon}
            <span className="font-extrabold tracking-wide text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile Bottom */}
      <div className="mt-auto pb-4">
         {/* 🚀 FIXED: Sidebar profile click now opens 'settings' instead of 'profile' */}
         <button onClick={() => setCurrentView('settings')} className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors group">
            <div className="flex items-center gap-3">
                {/* Dynamic Avatar Rendering */}
                <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center text-sm border border-[#089981]/30 shadow-inner overflow-hidden group-hover:border-[#089981] transition-colors">
                  {userProfile?.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    '👨‍💻'
                  )}
                </div>
                <div className="text-left">
                    {/* Dynamic Name Rendering */}
                    <p className="text-sm font-bold text-white tracking-wide truncate max-w-[100px] group-hover:text-[#089981] transition-colors">
                      {userProfile?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-[#089981] font-mono tracking-tighter uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#089981] rounded-full animate-pulse shadow-[0_0_5px_rgba(8,153,129,0.8)]"></span> Connected
                    </p>
                </div>
            </div>
            <span className="text-zinc-500 group-hover:text-white transition-colors text-sm shrink-0">
              <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </span>
         </button>
      </div>
    </aside>
  );
}