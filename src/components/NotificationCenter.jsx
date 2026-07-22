import React, { useState, useEffect } from 'react';

export default function NotificationCenter({ isOpen, onClose, notifications = [], onMarkAsRead }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Request browser native push permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!isOpen) return null;

  // Filter notifications based on the selected category tab
  const filteredNotifications = notifications.filter(notif => {
    if (activeCategory === 'ALL') return true;
    return notif.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-[500] flex justify-end animate-fadeIn select-none font-sans">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md h-full bg-[#0A0A0B] border-l border-white/10 flex flex-col shadow-2xl animate-slideInRight z-10">
        
        {/* HEADER */}
        <div className="p-5 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-xs font-black uppercase tracking-widest text-white">Notification Center</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="px-4 py-3 border-b border-white/5 bg-[#121212]/50">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'ALERTS', label: 'Alerts' },
              { id: 'SOCIAL', label: 'Social' },
              { id: 'FORGE', label: 'Forge' },
              { id: 'EARN', label: 'Earn' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#089981] text-white shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATION LIST (Persistent History - No Clear All Wipe) */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => onMarkAsRead && onMarkAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  notif.read 
                    ? 'bg-black/30 border-white/5 opacity-60' 
                    : 'bg-[#131722] border-[#089981]/30 shadow-[0_0_15px_rgba(8,153,129,0.05)] hover:border-[#089981]/60'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-white/5 text-zinc-400 px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-white/5">
                      {notif.category || 'SYSTEM'}
                    </span>
                    <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>}
                      {notif.title}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">{notif.time}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">{notif.message}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <span className="text-3xl mb-3 opacity-40">📭</span>
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">No notifications in this category</span>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}