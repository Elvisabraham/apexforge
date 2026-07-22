import React, { useState, useEffect } from 'react';

// Language Dataset Matrix (Untouched)
const V1_POPULAR_LOCALES = [
  { code: 'en', flag: 'US', native: 'English', english: 'English' },
  { code: 'es', flag: 'ES', native: 'Español', english: 'Spanish' },
  { code: 'pt', flag: 'BR', native: 'Português', english: 'Portuguese' },
  { code: 'fr', flag: 'FR', native: 'Français', english: 'French' },
  { code: 'de', flag: 'DE', native: 'Deutsch', english: 'German' },
  { code: 'it', flag: 'IT', native: 'Italiano', english: 'Italian' },
  { code: 'nl', flag: 'NL', native: 'Nederlands', english: 'Dutch' },
  { code: 'ru', flag: 'RU', native: 'Русский', english: 'Russian' },
  { code: 'zh', flag: 'CN', native: '中文', english: 'Chinese' },
  { code: 'ja', flag: 'JP', native: '日本語', english: 'Japanese' },
  { code: 'ko', flag: 'KR', native: '한국어', english: 'Korean' },
  { code: 'ar', flag: 'SA', native: 'العربية', english: 'Arabic' },
  { code: 'tr', flag: 'TR', native: 'Türkçe', english: 'Turkish' },
  { code: 'hi', flag: 'IN', native: 'हिन्दी', english: 'Hindi' },
  { code: 'pl', flag: 'PL', native: 'Polski', english: 'Polish' },
  { code: 'sv', flag: 'SE', native: 'Svenska', english: 'Swedish' },
  { code: 'no', flag: 'NO', native: 'Norsk', english: 'Norwegian' },
  { code: 'da', flag: 'DK', native: 'Dansk', english: 'Danish' },
  { code: 'fi', flag: 'FI', native: 'Suomi', english: 'Finnish' },
  { code: 'el', flag: 'GR', native: 'Ελληνικά', english: 'Greek' },
  { code: 'hu', flag: 'HU', native: 'Magyar', english: 'Hungarian' },
  { code: 'cs', flag: 'CZ', native: 'Čeština', english: 'Czech' },
  { code: 'ro', flag: 'RO', native: 'Română', english: 'Romanian' },
  { code: 'vi', flag: 'VN', native: 'Tiếng Việt', english: 'Vietnamese' },
  { code: 'id', flag: 'ID', native: 'Bahasa Indonesia', english: 'Indonesian' },
  { code: 'th', flag: 'TH', native: 'ไทย', english: 'Thai' },
  { code: 'he', flag: 'IL', native: 'עברית', english: 'Hebrew' },
  { code: 'uk', flag: 'UA', native: 'Українська', english: 'Ukrainian' },
  { code: 'fil', flag: 'PH', native: 'Filipino', english: 'Filipino' },
  { code: 'ms', flag: 'MY', native: 'Bahasa Melayu', english: 'Malay' }
];

