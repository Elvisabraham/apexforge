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
    // justify-end pins the drawer to the RIGHT side of the screen
    <div className="fixed inset-0 z-[200] flex justify-end" onClick={onClose}>
      
      {/* 🚀 FIXED: Custom animation to make it smoothly slide in from the right edge */}
      <style>{`
        @keyframes slideInRightEdge {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slideInRightEdge { animation: slideInRightEdge 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      {/* Dark Blur Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}></div>
      
      <div 
        className="w-[280px] sm:w-[320px] h-full bg-[#0A0A0C] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.7)] relative z-10 animate-slideInRightEdge flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex flex-col flex-1 overflow-y-auto no-scrollbar">
          
          {/* --- Drawer Header --- */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Your Accounts</h3>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* --- Hero Identity Card --- */}
          <div className="bg-gradient-to-br from-[#121214] to-[#0A0A0C] border border-[#089981]/30 rounded-2xl p-5 mb-6 shadow-[0_8px_30px_rgba(8,153,129,0.1)] relative overflow-hidden group hover:border-[#089981]/60 transition-colors">
            {/* Green Glow Effect */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#089981]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div 
                onClick={() => { onClose(); if(onOpenProfile) onOpenProfile(); }}
                className="w-12 h-12 bg-black rounded-full border-2 border-[#089981] flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-md shrink-0"
              >
                {userProfile?.avatar ? <img src={userProfile.avatar} className="w-full h-full object-cover" alt="avatar" /> : '👤'}
              </div>
              <button 
                onClick={() => { onClose(); if(onOpenSettings) onOpenSettings(); }}
                className="text-[9px] font-black uppercase tracking-widest text-[#089981] bg-[#089981]/10 hover:bg-[#089981]/20 border border-[#089981]/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
            
            <div className="relative z-10">
              <p className="text-[15px] font-bold text-white tracking-wide truncate">{userProfile?.username || '@ElvisVision'}</p>
              <p className="text-2xl font-black text-white font-mono mt-1 tracking-tight">{netWorth}</p>
            </div>
          </div>

          {/* --- Account/Burner List --- */}
          <div className="flex flex-col gap-2 mb-auto">
             <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-1">Burner Wallets</div>
             
             <button className="flex items-center justify-between p-4 bg-[#121214] hover:bg-[#1A1A1E] rounded-xl border border-white/5 text-sm font-bold text-white transition-colors shadow-sm group cursor-pointer">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center text-xs group-hover:border-[#089981]/50 transition-colors">💼</div>
                 <span>Main Wallet</span>
               </div>
               <span className="text-[12px] font-mono text-[#089981] bg-[#089981]/10 px-2 py-1 rounded-md border border-[#089981]/20">{netWorth}</span>
             </button>
             
             <button className="w-full py-4 mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-xl transition-colors border-dashed cursor-pointer">
               + Create New Wallet
             </button>
          </div>

          {/* --- Footer Actions --- */}
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
             <button 
              onClick={() => { onClose(); if(onOpenSettings) onOpenSettings(); }}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-[#089981]/10 hover:bg-[#089981]/20 border border-[#089981]/30 rounded-xl transition-colors group active:scale-95 shadow-inner cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#089981]/20 flex items-center justify-center text-[#089981]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#089981] group-hover:text-white transition-colors">Live Chat Support</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_8px_rgba(0,255,102,1)]"></span>
            </button>

            <button 
              onClick={() => { onClose(); if(onOpenSettings) onOpenSettings(); }}
              className="w-full text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white py-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              App Preferences & Security
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}