import React, { useState, useEffect } from 'react';

// Language Dataset Matrix (Untouched, exactly as requested)
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
  
  // Navigation State Matrix
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

  // 🚀 UPGRADED: Security & Alerts State (Pump.fun style settings)
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [cloudBackupActive, setCloudBackupActive] = useState(false);
  const [launchFrequency, setLaunchFrequency] = useState('light'); // none | light | heavy
  const [mentionsAlert, setMentionsAlert] = useState(true); // Required
  const [securityAlert, setSecurityAlert] = useState(true); // Required
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [stakingYieldAlerts, setStakingYieldAlerts] = useState(true);
  
  // Execution Engine Settings
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
    { id: 1, sender: 'ForgeAI Concierge', text: 'Welcome to Apex Forge Core Support. Secure terminal connected.', isAgent: true, time: 'Just now' }
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
      setSupportMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ForgeAI Concierge', text: "Query indexed. Routing to live on-chain data engineers.", isAgent: true, time: 'Just now' }]);
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

  // --- REUSABLE GLASSMORPHIC COMPONENTS ---
  function MenuItem({ icon, label, value, onClick, highlight }) {
    return (
      <button onClick={onClick} className={`w-full flex items-center justify-between p-4 transition-all group border-b border-white/[0.04] last:border-none ${highlight ? 'bg-[#089981]/10 hover:bg-[#089981]/20' : 'bg-black/20 hover:bg-white/5'}`}>
        <div className="flex items-center space-x-4">
          <span className="text-xl w-6 flex justify-center drop-shadow-md">{icon}</span>
          <span className={`font-black text-xs uppercase tracking-widest transition-colors ${highlight ? 'text-[#089981] drop-shadow-[0_0_8px_rgba(8,153,129,0.5)]' : 'text-zinc-300 group-hover:text-white'}`}>{label}</span>
        </div>
        <div className="flex items-center space-x-3">
          {value && <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">{value}</span>}
          <span className="text-zinc-600 group-hover:text-[#089981] transition-transform group-hover:translate-x-1">›</span>
        </div>
      </button>
    );
  }

  function ToggleItem({ label, description, enabled, onToggle, locked = false }) {
    return (
      <div onClick={locked ? null : onToggle} className={`flex items-center justify-between p-4 border-b border-white/[0.04] last:border-none transition-colors ${locked ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:bg-white/[0.02]'}`}>
        <div className="flex-1 pr-4 text-left">
          <p className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            {label}
            {locked && <span className="text-[8px] bg-[#089981]/20 text-[#089981] px-1.5 py-0.5 rounded tracking-widest border border-[#089981]/30">REQ</span>}
          </p>
          {description && <p className="text-[10px] font-medium text-zinc-500 mt-1 leading-relaxed">{description}</p>}
        </div>
        <div className={`w-11 h-6 rounded-full p-1 flex items-center transition-colors shadow-inner ${enabled ? 'bg-[#089981] justify-end' : 'bg-[#1A1A24] justify-start border border-white/5'}`}>
          <div className="w-4 h-4 bg-white rounded-full shadow-md" />
        </div>
      </div>
    );
  }

  function LegalItem({ label, onClick }) {
    return (
      <button onClick={onClick} className="w-full flex items-center justify-between p-5 hover:bg-white/5 border-b border-white/[0.04] last:border-none transition-all group">
        <span className="text-xs font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">{label}</span>
        <span className="text-zinc-600 group-hover:text-[#089981] font-mono text-sm transition-transform group-hover:translate-x-1">↗</span>
      </button>
    );
  }

  function LegalTextBody({ title, content }) {
    return (
      <div className="w-full animate-fadeIn space-y-4 text-left flex flex-col h-full">
        <h3 className="text-xs font-black text-[#089981] font-mono uppercase tracking-widest border-b border-white/10 pb-3">Protocol manifest // {title}</h3>
        <div className="flex-1 bg-[#0A0A0C]/80 border border-white/5 rounded-2xl p-6 overflow-y-auto text-xs text-zinc-400 leading-loose font-medium shadow-inner no-scrollbar">
          {content.split('\n\n').map((para, i) => <p key={i} className="mb-4 text-justify">{para}</p>)}
        </div>
        <button onClick={() => setActiveView('legal')} className="w-full bg-[#121214] hover:bg-[#1A1A1E] border border-white/10 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.5)]">Acknowledge & Return</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#030303] text-white font-sans overflow-hidden animate-fadeIn relative">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* --- PREMIUM BLOOMBERG HEADER --- */}
      <header className="flex-none z-50 bg-[#050505]/80 backdrop-blur-2xl pt-4 pb-3 px-5 border-b border-white/[0.06] flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <button onClick={handleBackNavigation} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors active:scale-95 shrink-0 hover:bg-white/5 rounded-full">
            {activeView === normalizedInitView ? (
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            )}
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-widest text-white uppercase drop-shadow-md">
              {activeView === 'wallet_drawer' ? 'Identity Matrix' :
               activeView === 'main' ? 'Terminal Settings' :
               activeView === 'editProfile' ? 'Profile Data' :
               activeView === 'security' ? 'Vault Security' :
               activeView === 'notifications' ? 'Alert Feeds' :
               activeView === 'execution' ? 'Execution Engine' :
               activeView === 'language' ? 'Localization' :
               activeView === 'support' ? 'Core Support' :
               activeView === 'legal' ? 'Compliance Hub' :
               activeView === 'faqs' ? 'Knowledge Base' :
               activeView === 'community' ? 'Social Anchors' :
               activeView === 'appearance' ? 'Interface Mode' : 'Document View'}
            </h1>
            <span className="text-[8px] font-mono font-bold text-[#089981] tracking-widest uppercase mt-0.5">Apex Forge Secure Link</span>
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative pb-32">
        <div className="flex flex-col px-5 pt-6 gap-6 max-w-2xl mx-auto h-full">
        
          {/* ==================================================== */}
          {/* VIEW 0: THE IDENTITY MATRIX (WALLET DRAWER) */}
          {/* ==================================================== */}
          {activeView === 'wallet_drawer' && (
            <div className="w-full animate-fadeIn duration-200">
              {/* Main Wallet Card */}
              <div onClick={() => { if(closeScreen) closeScreen(); }} className="bg-gradient-to-br from-[#121214] to-[#080808] border border-[#089981]/40 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(8,153,129,0.15)] relative overflow-hidden flex flex-col mb-8 cursor-pointer hover:border-[#089981]/80 hover:shadow-[0_10px_50px_rgba(8,153,129,0.25)] transition-all group">
                {/* Glow effect */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#089981]/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#089981]/30 transition-colors"></div>
                
                <div className="flex justify-between items-start z-10 w-full mb-8">
                  <div className="w-16 h-16 bg-black border-2 border-[#089981] rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(8,153,129,0.4)]">
                     {editAvatar ? <img src={editAvatar} alt="You" className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="You" className="w-full h-full object-cover" />}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setActiveView('editProfile'); }} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full transition-colors text-white shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    <span className="text-[9px] font-black uppercase tracking-widest">Edit</span>
                  </button>
                </div>
                
                <div className="flex justify-between items-end z-10 w-full">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white leading-tight drop-shadow-md">{editUsername.replace('@', '')}</span>
                    <span className="text-xs font-mono font-bold text-[#089981] mt-1 tracking-wider bg-[#089981]/10 px-2 py-0.5 rounded border border-[#089981]/20 w-fit">FzVQv...9xCuH</span>
                  </div>
                  <span className="text-3xl font-black text-white font-mono tracking-tighter drop-shadow-lg">{primaryWalletBalance}</span>
                </div>
              </div>

              {/* Multi-Account Divider */}
              <div className="flex items-center justify-center mb-6 opacity-60">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"></div>
                <span className="px-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">Connected Vaults</span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"></div>
              </div>

              {/* Sub Accounts */}
              <div className="flex flex-col gap-3 mb-8">
                {otherAccounts.map((acc, idx) => (
                  <div key={idx} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#121214] hover:border-white/10 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] group">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-black border border-white/10 rounded-full flex items-center justify-center text-xl overflow-hidden shadow-inner group-hover:border-[#089981]/50 transition-colors">{acc.avatar}</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white tracking-wide">{acc.username}</span>
                        <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-wider">{acc.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-white font-mono">{acc.balance}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#089981]/10 border border-[#089981]/30 hover:bg-[#089981]/20 hover:border-[#089981]/50 text-[#089981] font-black text-xs uppercase py-4 rounded-xl tracking-widest shadow-[0_0_15px_rgba(8,153,129,0.1)] transition-all flex items-center justify-center gap-2">
                <span className="text-lg leading-none mb-0.5">+</span> Deploy Burner Wallet
              </button>

              <button onClick={() => setActiveView('main')} className="w-full flex justify-between items-center p-5 mt-6 border border-white/5 bg-[#0A0A0C] rounded-2xl group hover:border-white/10 transition-all shadow-inner">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 group-hover:text-[#089981] transition-colors">⚙️</span>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">Terminal Settings</span>
                </div>
                <span className="text-zinc-600 group-hover:text-[#089981] transition-transform group-hover:translate-x-1">›</span>
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 1: MAIN DASHBOARD (FULL PLATFORM MANAGEMENT) */}
          {/* ==================================================== */}
          {activeView === 'main' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="bg-[#0A0A0C]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                <MenuItem icon="🪪" label="Profile Data" highlight={true} onClick={() => setActiveView('editProfile')} />
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
                <MenuItem icon="🛡️" label="Vault Security" onClick={() => setActiveView('security')} />
                <MenuItem icon="⚡" label="Execution Engine" onClick={() => setActiveView('execution')} />
                <MenuItem icon="🌐" label="Social Anchors" onClick={() => setActiveView('community')} />
                <MenuItem icon="🔔" label="Alert Feeds" onClick={() => setActiveView('notifications')} />
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
                <MenuItem icon="🎨" label="Interface Mode" value={appearanceMode} onClick={() => setActiveView('appearance')} />
                <MenuItem icon="文" label="Localization" value={appLanguage} onClick={() => setActiveView('language')} />
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
                <MenuItem icon="📚" label="Knowledge Base" onClick={() => setActiveView('faqs')} />
                <MenuItem icon="⚖️" label="Compliance Hub" onClick={() => setActiveView('legal')} />
                
                <button onClick={() => setActiveView('support')} className="w-full flex items-center justify-between p-5 bg-[#089981]/5 hover:bg-[#089981]/15 transition-all group border-t border-white/5">
                  <div className="flex items-center space-x-4">
                    <span className="text-[#089981] text-xl w-6 flex justify-center drop-shadow-[0_0_10px_rgba(8,153,129,0.8)]">🎧</span>
                    <span className="text-[#089981] font-black text-xs tracking-widest uppercase drop-shadow-md">Connect Live Support</span>
                  </div>
                  <span className="text-[#089981] font-mono group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

              {/* Footer Metrics */}
              <div className="mt-8 flex flex-col items-center space-y-4">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Verified Network Links</p>
                <div className="flex space-x-3">
                  {['𝕏', '✈️', '👾'].map((ch, idx) => (
                    <button key={idx} className="w-12 h-12 rounded-full border border-white/10 bg-[#0A0A0C] flex items-center justify-center text-xl text-zinc-400 hover:text-[#089981] hover:border-[#089981]/50 hover:bg-[#089981]/10 transition-all shadow-inner">{ch}</button>
                  ))}
                </div>
                <div className="text-center pt-2">
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest font-bold">APEX FORGE CORE V2.4</p>
                  <p className="text-[8px] text-[#089981] font-mono mt-1 opacity-70">MAINNET BETA DEPLOYED</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: NOTIFICATIONS (Pump.fun Logic Installed) */}
          {/* ==================================================== */}
          {activeView === 'notifications' && (
            <div className="w-full animate-fadeIn duration-200 space-y-5">
              
              {/* Launch Frequency Panel */}
              <div className="bg-[#0A0A0C] border border-[#089981]/30 rounded-2xl p-5 shadow-[0_8px_30px_rgba(8,153,129,0.05)]">
                <div className="flex flex-col mb-4">
                  <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    🚀 New Token Deployments
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Adjust how often new bonding curve deployments push to your screen.</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 bg-[#030303] p-1.5 rounded-xl border border-white/5 shadow-inner">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'light', label: 'Light' },
                    { id: 'heavy', label: 'Heavy' }
                  ].map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => setLaunchFrequency(tier.id)}
                      className={`py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                        launchFrequency === tier.id
                          ? 'bg-[#089981] text-white shadow-[0_0_15px_rgba(8,153,129,0.3)]'
                          : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
                {launchFrequency === 'light' && <p className="text-[9px] text-[#089981] font-mono mt-3 text-center uppercase tracking-wider">Showing only your deployments & graduations</p>}
                {launchFrequency === 'heavy' && <p className="text-[9px] text-amber-500 font-mono mt-3 text-center uppercase tracking-wider">Warning: High volume firehose activated</p>}
              </div>

              {/* Toggles Container */}
              <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                <ToggleItem 
                  label="Mentions & @Tags" 
                  description="Social tags in the trollbox." 
                  enabled={mentionsAlert} 
                  locked={true} 
                />
                <ToggleItem 
                  label="Security & Wallets" 
                  description="Critical transaction failures & alerts." 
                  enabled={securityAlert} 
                  locked={true} 
                />
                <ToggleItem 
                  label="Price Action Triggers" 
                  description="Target alerts when assets pump." 
                  enabled={priceAlerts} 
                  onToggle={() => setPriceAlerts(!priceAlerts)} 
                />
                <ToggleItem 
                  label="Yield & Staking" 
                  description="Notifications when vault rewards are ready." 
                  enabled={stakingYieldAlerts} 
                  onToggle={() => setStakingYieldAlerts(!stakingYieldAlerts)} 
                />
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: EXECUTION (TRADE SETTINGS) */}
          {/* ==================================================== */}
          {activeView === 'execution' && (
            <div className="w-full animate-fadeIn duration-200 space-y-6">
              <div className="flex p-1.5 bg-[#0A0A0C] border border-white/10 rounded-2xl font-sans shadow-inner">
                <button onClick={() => setRoutingMode('smart')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm ${routingMode === 'smart' ? 'bg-[#089981] text-white shadow-[0_0_15px_rgba(8,153,129,0.3)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>Auto Routing</button>
                <button onClick={() => setRoutingMode('expert')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm ${routingMode === 'expert' ? 'bg-white/10 text-white border border-white/5' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>Custom Mode</button>
              </div>

              {routingMode === 'smart' ? (
                <div className="bg-[#089981]/5 border border-[#089981]/20 rounded-2xl p-6 space-y-3 shadow-inner">
                   <p className="text-sm font-black text-[#089981] flex items-center gap-2 tracking-wider"><span>⚡</span> Apex Engine Active</p>
                   <p className="text-xs font-medium text-zinc-400 leading-relaxed text-justify">The default for a reason. The Forge dynamically handles MEV protection, gas spikes, and optimal slippage windows to guarantee sniper-fast execution without failed transactions.</p>
                </div>
              ) : (
                <div className="space-y-6 pb-8">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4 shadow-inner">
                     <span className="text-amber-500 text-lg mt-0.5 drop-shadow-md">⚠️</span>
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Manual Override Danger</p>
                       <p className="text-[11px] font-medium text-amber-500/80 mt-1 leading-relaxed text-justify">Tightening slippage during high-velocity token launches will result in dropped blocks. You assume full risk.</p>
                     </div>
                  </div>
                  
                  {/* Slippage */}
                  <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-5">
                    <div className="flex justify-between items-center">
                      <div className="pr-4">
                        <p className="text-xs font-black text-white uppercase tracking-wider">Slippage Tolerance</p>
                        <p className="text-[10px] font-medium text-zinc-500 mt-1 leading-relaxed">Expected vs actual execution price</p>
                      </div>
                      <div className="flex bg-[#030303] rounded-lg border border-white/5 p-1 shadow-inner shrink-0">
                        <button onClick={() => setPriceToleranceMode('auto')} className={`px-4 py-2 text-[9px] font-black uppercase tracking-wider rounded transition-all ${priceToleranceMode === 'auto' ? 'bg-[#089981] text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}>Auto</button>
                        <button onClick={() => setPriceToleranceMode('manual')} className={`px-4 py-2 text-[9px] font-black uppercase tracking-wider rounded transition-all ${priceToleranceMode === 'manual' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}>Fixed</button>
                      </div>
                    </div>
                    
                    {priceToleranceMode === 'manual' && (
                      <div className="space-y-4 animate-fadeIn border-t border-white/5 pt-5">
                        <div className="bg-[#030303] border border-white/5 rounded-xl p-4 flex justify-between items-center shadow-inner">
                          <input type="number" value={priceTolerance} onChange={(e) => setPriceTolerance(Number(e.target.value))} className="bg-transparent text-[#089981] text-lg font-black font-mono outline-none text-left w-full" />
                          <span className="text-zinc-500 font-black text-lg">%</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 3, 5, 10].map(val => (
                            <button key={val} onClick={() => setPriceTolerance(val)} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all shadow-sm ${priceTolerance === val ? 'bg-[#089981] text-white' : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}`}>{val}%</button>
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
          {/* VIEW: SUPPORT CHAT */}
          {/* ==================================================== */}
          {activeView === 'support' && (
            <div className="w-full h-full animate-fadeIn duration-200 flex flex-col justify-between pt-2">
              <div className="bg-[#089981]/10 border border-[#089981]/20 p-4 rounded-2xl flex items-start gap-4 mb-4 shadow-inner">
                 <span className="text-[#089981] text-lg mt-0.5 drop-shadow-md">🛡️</span>
                 <p className="text-[10px] font-medium text-zinc-300 leading-relaxed text-justify">This secure channel is protected by <span className="text-[#089981] font-black uppercase tracking-widest">Apex AI</span>. Support engineers will never ask for your recovery phrase.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-5 mb-4 pr-2 text-left no-scrollbar">
                {supportMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isAgent ? 'items-start' : 'items-end'}`}>
                    <p className={`text-[8px] font-black uppercase tracking-widest ${msg.isAgent ? 'text-[#089981]' : 'text-zinc-500'} mb-2`}>{msg.sender}</p>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-xs font-medium leading-relaxed shadow-md ${msg.isAgent ? 'bg-[#0A0A0C] border border-white/10 text-zinc-300 rounded-tl-sm' : 'bg-[#089981] text-black font-bold rounded-tr-sm'}`}>{msg.text}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4">
                 <div className="flex flex-wrap gap-2">
                   <button onClick={() => handleSendSupport("Transaction Pending / Stalled")} className="bg-[#0A0A0C] border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm">⏳ Trade Pending</button>
                   <button onClick={() => handleSendSupport("Deployment Disruption Exception")} className="bg-[#0A0A0C] border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm">🚀 Deploy Error</button>
                   <button onClick={() => handleSendSupport("Connect Live Core Engineer")} className="bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm">👨‍💻 Escalate</button>
                 </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendSupport(supportInput); }} className="pt-4 border-t border-white/[0.04] flex gap-3 items-center pb-2">
                <input type="text" value={supportInput} onChange={(e) => setSupportInput(e.target.value)} placeholder="Enter query..." className="flex-1 bg-[#0A0A0C] border border-white/10 rounded-2xl px-5 py-4 text-xs font-medium text-white outline-none focus:border-[#089981]/70 focus:shadow-[0_0_15px_rgba(8,153,129,0.2)] transition-all shadow-inner" />
                <button type="submit" className="bg-[#089981] text-black hover:bg-[#06806b] px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(8,153,129,0.4)] active:scale-95">Send</button>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* THE REMAINING STANDARD VIEWS (Language, Appearance, Legal, Edit Profile) */}
          {/* ==================================================== */}
          
          {activeView === 'editProfile' && (
            <div className="w-full animate-fadeIn duration-200 space-y-6 text-left pt-2">
              <div className="flex flex-col items-center justify-center p-8 bg-[#0A0A0C] border border-white/5 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.5)] mb-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#089981]/50 to-transparent"></div>
                <div className="w-28 h-28 bg-[#030303] border-2 border-[#089981]/50 rounded-full flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-[0_0_30px_rgba(8,153,129,0.2)] mb-5">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {editAvatar ? <img src={editAvatar} alt="Preview" className="w-full h-full object-cover z-10" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="Preview" className="w-full h-full object-cover z-10" />}
                  <div className="absolute inset-0 bg-black/80 hidden group-hover:flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest transition-all z-10 pointer-events-none">Change</div>
                </div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tap visual to alter</p>
              </div>

              <div className="space-y-5 bg-[#0A0A0C] border border-white/5 rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <div>
                  <label className="text-[9px] text-[#089981] uppercase font-black tracking-widest pl-2">Social Handle</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-[#030303] border border-white/10 rounded-xl px-5 py-4 text-sm text-white font-black outline-none focus:border-[#089981] transition-all shadow-inner mt-2" />
                </div>
                <div>
                  <label className="text-[9px] text-[#089981] uppercase font-black tracking-widest pl-2">Public Manifest</label>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={250} className="w-full h-28 bg-[#030303] border border-white/10 rounded-xl p-5 text-sm font-medium mt-2 text-white outline-none focus:border-[#089981] transition-all resize-none shadow-inner" placeholder="Broadcast your intent..." />
                  
                  <div className="flex justify-between items-start mt-3 px-2">
                    <p className="text-[8px] font-medium text-zinc-500 max-w-[75%] leading-relaxed uppercase tracking-wider">
                      Modifying data accepts <button onClick={() => setActiveView('legal_terms')} className="text-[#089981] hover:underline font-black">TOS Terms</button>.
                    </p>
                    <div className="text-right text-[10px] text-zinc-500 font-mono font-bold shrink-0">{editBio.length}/250</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button onClick={handleSaveProfile} className="w-full bg-[#089981] hover:bg-[#06806b] text-black font-black text-xs uppercase py-4 rounded-xl tracking-widest shadow-[0_4px_15px_rgba(8,153,129,0.3)] active:scale-95 transition-all">Write to State</button>
                <button onClick={() => alert("Are you sure? This will disconnect the wallet.")} className="w-full border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-black text-[10px] uppercase py-4 rounded-xl tracking-widest transition-all">Sever Connection</button>
              </div>
            </div>
          )}

          {activeView === 'language' && (
            <div className="w-full animate-fadeIn duration-200 bg-[#0A0A0C] rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              {V1_POPULAR_LOCALES.map((loc) => (
                <button key={loc.code} onClick={() => { setAppLanguage(loc.native); setActiveView('main'); }} className="w-full flex items-center justify-between p-5 border-b border-white/[0.04] hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-5">
                    <span className="text-2xl drop-shadow-md group-hover:scale-110 transition-transform">{loc.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white group-hover:text-[#089981] transition-colors">{loc.native}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{loc.english}</p>
                    </div>
                  </div>
                  {appLanguage === loc.native && <span className="w-6 h-6 rounded-full bg-[#089981] flex items-center justify-center text-black text-xs font-black shadow-[0_0_10px_rgba(8,153,129,0.5)]">✓</span>}
                </button>
              ))}
            </div>
          )}

          {/* Legal / FAQs Data (Unchanged content, upgraded design via LegalTextBody/FaqItem) */}
          {activeView === 'legal' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="bg-[#0A0A0C] border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <LegalItem label="Terms & Conditions" onClick={() => setActiveView('legal_terms')} />
                <LegalItem label="Privacy Architecture" onClick={() => setActiveView('legal_privacy')} />
                <LegalItem label="Livestream Constraints" onClick={() => setActiveView('legal_livestream')} />
                <LegalItem label="Execution Fee Schedule" onClick={() => setActiveView('legal_fees')} />
              </div>
            </div>
          )}
          {activeView === 'legal_terms' && <LegalTextBody title="Terms and Conditions" content="Welcome to Apex Forge Terminal. By interacting with our non-custodial deployment parameters, you explicitly confirm that you understand the speculative risks inherent to on-chain decentralized market setups.\n\nApex Forge acts strictly as an open-source, decentralized portal interface layer. We do not assume authority, custody, or control over token architectures, liquidity pools, or user funds deployed using this system.\n\nCryptographic assets are subject to extreme market volatility. The protocol does not guarantee any financial return, stability, or liquidity. By connecting your wallet, you agree that you are accessing the blockchain at your own absolute risk and hold Apex Forge blameless for any network-level exploits, slippage losses, or smart contract anomalies.\n\nUsers are strictly prohibited from utilizing the Apex Forge infrastructure to facilitate illegal transactions, launder funds, or bypass international financial sanctions. Any detection of such activities will result in immediate frontend blacklisting and termination of interface access." />}
          {activeView === 'legal_privacy' && <LegalTextBody title="Privacy Policy" content="Data collection parameters within Apex Forge are zero-footprint structures. Your RPC endpoints, wallet signatures, and balance arrays are gathered dynamically from the Solana public mainnet telemetry for your local viewing only.\n\nWe do not utilize tracking cookies, and absolutely no client profiling or physical operational metrics are logged to remote centralized storage modules. Your private keys and seed phrases are generated locally and never leave your secure device environment.\n\nAny information shared in the public Trollbox or community channels is permanently recorded on decentralized ledgers or public databases. Exercise extreme caution and never share personally identifiable information (PII). Apex Forge engineers, admins, and support staff will never request your private keys or seed phrases under any circumstances." />}
          {activeView === 'legal_livestream' && <LegalTextBody title="Livestream Policy" content="Broadcast arrays tied to token deployment profiles must maintain community standards. Explicit, toxic, or malicious deployment broadcasts will result in community moderation filter blacklists.\n\nMaintain system-wide integrity across all asset display layers. Any streams attempting to bypass these parameters via alternative routing networks will be severed." />}
          {activeView === 'legal_fees' && <LegalTextBody title="Fee Schedule" content="Deployment parameters match the global V1 specification metrics:\n\n1. Initial Deploy Protocol Fee: Fixed at 0.05 SOL. This guarantees execution space on the blockchain and initializes the metadata parameters.\n\n2. Inbound/Outbound Liquidity Swaps Platform Fee: Variable balance matching exactly 0.5% of total transaction payload value to sustain the portal infrastructure." />}
          
        </div>
      </div>
    </div>
  );
}