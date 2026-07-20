import React from 'react';

export default function AccountDrawer({ isOpen, onClose, userProfile, netWorth }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}></div>
      <div 
        className="w-[260px] h-full bg-[#0A0A0A] border-l border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.7)] relative z-10 animate-slideRight flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex flex-col flex-1">
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Your Accounts</h3>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white bg-white/5 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          {/* Hero Identity Card */}
          <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/10 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-black rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                {userProfile?.avatar ? <img src={userProfile.avatar} className="w-full h-full object-cover" /> : '👤'}
              </div>
              <button className="text-[9px] font-black uppercase tracking-widest text-[#089981] bg-[#089981]/10 px-2 py-1 rounded-lg">Edit</button>
            </div>
            <p className="text-sm font-black text-white">{userProfile?.name}</p>
            <p className="text-xl font-black text-white font-mono mt-1">{netWorth}</p>
          </div>

          {/* Account/Burner List Placeholder */}
          <div className="flex flex-col gap-2 mb-auto">
             <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Burner Wallets</div>
             <button className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm font-bold text-white transition-colors">
               <span>Main Wallet</span>
               <span className="text-[10px] text-[#089981]">$16,530.00</span>
             </button>
             <button className="w-full py-2 mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
               + Create New Wallet
             </button>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-6 border-t border-white/5">
             <button 
              onClick={() => alert('Live Chat initiated.')}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#089981]/20 flex items-center justify-center text-[#089981]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#089981] transition-colors">Live Chat Support</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
            </button>
            <button className="text-[11px] font-bold text-zinc-500 hover:text-white px-4">App Preferences & Security</button>
          </div>
        </div>
      </div>
    </div>
  );
}