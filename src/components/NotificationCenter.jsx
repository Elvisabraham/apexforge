import React, { useState, useEffect } from 'react';

export default function NotificationCenter({ isOpen, onClose, notifications = [], onMarkAsRead }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isSettingsView, setIsSettingsView] = useState(false);

  // 🚀 Pump.fun Style Settings: Launch Frequency & User Preferences
  const [preferences, setPreferences] = useState({
    launchFrequency: 'light', // 'none' | 'light' (Curated/Graduations) | 'heavy' (Full Firehose)
    mentions: true,         // Required social trigger
    security: true,         // Required security trigger
    priceAlerts: false,     // User toggle
    stakingYield: false     // User toggle
  });

  // Request browser native push permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [], );

  if (!isOpen) return null;

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setLaunchFrequency = (freq) => {
    setPreferences(prev => ({ ...prev, launchFrequency: freq }));
  };

  // ⏳ 30-Day Auto-Purge Filter (EARN category items stay permanently)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const persistentNotifications = notifications.filter(notif => {
    if (notif.category === 'EARN') return true; // Staking & Vault records stay forever
    const itemTimestamp = notif.timestamp || Date.now();
    return itemTimestamp > thirtyDaysAgo;
  });

  // Category filter
  const filteredNotifications = persistentNotifications.filter(notif => {
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
            <h2 className="text-xs font-black uppercase tracking-widest text-white">
              {isSettingsView ? 'Notification Settings' : 'Notification Center'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* SETTINGS GEAR TOGGLE */}
            <button 
              onClick={() => setIsSettingsView(!isSettingsView)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isSettingsView ? 'bg-[#089981] text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Notification Settings"
            >
              ⚙️
            </button>
            
            <button 
              onClick={onClose} 
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {isSettingsView ? (
          /* --- SETTINGS TOGGLE PANEL --- */
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Push & Alert Preferences</h3>
              <p className="text-[11px] text-zinc-400">Configure your alert feeds and platform notification volume.</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* 🚀 LAUNCH FREQUENCY SELECTOR (Pump.fun Style) */}
              <div className="p-4 rounded-2xl bg-[#131722] border border-[#089981]/30 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    🚀 New Token Launch Alerts
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Control how many deployment pushes hit your device.</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'light', label: 'Light' },
                    { id: 'heavy', label: 'Heavy' }
                  ].map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => setLaunchFrequency(tier.id)}
                      className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        preferences.launchFrequency === tier.id
                          ? 'bg-[#089981] text-white shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#131722] border border-[#089981]/30 flex items-center justify-between">
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    💬 Chat Mentions & Tags <span className="text-[8px] bg-[#089981]/20 text-[#089981] px-1.5 py-0.2 rounded">Required</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Alerts when someone tags you in trollbox chat.</span>
                </div>
                <div className="w-10 h-6 bg-[#089981] rounded-full p-1 flex items-center justify-end cursor-not-allowed opacity-90">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#131722] border border-[#089981]/30 flex items-center justify-between">
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    🛡️ Security & Wallet <span className="text-[8px] bg-[#089981]/20 text-[#089981] px-1.5 py-0.2 rounded">Required</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Critical transaction and vault protection updates.</span>
                </div>
                <div className="w-10 h-6 bg-[#089981] rounded-full p-1 flex items-center justify-end cursor-not-allowed opacity-90">
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>

              {/* User-Choice Toggles */}
              <div 
                onClick={() => togglePreference('priceAlerts')}
                className="p-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider">📊 Price & Volume Triggers</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">General pumps and target price notifications.</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${preferences.priceAlerts ? 'bg-[#089981] justify-end' : 'bg-zinc-800 justify-start'}`}>
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>

              <div 
                onClick={() => togglePreference('stakingYield')}
                className="p-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider">💰 Staking & Yield Harvests</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Rewards ready for claim in your vaults (Permanent Log).</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${preferences.stakingYield ? 'bg-[#089981] justify-end' : 'bg-zinc-800 justify-start'}`}>
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- NOTIFICATION FEED VIEW --- */
          <>
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

            {/* NOTIFICATION LIST (30-Day Auto Purge with Permanent Earn Retention) */}
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
          </>
        )}
        
      </div>
    </div>
  );
}