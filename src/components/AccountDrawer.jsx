import React from 'react';

export default function AccountDrawer({ 
  isOpen, 
  onClose, 
  userProfile, 
  netWorth = "$16,530.00", 
  onOpenProfile, 
  onOpenSettings 
}) {
  if (!isOpen) return null;

  return (
    // justify-start pins it to the LEFT edge
    <div className="fixed inset-0 z-[200] flex justify-start" onClick={onClose}>
      
      {/* Dark Blur Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose}></div>
      
      <div 
        className="w-[300px] sm:w-[320px] h-full bg-[#0A0A0A] border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.8)] relative z-10 animate-slideRight flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex flex-col flex-1 overflow-y-auto no-scrollbar">
          
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Your Account</h3>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white bg-white/5 rounded-full transition-colors active:scale-95 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/10 rounded-2xl p-5 pb-6 mb-4 shadow-lg relative overflow-hidden flex flex-col gap-4 shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#089981]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div 
                onClick={() => { onClose(); if(onOpenProfile) onOpenProfile(); }}
                className="w-16 h-16 bg-black rounded-full border-2 border-[#089981] flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform shrink-0 shadow-lg"
              >
                {userProfile?.avatar ? <img src={userProfile.avatar} className="w-full h-full object-cover" alt="Avatar"/> : '👤'}
              </div>
              <button 
                onClick={() => { onClose(); if(onOpenProfile) onOpenProfile(); }}
                className="text-[9px] font-black uppercase tracking-wider text-[#089981] bg-[#089981]/10 px-3 py-1.5 rounded-lg hover:bg-[#089981] hover:text-black transition-colors border border-[#089981]/20 cursor-pointer"
              >
                View Profile
              </button>
            </div>

            <div className="flex flex-col relative z-10 pt-1 pb-2">
              <p className="text-xl font-black text-white truncate">{userProfile?.username || '@ElvisVision'}</p>
            </div>

            <div className="flex items-center gap-5 py-3 border-y border-white/[0.05] relative z-10">
              <div className="flex items-center gap-1.5 cursor-pointer group">
                <span className="text-sm font-black text-white group-hover:text-[#089981] transition-colors">340</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Following</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer group">
                <span className="text-sm font-black text-white group-hover:text-[#089981] transition-colors">1,240</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Followers</span>
              </div>
            </div>

            <div className="flex flex-col relative z-10 pt-1">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-1">Estimated Net Worth</span>
              <p className="text-2xl font-black text-white font-mono tracking-tight leading-none">{netWorth}</p>
              
              <div className="flex items-center gap-2 mt-3">
                 <span className="text-sm font-black text-[#089981] font-mono leading-none">+$450.00</span>
                 <span className="text-[9px] font-black bg-[#089981]/10 text-[#089981] px-1.5 py-0.5 rounded uppercase tracking-widest border border-[#089981]/20 shadow-[0_0_10px_rgba(8,153,129,0.1)] leading-none">+2.4% Today</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { onClose(); if(onOpenSettings) onOpenSettings(); }}
            className="w-full py-4 mb-auto rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 active:scale-95 flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Edit Profile & Settings
          </button>

          <div className="mt-6 pt-6 border-t border-white/5 shrink-0">
             <button 
              onClick={() => alert('Live Chat initiated.')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#089981]/10 hover:bg-[#089981]/20 border border-[#089981]/20 rounded-xl transition-colors group mb-4 active:scale-95 shadow-inner cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#089981]/20 flex items-center justify-center text-[#089981]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-[11px] font-bold text-[#089981] group-hover:text-[#00FF66] transition-colors">Live Chat Support</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_8px_rgba(0,255,102,1)]"></span>
            </button>
            <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-rose-500 py-2 transition-colors cursor-pointer">Disconnect Wallet</button>
          </div>
        </div>
      </div>
    </div>
  );
}