export default function AccountSettingsSystem({ 
  initialView, 
  view, 
  onBack, 
  onCloseSettings, 
  onClose, 
  userProfile, 
  setUserProfile 
}) {
  
  // Navigation State
  const startingView = view || initialView || 'wallet_drawer';
  const closeScreen = onClose || onCloseSettings;
  const normalizedInitView = startingView === 'settings' ? 'main' : startingView;
  const [activeView, setActiveView] = useState(normalizedInitView);

  useEffect(() => {
    setActiveView(startingView === 'settings' ? 'main' : startingView);
  }, [startingView]);

  // Global App Configurations
  const [appLanguage, setAppLanguage] = useState('English');
  const [appearanceMode, setAppearanceMode] = useState('Dark');
  
  // Profile & Wallet State
  const [editUsername, setEditUsername] = useState(userProfile?.username || '@elviscrypto');
  const [editBio, setEditBio] = useState(userProfile?.bio || 'HODL');
  const [editAvatar, setEditAvatar] = useState(userProfile?.avatar || null);
  const primaryWalletBalance = "$16,530.00";
  const otherAccounts = [
    { username: 'turbosharkpious', address: 'FihWW...fgskM', balance: '$0.07', avatar: '🦈' }
  ];

  // Security & Alerts State
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [cloudBackupActive, setCloudBackupActive] = useState(false);
  const [launchFrequency, setLaunchFrequency] = useState('light'); // none | light | heavy
  const [mentionsAlert, setMentionsAlert] = useState(true); 
  const [securityAlert, setSecurityAlert] = useState(true); 
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [stakingYieldAlerts, setStakingYieldAlerts] = useState(true);
  
  // Trading Settings
  const [routingMode, setRoutingMode] = useState('smart');
  const [priceToleranceMode, setPriceToleranceMode] = useState('auto');
  const [priceTolerance, setPriceTolerance] = useState(15);

  // Community Settings
  const [twitterLink, setTwitterLink] = useState('https://x.com/apexforge_portal');
  const [telegramLink, setTelegramLink] = useState('https://t.me/apexforge_portal');
  const [allowTrollboxGifs, setAllowTrollboxGifs] = useState(true);
  const [requireHolderVerification, setRequireHolderVerification] = useState(false);
  const [minTokensToChat, setMinTokensToChat] = useState(1000);

  // Support Chat
  const [supportInput, setSupportInput] = useState('');
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'Support Team', text: 'Hi! How can we help you today?', isAgent: true, time: 'Just now' }
  ]);

  const handleSaveProfile = () => {
    if (setUserProfile) setUserProfile({ username: editUsername, bio: editBio, avatar: editAvatar });
    if (normalizedInitView === 'editProfile') {
      if (closeScreen) closeScreen();
    } else {
      setActiveView(normalizedInitView); 
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSendSupport = (textToSend) => {
    if (!textToSend.trim()) return;
    const userMsgId = Date.now();
    setSupportMessages(prev => [...prev, { id: userMsgId, sender: 'You', text: textToSend, isAgent: false, time: 'Just now' }]);
    setSupportInput('');
    setTimeout(() => {
      setSupportMessages(prev => [...prev, { id: Date.now() + 1, sender: 'Support Team', text: "Thanks for reaching out. We will look into this and get back to you shortly.", isAgent: true, time: 'Just now' }]);
    }, 1000);
  };

  const handleBackNavigation = () => {
    if (activeView === normalizedInitView) {
      if (closeScreen) closeScreen();
      else if (onBack) onBack();
      return;
    }
    if (activeView === 'editProfile' || activeView === 'main') {
      setActiveView(normalizedInitView);
      return;
    }
    const menuMap = { 
      'export_warning': 'security', 
      'export_reveal': 'export_warning', 
      'legal_terms': 'legal', 
      'legal_privacy': 'legal', 
      'legal_livestream': 'legal', 
      'legal_fees': 'legal',
      'security': 'main',
      'execution': 'main',
      'community': 'main',
      'notifications': 'main',
      'appearance': 'main',
      'language': 'main',
      'faqs': 'main',
      'legal': 'main',
      'support': 'main'
    };
    setActiveView(menuMap[activeView] || normalizedInitView);
  };

  // --- FLAT WEB2 COMPONENTS ---
  function MenuItem({ icon, label, value, onClick }) {
    return (
      <button onClick={onClick} className="w-full flex items-center justify-between py-4 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] transition-colors border-b border-white/5 last:border-none">
        <div className="flex items-center space-x-3">
          <span className="text-xl w-6 flex justify-center text-zinc-400">{icon}</span>
          <span className="font-medium text-[15px] text-white">{label}</span>
        </div>
        <div className="flex items-center space-x-2">
          {value && <span className="text-sm text-zinc-500">{value}</span>}
          <span className="text-zinc-500 text-lg leading-none">›</span>
        </div>
      </button>
    );
  }

  function ToggleItem({ label, description, enabled, onToggle, locked = false }) {
    return (
      <div onClick={locked ? null : onToggle} className={`flex items-center justify-between p-4 bg-[#0A0A0A] border-b border-white/5 last:border-none ${locked ? 'opacity-70' : 'cursor-pointer hover:bg-[#1A1A1A] transition-colors'}`}>
        <div className="flex-1 pr-4 text-left">
          <p className="text-[15px] font-medium text-white flex items-center gap-2">
            {label}
            {locked && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold">Required</span>}
          </p>
          {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
        </div>
        <div className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors ${enabled ? 'bg-[#089981] justify-end' : 'bg-zinc-800 justify-start'}`}>
          <div className="w-5 h-5 bg-white rounded-full shadow" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white font-sans overflow-hidden animate-fadeIn">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* --- STANDARD APP HEADER --- */}
      <header className="flex-none z-50 bg-[#050505] pt-4 pb-3 px-4 border-b border-white/10 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-2">
          <button onClick={handleBackNavigation} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95">
            {activeView === normalizedInitView ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            )}
          </button>
          <h1 className="text-lg font-bold text-white">
            {activeView === 'wallet_drawer' ? 'Accounts' :
             activeView === 'main' ? 'Settings' :
             activeView === 'editProfile' ? 'Edit Profile' :
             activeView === 'security' ? 'Security' :
             activeView === 'notifications' ? 'Notifications' :
             activeView === 'execution' ? 'Trading' :
             activeView === 'language' ? 'Language' :
             activeView === 'support' ? 'Support' :
             activeView === 'legal' ? 'Legal' :
             activeView === 'faqs' ? 'FAQs' :
             activeView === 'community' ? 'Social Links' :
             activeView === 'appearance' ? 'Appearance' : 'Document'}
          </h1>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT (Full Width) --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col w-full">
        
          {/* ==================================================== */}
          {/* VIEW: ACCOUNTS (WALLET DRAWER) */}
          {/* ==================================================== */}
          {activeView === 'wallet_drawer' && (
            <div className="w-full animate-fadeIn duration-200">
              
              {/* Primary Account Area */}
              <div className="bg-[#0A0A0A] p-6 border-b border-white/5 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden mb-4">
                   {editAvatar ? <img src={editAvatar} alt="You" className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="You" className="w-full h-full object-cover" />}
                </div>
                <h2 className="text-2xl font-bold text-white">{primaryWalletBalance}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-sm font-medium text-zinc-400">{editUsername}</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-zinc-400 font-mono">FzVQ...xCuH</span>
                </div>
                <button onClick={() => setActiveView('editProfile')} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors">
                  Edit Profile
                </button>
              </div>

              {/* Other Accounts List */}
              <div className="px-4 py-3">
                <span className="text-xs font-bold text-zinc-500 uppercase">Other Accounts</span>
              </div>
              <div className="bg-[#0A0A0A] border-y border-white/5">
                {otherAccounts.map((acc, idx) => (
                  <div key={idx} className="p-4 border-b border-white/5 last:border-none flex items-center justify-between cursor-pointer hover:bg-[#1A1A1A] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-lg">{acc.avatar}</div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white">{acc.username}</span>
                        <span className="text-xs text-zinc-500 font-mono">{acc.address}</span>
                      </div>
                    </div>
                    <span className="text-[15px] font-medium text-white">{acc.balance}</span>
                  </div>
                ))}
                
                <button className="w-full p-4 flex items-center gap-3 text-[#089981] hover:bg-[#1A1A1A] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#089981]/10 flex items-center justify-center text-xl">+</div>
                  <span className="text-[15px] font-medium">Add New Wallet</span>
                </button>
              </div>

              <div className="p-4 mt-4">
                <button onClick={() => setActiveView('main')} className="w-full p-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[15px] font-medium transition-colors flex justify-between items-center">
                  <span>Settings</span>
                  <span className="text-zinc-500 text-lg">›</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: MAIN SETTINGS (FLAT LIST) */}
          {/* ==================================================== */}
          {activeView === 'main' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-4 py-3"><span className="text-xs font-bold text-zinc-500 uppercase">Account</span></div>
              <div className="border-y border-white/5">
                <MenuItem icon="👤" label="Profile" onClick={() => setActiveView('editProfile')} />
                <MenuItem icon="🛡️" label="Security" onClick={() => setActiveView('security')} />
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">App Settings</span></div>
              <div className="border-y border-white/5">
                <MenuItem icon="⚡" label="Trading" onClick={() => setActiveView('execution')} />
                <MenuItem icon="🔔" label="Notifications" onClick={() => setActiveView('notifications')} />
                <MenuItem icon="🌐" label="Community Links" onClick={() => setActiveView('community')} />
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">Preferences</span></div>
              <div className="border-y border-white/5">
                <MenuItem icon="🎨" label="Appearance" value={appearanceMode} onClick={() => setActiveView('appearance')} />
                <MenuItem icon="🌐" label="Language" value={appLanguage} onClick={() => setActiveView('language')} />
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">More</span></div>
              <div className="border-y border-white/5">
                <MenuItem icon="❓" label="Help & FAQs" onClick={() => setActiveView('faqs')} />
                <MenuItem icon="🎧" label="Contact Support" onClick={() => setActiveView('support')} />
                <MenuItem icon="📄" label="Legal" onClick={() => setActiveView('legal')} />
              </div>
              
              <div className="p-6 mt-4 flex justify-center text-center">
                <p className="text-xs text-zinc-600">Apex Forge App v2.4</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: NOTIFICATIONS */}
          {/* ==================================================== */}
          {activeView === 'notifications' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-4 py-3"><span className="text-xs font-bold text-zinc-500 uppercase">New Token Alerts</span></div>
              <div className="bg-[#0A0A0A] p-4 border-y border-white/5">
                <p className="text-[15px] font-medium text-white mb-3">Launch Frequency</p>
                <div className="flex bg-black rounded-lg p-1 border border-white/10">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'light', label: 'Light' },
                    { id: 'heavy', label: 'Heavy' }
                  ].map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => setLaunchFrequency(tier.id)}
                      className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                        launchFrequency === tier.id ? 'bg-[#089981] text-white' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-3 text-center">
                  {launchFrequency === 'none' && 'You will not receive any new token alerts.'}
                  {launchFrequency === 'light' && 'Showing only top launches and graduations.'}
                  {launchFrequency === 'heavy' && 'Showing all token deployments.'}
                </p>
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">Account Alerts</span></div>
              <div className="border-y border-white/5">
                <ToggleItem label="Mentions & Tags" description="When someone tags you in chat." enabled={mentionsAlert} locked={true} />
                <ToggleItem label="Security" description="Failed transactions and security alerts." enabled={securityAlert} locked={true} />
                <ToggleItem label="Price Alerts" description="When tokens you watch go up." enabled={priceAlerts} onToggle={() => setPriceAlerts(!priceAlerts)} />
                <ToggleItem label="Yield & Staking" description="When rewards are ready to claim." enabled={stakingYieldAlerts} onToggle={() => setStakingYieldAlerts(!stakingYieldAlerts)} />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: EXECUTION (TRADING) */}
          {/* ==================================================== */}
          {activeView === 'execution' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-4 py-4">
                <div className="flex bg-[#0A0A0A] rounded-lg p-1 border border-white/10">
                  <button onClick={() => setRoutingMode('smart')} className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${routingMode === 'smart' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>Auto Mode</button>
                  <button onClick={() => setRoutingMode('expert')} className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${routingMode === 'expert' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>Custom Mode</button>
                </div>
              </div>

              {routingMode === 'smart' ? (
                <div className="px-4 py-2">
                   <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4">
                     <p className="text-[15px] font-medium text-white mb-2">Auto Routing Active</p>
                     <p className="text-sm text-zinc-400">We automatically handle slippage and gas to ensure your trades go through fast and safe without errors.</p>
                   </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="px-4 py-3"><span className="text-xs font-bold text-zinc-500 uppercase">Slippage Tolerance</span></div>
                  <div className="bg-[#0A0A0A] p-4 border-y border-white/5 space-y-4">
                    <div className="flex bg-black rounded-lg border border-white/5 p-1 w-full max-w-[200px]">
                      <button onClick={() => setPriceToleranceMode('auto')} className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${priceToleranceMode === 'auto' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>Auto</button>
                      <button onClick={() => setPriceToleranceMode('manual')} className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${priceToleranceMode === 'manual' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>Custom</button>
                    </div>
                    
                    {priceToleranceMode === 'manual' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <input type="number" value={priceTolerance} onChange={(e) => setPriceTolerance(Number(e.target.value))} className="w-24 bg-black border border-white/10 rounded-lg px-3 py-2 text-white font-medium outline-none" />
                          <span className="text-zinc-400">%</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 3, 5, 10].map(val => (
                            <button key={val} onClick={() => setPriceTolerance(val)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${priceTolerance === val ? 'bg-[#089981] border-[#089981] text-white' : 'bg-transparent border-white/10 text-zinc-400'}`}>{val}%</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: SUPPORT */}
          {/* ==================================================== */}
          {activeView === 'support' && (
            <div className="w-full flex flex-col h-[calc(100vh-80px)] animate-fadeIn duration-200 bg-[#050505]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {supportMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isAgent ? 'items-start' : 'items-end'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.isAgent ? 'bg-[#1A1A1A] text-white rounded-tl-sm' : 'bg-[#089981] text-white rounded-tr-sm'}`}>{msg.text}</div>
                    <p className="text-[10px] text-zinc-500 mt-1">{msg.time}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#0A0A0A] border-t border-white/5">
                 <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
                   <button onClick={() => handleSendSupport("My trade is pending")} className="bg-white/5 text-zinc-300 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors">My trade is pending</button>
                   <button onClick={() => handleSendSupport("Error deploying coin")} className="bg-white/5 text-zinc-300 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors">Error deploying coin</button>
                   <button onClick={() => handleSendSupport("Talk to a human")} className="bg-white/5 text-zinc-300 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors">Talk to a human</button>
                 </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSendSupport(supportInput); }} className="flex gap-2">
                  <input type="text" value={supportInput} onChange={(e) => setSupportInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-black border border-white/10 rounded-full px-4 py-2.5 text-sm text-white outline-none focus:border-[#089981]" />
                  <button type="submit" className="bg-[#089981] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">Send</button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: EDIT PROFILE */}
          {/* ==================================================== */}
          {activeView === 'editProfile' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="p-6 flex flex-col items-center justify-center border-b border-white/5">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden relative cursor-pointer mb-2">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {editAvatar ? <img src={editAvatar} alt="Preview" className="w-full h-full object-cover z-10" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="Preview" className="w-full h-full object-cover z-10" />}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-xs font-bold text-white z-10 pointer-events-none">Change</div>
                </div>
                <span className="text-sm text-[#089981] font-medium">Change Photo</span>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 ml-1">Username</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none mt-1" />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 ml-1">Bio</label>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={250} className="w-full h-24 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none mt-1 resize-none" placeholder="Write something about yourself..." />
                  <div className="text-right text-xs text-zinc-500 mt-1">{editBio.length}/250</div>
                </div>
              </div>

              <div className="p-4 mt-4 space-y-3">
                <button onClick={handleSaveProfile} className="w-full bg-white text-black font-bold text-[15px] py-3.5 rounded-xl transition-opacity hover:opacity-90">Save Changes</button>
                <button onClick={() => alert("Wallet disconnected.")} className="w-full text-rose-500 font-bold text-[15px] py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors">Disconnect Wallet</button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: LANGUAGE */}
          {/* ==================================================== */}
          {activeView === 'language' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                {V1_POPULAR_LOCALES.map((loc) => (
                  <button key={loc.code} onClick={() => { setAppLanguage(loc.native); setActiveView('main'); }} className="w-full flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-none hover:bg-[#1A1A1A] transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{loc.flag}</span>
                      <div className="text-left">
                        <p className="text-[15px] font-medium text-white">{loc.native}</p>
                        <p className="text-xs text-zinc-500">{loc.english}</p>
                      </div>
                    </div>
                    {appLanguage === loc.native && <span className="text-[#089981] font-bold text-lg">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: APPEARANCE */}
          {/* ==================================================== */}
          {activeView === 'appearance' && (
            <div className="w-full animate-fadeIn duration-200 px-4 py-4 space-y-3">
              {['Dark', 'Light', 'System'].map((mode) => (
                <button key={mode} onClick={() => setAppearanceMode(mode)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${appearanceMode === mode ? 'bg-[#089981]/10 border-[#089981]' : 'bg-[#0A0A0A] border-white/10 hover:bg-[#1A1A1A]'}`}>
                  <span className={`text-[15px] font-medium ${appearanceMode === mode ? 'text-white' : 'text-zinc-400'}`}>{mode}</span>
                  {appearanceMode === mode && <span className="text-[#089981] font-bold">✓</span>}
                </button>
              ))}
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: LEGAL & FAQS (Flat Layout) */}
          {/* ==================================================== */}
          {activeView === 'legal' && (
            <div className="w-full animate-fadeIn duration-200 border-y border-white/5 bg-[#0A0A0A]">
              {[
                { id: 'legal_terms', title: 'Terms of Service' },
                { id: 'legal_privacy', title: 'Privacy Policy' },
                { id: 'legal_livestream', title: 'Community Guidelines' },
                { id: 'legal_fees', title: 'Fees & Pricing' }
              ].map(item => (
                <button key={item.id} onClick={() => setActiveView(item.id)} className="w-full flex items-center justify-between p-4 hover:bg-[#1A1A1A] border-b border-white/5 last:border-none transition-colors">
                  <span className="text-[15px] font-medium text-white">{item.title}</span>
                  <span className="text-zinc-500 text-lg leading-none">›</span>
                </button>
              ))}
            </div>
          )}

          {['legal_terms', 'legal_privacy', 'legal_livestream', 'legal_fees'].includes(activeView) && (
            <div className="w-full animate-fadeIn duration-200 p-4">
              <h2 className="text-lg font-bold text-white mb-4">
                {activeView === 'legal_terms' ? 'Terms of Service' :
                 activeView === 'legal_privacy' ? 'Privacy Policy' :
                 activeView === 'legal_livestream' ? 'Community Guidelines' : 'Fees & Pricing'}
              </h2>
              <div className="text-[15px] text-zinc-400 leading-relaxed space-y-4">
                {activeView === 'legal_terms' && <><p>By using our service, you agree to these terms.</p><p>We provide a decentralized platform. You are responsible for your own wallet and funds.</p></>}
                {activeView === 'legal_privacy' && <><p>We do not store your private keys or track your personal information.</p><p>Public blockchain data is visible to everyone.</p></>}
                {activeView === 'legal_livestream' && <><p>Keep the community safe. No illegal, hateful, or abusive content is allowed on the platform.</p></>}
                {activeView === 'legal_fees' && <><p>Network fee: 0.05 SOL to create a token.</p><p>Trading fee: 0.5% per transaction.</p></>}
              </div>
            </div>
          )}

          {activeView === 'faqs' && (
            <div className="w-full animate-fadeIn duration-200 border-y border-white/5 bg-[#0A0A0A]">
              {[
                { q: "What is Apex Forge?", a: "Apex Forge is a platform that lets anyone easily launch and trade tokens." },
                { q: "How much does it cost?", a: "It costs a flat 0.05 SOL network fee to launch a new token." },
                { q: "Are my funds safe?", a: "Yes. The platform is non-custodial, meaning you hold your own funds at all times." }
              ].map((item, idx) => (
                <details key={idx} className="group border-b border-white/5 last:border-none">
                  <summary className="w-full flex justify-between items-center p-4 cursor-pointer list-none">
                    <span className="text-[15px] font-medium text-white">{item.q}</span>
                    <span className="text-zinc-500 font-bold group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-[15px] text-zinc-400">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}