import React from 'react';

export default function AccountDrawer({
  isOpen,
  onClose,
  userProfile,
  netWorth = '45,702.07',
  onOpenProfile,
  onOpenSettings
}) {
  if (!isOpen) return null;

  const displayName = userProfile?.name || userProfile?.username || '';
  const rawHandle = userProfile?.tag || userProfile?.handle || '';
  
  const cleanHandle = rawHandle.trim();
  const displayHandle = cleanHandle 
    ? (cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`) 
    : null;

  const numericNetWorth = typeof netWorth === 'string' ? netWorth.replace(/[\$\s]/g, '') : netWorth;

  return (
    <div className="fixed inset-0 z-[200] flex justify-start select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-full h-full bg-[#0A0A0A] border-r border-white/10 flex flex-col justify-between p-5 z-[210] shadow-2xl animate-in slide-in-from-left duration-200">
        
        {/* Top Section */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <span className="text-xs font-black tracking-widest text-zinc-400 uppercase">Your Account</span>
            <button 
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#16171d] text-zinc-400 hover:text-white hover:bg-[#20222b] transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Profile Card */}
          <div className="mt-5 p-4 bg-[#16171d] border border-white/5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-[#089981]/40 text-[#089981] flex items-center justify-center text-lg font-black shadow-inner">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <button 
                type="button"
                onClick={() => {
                if (onOpenProfile) onOpenProfile(); // 1. Tell App.jsx to change the view first
                onClose();                          // 2. Close the drawer second
               }}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#089981] text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer border border-[#089981]/30"
              >
                View Profile
              </button>
            </div>

            <div>
              <h2 className="text-white text-sm font-black tracking-tight">{displayName}</h2>
              {displayHandle && (
                <p className="text-zinc-500 text-xs font-semibold mt-0.5">{displayHandle}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-xs">
              <div>
                <span className="text-white font-bold">340</span> <span className="text-zinc-500">Following</span>
              </div>
              <div>
                <span className="text-white font-bold">1,240</span> <span className="text-zinc-500">Followers</span>
              </div>
            </div>

            {/* Estimated Net Worth */}
            <div className="pt-3 border-t border-white/5">
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider block">Estimated Net Worth</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white text-lg font-black">${numericNetWorth}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold">
                <span className="text-[#089981]">+$450.00</span>
                <span className="text-zinc-500">+2.4% TODAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2.5 pt-4 border-t border-white/5">
          <button 
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSettings) onOpenSettings();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#16171d] hover:bg-[#20222b] border border-white/5 rounded-xl text-xs font-bold text-zinc-200 transition-all cursor-pointer"
          >
            <span>⚙️ Edit Profile & Settings</span>
          </button>

          <div className="p-3 bg-[#16171d]/60 border border-white/5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
              <span className="text-xs font-bold text-zinc-300">Live Chat Support</span>
            </div>
            <span className="text-[10px] text-[#089981] font-bold bg-[#089981]/10 px-2 py-0.5 rounded-full">Online</span>
          </div>
        </div>

      </div>
    </div>
  );
}