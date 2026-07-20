import React from 'react';

export default function BottomNav({ activePage, setActivePage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-zinc-900 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Tab 1: Home */}
        <button 
          onClick={() => setActivePage('home')}
          className={`flex flex-col items-center flex-1 transition-all ${activePage === 'home' ? 'text-[#089981] scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-bold tracking-wide">Home</span>
        </button>

        {/* Tab 2: Watch */}
        <button 
          onClick={() => setActivePage('watch')}
          className={`flex flex-col items-center flex-1 transition-all ${activePage === 'watch' ? 'text-[#089981] scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          <span className="text-[10px] font-bold tracking-wide">Watch</span>
        </button>

        {/* Tab 3: Forge (The Floating Core) */}
        <button 
          onClick={() => setActivePage('launch')} 
          className="flex flex-col items-center flex-1 transition-all relative -top-3"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 border-4 border-[#050505] ${activePage === 'forge' || activePage === 'launch' ? 'bg-[#089981] text-white shadow-[0_0_20px_rgba(8,153,129,0.4)]' : 'bg-zinc-800 text-zinc-300'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
          </div>
          <span className={`text-[10px] mt-0.5 font-bold tracking-wide ${activePage === 'forge' || activePage === 'launch' ? 'text-[#089981]' : 'text-zinc-500'}`}>
            Forge
          </span>
        </button>

        {/* Tab 4: Ranks */}
        <button 
          onClick={() => setActivePage('ranks')}
          className={`flex flex-col items-center flex-1 transition-all ${activePage === 'ranks' ? 'text-[#089981] scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[10px] font-bold tracking-wide">Ranks</span>
        </button>

        {/* Tab 5: Wallet (Anchored at the end!) */}
        <button 
          onClick={() => setActivePage('wallet')}
          className={`flex flex-col items-center flex-1 transition-all ${activePage === 'wallet' ? 'text-[#089981] scale-105' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <span className="text-[10px] font-bold tracking-wide">Wallet</span>
        </button>

      </div>
    </nav>
  );
}