import React from 'react';
import logo from '../assets/logo.jpg';

export default function Sidebar({ currentView, setCurrentView, userProfile }) {
  const navItems = [
    {
      id: 'Home',
      label: 'Home',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
      id: 'Watch',
      label: 'Watch',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
    },
    {
      id: 'Launch',
      label: 'Forge', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
    },
    {
      id: 'Ranks',
      label: 'Ranks',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      id: 'Wallet',
      label: 'Wallet',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    },
  ];

  return (
    // Shrink width to w-[80px] (20 rem scale) for the mini-sidebar look
    <aside className="w-[80px] h-screen sticky top-0 flex flex-col py-6 border-r border-zinc-800/40 bg-[#0A0A0A] text-white z-50">
      
      {/* Brand Header - Just the Logo Centered */}
      <div className="flex justify-center mb-10">
        <img src={logo} alt="ApexForge Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
      </div>

      {/* Main Navigation - Icons Only */}
      <nav className="flex flex-col gap-4 flex-1 items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            title={item.label} // Native hover tooltip
            onClick={() => setCurrentView(item.id.toLowerCase())}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all outline-none ${
              currentView.toLowerCase() === item.id.toLowerCase()
                ? 'bg-[#089981]/10 text-[#089981] shadow-sm'
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900/80'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Profile Bottom - Avatar Button with Online Dot */}
      <div className="mt-auto pb-4 flex justify-center">
         <button 
           title="Settings"
           onClick={() => setCurrentView('settings')} 
           className="relative group transition-transform hover:scale-105 outline-none"
         >
            <div className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center text-sm border border-zinc-700 overflow-hidden group-hover:border-[#089981] transition-colors">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                '👨‍💻'
              )}
            </div>
            {/* Green Connected Indicator Dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#089981] border-2 border-[#0A0A0A] rounded-full animate-pulse"></span>
         </button>
      </div>
    </aside>
  );
}