import React, { useState, useEffect } from 'react';

// Full 30 Language Dataset Matrix
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
  const [updateStatus, setUpdateStatus] = useState('v2.4.0 (Latest)');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  // Profile & Wallet State
  const [editUsername, setEditUsername] = useState(userProfile?.username || '@ElvisVision');
  const [editBio, setEditBio] = useState(userProfile?.bio || 'Independent Platform Architect & Web3 Developer.');
  const [editAvatar, setEditAvatar] = useState(userProfile?.avatar || null);
  const primaryWalletBalance = "$16,530.00";
  const otherAccounts = [
    { username: 'turbosharkpious', address: 'FihWW...fgskM', balance: '$0.07', avatar: '🦈' }
  ];

  // Security, Alerts & Copy States
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [cloudBackupActive, setCloudBackupActive] = useState(false);
  const [launchFrequency, setLaunchFrequency] = useState('light'); 
  const [mentionsAlert, setMentionsAlert] = useState(true); 
  const [securityAlert, setSecurityAlert] = useState(true); 
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [stakingYieldAlerts, setStakingYieldAlerts] = useState(true);
  
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  
  // Trading Settings
  const [routingMode, setRoutingMode] = useState('smart');
  const [priceToleranceMode, setPriceToleranceMode] = useState('auto');
  const [priceTolerance, setPriceTolerance] = useState(15);

  // Community Settings
  const [twitterLink, setTwitterLink] = useState('https://x.com/apexforge');
  const [telegramLink, setTelegramLink] = useState('https://t.me/apexforge');
  const [allowTrollboxGifs, setAllowTrollboxGifs] = useState(true);
  const [requireHolderVerification, setRequireHolderVerification] = useState(false);
  const [minTokensToChat, setMinTokensToChat] = useState(1000);

  // Support Chat State
  const [supportInput, setSupportInput] = useState('');
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'Apex Support', text: 'Hello! How can we help you navigate the platform today?', isAgent: true, time: '10:01 AM' }
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

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateStatus('v2.4.0 (Latest Version)');
      alert("Apex Forge is completely up to date!");
    }, 1200);
  };

  const handleSendSupport = (textToSend) => {
    if (!textToSend.trim()) return;
    const userMsgId = Date.now();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSupportMessages(prev => [...prev, { id: userMsgId, sender: 'You', text: textToSend, isAgent: false, time: timeNow }]);
    setSupportInput('');
    setTimeout(() => {
      setSupportMessages(prev => [...prev, { id: Date.now() + 1, sender: 'Apex Support', text: "Thanks for reaching out. An agent is reviewing your request and will respond shortly.", isAgent: true, time: timeNow }]);
    }, 1000);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedSeed(true);
      setTimeout(() => setCopiedSeed(false), 2000);
    }
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
      'about': 'main',
      'faqs': 'main',
      'legal': 'main',
      'support': 'main'
    };
    setActiveView(menuMap[activeView] || normalizedInitView);
  };

  // --- NATIVE APP COMPONENTS ---
  function MenuItem({ icon, label, value, onClick }) {
    return (
      <button onClick={onClick} className="w-full flex items-center justify-between py-4 px-4 bg-[#0A0A0A] hover:bg-[#121212] transition-colors border-b border-white/5 last:border-none group">
        <div className="flex items-center space-x-3">
          <span className="text-xl w-6 flex justify-center text-[#089981]">{icon}</span>
          <span className="font-bold text-[15px] text-white">{label}</span>
        </div>
        <div className="flex items-center space-x-2">
          {value && <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{value}</span>}
          <span className="text-zinc-500 text-lg leading-none group-hover:text-[#089981] transition-colors">›</span>
        </div>
      </button>
    );
  }

  function ToggleItem({ label, description, enabled, onToggle, locked = false }) {
    return (
      <div onClick={locked ? null : onToggle} className={`flex items-center justify-between p-4 bg-[#0A0A0A] border-b border-white/5 last:border-none ${locked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-[#121212] transition-colors'}`}>
        <div className="flex-1 pr-4 text-left">
          <p className="text-[15px] font-bold text-white flex items-center gap-2">
            {label}
            {locked && <span className="text-[10px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold">Required</span>}
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
    <div className="flex flex-col w-full h-screen bg-[#000000] text-white font-sans overflow-hidden animate-fadeIn">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* --- HEADER --- */}
      <header className="flex-none z-50 bg-[#000000] pt-4 pb-3 px-4 border-b border-white/10 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-2">
          <button onClick={handleBackNavigation} className="p-2 -ml-2 text-white hover:text-[#089981] hover:bg-white/10 rounded-full transition-colors active:scale-95">
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
             activeView === 'support' ? 'Live Support' :
             activeView === 'legal' ? 'Legal' :
             activeView === 'faqs' ? 'Help & FAQs' :
             activeView === 'about' ? 'About' :
             activeView === 'community' ? 'Social Links' :
             activeView === 'appearance' ? 'Appearance' : 'Document'}
          </h1>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col w-full mx-auto max-w-2xl">
        
          {/* ==================================================== */}
          {/* VIEW 0: ACCOUNTS (WALLET DRAWER) */}
          {/* ==================================================== */}
          {activeView === 'wallet_drawer' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="bg-[#0A0A0A] p-6 border-b border-white/5 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center overflow-hidden mb-4 border border-white/10">
                   {editAvatar ? <img src={editAvatar} alt="You" className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="You" className="w-full h-full object-cover" />}
                </div>
                <h2 className="text-3xl font-bold text-white">{primaryWalletBalance}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-[15px] font-medium text-white">{editUsername}</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded text-zinc-400 font-mono">FzVQ...xCuH</span>
                </div>
                <button onClick={() => setActiveView('editProfile')} className="mt-5 px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="px-4 py-3 mt-2"><span className="text-xs font-bold text-zinc-500 uppercase">Other Accounts</span></div>
              <div className="bg-[#0A0A0A] border-y border-white/5">
                {otherAccounts.map((acc, idx) => (
                  <div key={idx} className="p-4 border-b border-white/5 last:border-none flex items-center justify-between cursor-pointer hover:bg-[#121212] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full border border-white/10 flex items-center justify-center text-lg">{acc.avatar}</div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white">{acc.username}</span>
                        <span className="text-xs text-zinc-500 font-mono">{acc.address}</span>
                      </div>
                    </div>
                    <span className="text-[15px] font-medium text-white">{acc.balance}</span>
                  </div>
                ))}
                
                <button className="w-full p-4 flex items-center gap-3 text-[#089981] hover:bg-[#121212] transition-colors">
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
          {/* VIEW 1: MAIN SETTINGS (FLAT LIST) */}
          {/* ==================================================== */}
          {activeView === 'main' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-4 py-3"><span className="text-xs font-bold text-zinc-500 uppercase">Account</span></div>
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                <MenuItem icon="👤" label="Profile" onClick={() => setActiveView('editProfile')} />
                <MenuItem icon="🛡️" label="Security" onClick={() => setActiveView('security')} />
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">App Settings</span></div>
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                <MenuItem icon="⚡" label="Trading" onClick={() => setActiveView('execution')} />
                <MenuItem icon="🔔" label="Notifications" onClick={() => setActiveView('notifications')} />
                <MenuItem icon="🌐" label="Social Links" onClick={() => setActiveView('community')} />
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">Preferences</span></div>
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                <MenuItem icon="🎨" label="Appearance" value={appearanceMode} onClick={() => setActiveView('appearance')} />
                <MenuItem icon="文" label="Language" value={appLanguage} onClick={() => setActiveView('language')} />
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">More</span></div>
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                <MenuItem icon="ℹ️" label="About Apex Forge" onClick={() => setActiveView('about')} />
                <MenuItem icon="❓" label="Help & FAQs" onClick={() => setActiveView('faqs')} />
                <MenuItem icon="🎧" label="Contact Support" onClick={() => setActiveView('support')} />
                <MenuItem icon="⚖️" label="Legal" onClick={() => setActiveView('legal')} />
              </div>
              
              {/* Disconnect Button & Socials Footer */}
              <div className="p-4 mt-6">
                <button onClick={() => alert("Wallet completely disconnected.")} className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-[15px] py-4 rounded-xl transition-colors border border-rose-500/20">
                  Disconnect Wallet
                </button>
              </div>

              <div className="mt-6 mb-8 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-6">
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></a>
                </div>
                
                <button onClick={handleCheckUpdate} className="text-xs text-zinc-500 hover:text-[#089981] font-mono transition-colors">
                  {isCheckingUpdate ? 'Checking for updates...' : updateStatus}
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: EDIT PROFILE (WEB3 PURE - NO EMAIL) */}
          {/* ==================================================== */}
          {activeView === 'editProfile' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="p-6 flex flex-col items-center justify-center border-b border-white/5 bg-[#0A0A0A]">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center overflow-hidden relative cursor-pointer mb-2 border border-white/10 group">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {editAvatar ? <img src={editAvatar} alt="Preview" className="w-full h-full object-cover z-10" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="Preview" className="w-full h-full object-cover z-10" />}
                  <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-xs font-bold text-white z-10 pointer-events-none transition-all">Change</div>
                </div>
                <span className="text-sm text-[#089981] font-medium">Change Photo</span>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 ml-1">Username</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none mt-1 focus:border-[#089981] transition-colors font-bold" />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 ml-1">Bio</label>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={250} className="w-full h-28 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none mt-1 resize-none focus:border-[#089981] transition-colors leading-relaxed" placeholder="Write something about yourself..." />
                  <div className="text-right text-xs text-zinc-500 mt-1">{editBio.length}/250</div>
                </div>
              </div>

              <div className="p-4 mt-2 space-y-3">
                <button onClick={handleSaveProfile} className="w-full bg-[#089981] text-white font-bold text-[15px] py-4 rounded-xl transition-colors hover:bg-[#06806b]">Save Profile</button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: SECURITY & EXPORTING (WITH COPY BUTTONS) */}
          {/* ==================================================== */}
          {activeView === 'security' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-4 py-3"><span className="text-xs font-bold text-zinc-500 uppercase">Authentication</span></div>
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                 <ToggleItem label="Biometric Auth" description="Use Face ID or Touch ID to log in." enabled={biometricAuth} onToggle={() => setBiometricAuth(!biometricAuth)} />
              </div>
              
              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">Backup & Recovery</span></div>
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                 <ToggleItem label="Cloud Backup" description="Securely back up your wallet to iCloud or Google Drive." enabled={cloudBackupActive} onToggle={() => setCloudBackupActive(!cloudBackupActive)} />
                 <button onClick={() => setActiveView('export_warning')} className="w-full flex items-center justify-between p-4 hover:bg-[#121212] transition-colors text-left border-t border-white/5">
                    <div>
                       <span className="text-[15px] font-medium text-white block">Export Private Key</span>
                       <span className="text-xs text-zinc-500 mt-1 block">Reveal your wallet seed phrase</span>
                    </div>
                    <span className="text-zinc-500 text-lg">›</span>
                 </button>
              </div>
            </div>
          )}

          {activeView === 'export_warning' && (
            <div className="w-full animate-fadeIn duration-200 p-6 flex flex-col items-center text-center">
              <div className="text-amber-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Security Warning</h2>
              <p className="text-[15px] text-zinc-400 mb-8">Never share your private key or seed phrase with anyone. It gives full access to your funds. Apex Forge support will NEVER ask for this.</p>
              
              <button onClick={() => setActiveView('export_reveal')} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-[15px] py-4 rounded-xl transition-colors mb-3">I Understand, Reveal Key</button>
              <button onClick={() => setActiveView('security')} className="w-full py-4 text-zinc-400 font-bold hover:text-white transition-colors">Cancel</button>
            </div>
          )}

          {activeView === 'export_reveal' && (
            <div className="w-full animate-fadeIn duration-200 p-6">
              <h2 className="text-xl font-bold text-white mb-2 text-center">Your Recovery Data</h2>
              <p className="text-[14px] text-red-500 text-center mb-6 bg-red-500/10 p-3 rounded-lg border border-red-500/20">Do not screenshot this page. Write these down on paper.</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-zinc-400">Private Key</p>
                    <button onClick={() => copyToClipboard('4f7a93bd2e1f4c8b9a0e1f2c3d4e5f6a7b8c9d0', 'key')} className="text-[#089981] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                      {copiedKey ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl text-sm font-mono text-white break-all select-all">
                    4f7a93bd2e1f4c8b9a0e1f2c3d4e5f6a7b8c9d0
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-zinc-400">Seed Phrase</p>
                    <button onClick={() => copyToClipboard('alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima', 'seed')} className="text-[#089981] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                      {copiedSeed ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl text-sm font-mono text-white leading-loose select-all">
                    alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveView('security')} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-[15px] py-4 rounded-xl transition-colors mt-8">Done</button>
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
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                <ToggleItem label="Mentions & Tags" description="When someone tags you in chat." enabled={mentionsAlert} locked={true} />
                <ToggleItem label="Security" description="Failed transactions and security alerts." enabled={securityAlert} locked={true} />
                <ToggleItem label="Price Alerts" description="When tokens you watch go up." enabled={priceAlerts} onToggle={() => setPriceAlerts(!priceAlerts)} />
                <ToggleItem label="Yield & Staking" description="When rewards are ready to claim." enabled={stakingYieldAlerts} onToggle={() => setStakingYieldAlerts(!stakingYieldAlerts)} />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: TRADING (EXECUTION) */}
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
                     <p className="text-[15px] font-medium text-[#089981] mb-2 flex items-center gap-2"><span>⚡</span> Auto Routing Active</p>
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
          {/* VIEW: WORLD CLASS SUPPORT CHAT */}
          {/* ==================================================== */}
          {activeView === 'support' && (
            <div className="w-full flex flex-col h-[calc(100vh-80px)] animate-fadeIn duration-200 bg-[#000000]">
              <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar flex flex-col">
                <div className="text-center text-xs text-zinc-500 mb-2 py-2">Today</div>
                
                {supportMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col w-full ${msg.isAgent ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {msg.isAgent && (
                         <div className="w-7 h-7 rounded-full bg-[#089981] flex items-center justify-center text-black text-xs font-black shrink-0 mb-1">A</div>
                      )}
                      <div className={`p-3.5 text-[15px] rounded-2xl ${msg.isAgent ? 'bg-[#1A1A1A] text-white rounded-bl-sm' : 'bg-[#089981] text-white rounded-br-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                    <p className={`text-[10px] text-zinc-500 mt-1 ${msg.isAgent ? 'ml-9' : 'mr-1'}`}>{msg.time}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#0A0A0A] border-t border-white/5">
                 <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
                   <button onClick={() => handleSendSupport("My trade is pending")} className="bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors">My trade is pending</button>
                   <button onClick={() => handleSendSupport("Error deploying coin")} className="bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors">Error deploying coin</button>
                   <button onClick={() => handleSendSupport("Talk to a human")} className="bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors">Talk to a human</button>
                 </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSendSupport(supportInput); }} className="flex gap-2 items-center">
                  <input type="text" value={supportInput} onChange={(e) => setSupportInput(e.target.value)} placeholder="Message Support..." className="flex-1 bg-black border border-white/10 rounded-full px-4 py-3.5 text-[15px] text-white outline-none focus:border-[#089981]" />
                  <button type="submit" className="bg-[#089981] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                     <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: SOCIAL LINKS (COMMUNITY) */}
          {/* ==================================================== */}
          {activeView === 'community' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-4 py-3"><span className="text-xs font-bold text-zinc-500 uppercase">Project Links</span></div>
              <div className="bg-[#0A0A0A] border-y border-white/5 p-4 space-y-4">
                 <div>
                   <label className="text-sm text-zinc-400 ml-1">X (Twitter) URL</label>
                   <input type="text" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none mt-1" />
                 </div>
                 <div>
                   <label className="text-sm text-zinc-400 ml-1">Telegram URL</label>
                   <input type="text" value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none mt-1" />
                 </div>
              </div>

              <div className="px-4 py-3 mt-4"><span className="text-xs font-bold text-zinc-500 uppercase">Trollbox Settings</span></div>
              <div className="border-y border-white/5 bg-[#0A0A0A]">
                 <ToggleItem label="Allow GIFs in Chat" description="Let users post animated GIFs." enabled={allowTrollboxGifs} onToggle={() => setAllowTrollboxGifs(!allowTrollboxGifs)} />
                 <ToggleItem label="Holder-Only Chat" description="Require users to hold your token to speak." enabled={requireHolderVerification} onToggle={() => setRequireHolderVerification(!requireHolderVerification)} />
                 
                 {requireHolderVerification && (
                   <div className="p-4 border-t border-white/5 animate-fadeIn">
                     <label className="text-sm text-zinc-400 mb-1 block">Minimum Tokens Required</label>
                     <input type="number" value={minTokensToChat} onChange={(e) => setMinTokensToChat(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none" />
                   </div>
                 )}
              </div>
              <div className="p-4 mt-2">
                 <button onClick={() => { alert("Saved!"); setActiveView('main'); }} className="w-full bg-[#089981] text-white font-bold text-[15px] py-4 rounded-xl transition-colors">Save Social Settings</button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: ABOUT */}
          {/* ==================================================== */}
          {activeView === 'about' && (
            <div className="w-full animate-fadeIn duration-200 p-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#089981] rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                 <span className="text-5xl text-black font-black">A</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Apex Forge</h2>
              <p className="text-sm text-zinc-500 mb-6 font-mono font-bold">{updateStatus}</p>

              <button onClick={handleCheckUpdate} className="mb-8 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors">
                {isCheckingUpdate ? 'Checking Server...' : 'Check For Updates'}
              </button>
              
              <div className="text-[15px] text-zinc-400 leading-relaxed text-center space-y-4 bg-[#0A0A0A] p-6 rounded-2xl border border-white/5">
                <p>Apex Forge is a decentralized platform built on Solana that lets anyone easily launch and trade tokens natively without requiring upfront liquidity.</p>
                <p>Our mission is to eliminate rug-pulls and developer monopolies by providing a secure, non-custodial gateway for both creators and traders, utilizing an automated mathematical bonding curve to ensure fair launches.</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: ALL 30 LANGUAGES */}
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
          {/* VIEW: LEGAL & FAQS */}
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
              <h2 className="text-xl font-bold text-white mb-4">
                {activeView === 'legal_terms' ? 'Terms of Service' :
                 activeView === 'legal_privacy' ? 'Privacy Policy' :
                 activeView === 'legal_livestream' ? 'Community Guidelines' : 'Fees & Pricing'}
              </h2>
              <div className="text-[15px] text-zinc-400 leading-relaxed space-y-4 bg-[#0A0A0A] border border-white/5 p-5 rounded-xl">
                {activeView === 'legal_terms' && (
                  <>
                    <p>By using the Apex Forge interface, you confirm that you understand the speculative risks inherent to cryptocurrency markets.</p>
                    <p>Apex Forge acts strictly as a decentralized interface. We do not have custody or control over token smart contracts, liquidity pools, or user funds deployed using this system.</p>
                    <p>Cryptographic assets are subject to extreme market volatility. The protocol does not guarantee any financial return. You are responsible for your own wallet and funds.</p>
                  </>
                )}
                {activeView === 'legal_privacy' && (
                  <>
                    <p>We do not store your private keys, seed phrases, or track your personal information.</p>
                    <p>Your wallet data and balances are gathered directly from the public Solana blockchain for your local viewing only. Public blockchain data is visible to everyone.</p>
                    <p>Apex Forge support will never request your private keys or seed phrases under any circumstances.</p>
                  </>
                )}
                {activeView === 'legal_livestream' && (
                  <>
                    <p>Keep the community safe. No illegal, hateful, or abusive content is allowed on the platform or within token metadata.</p>
                    <p>Tokens and accounts that violate community guidelines or attempt to scam users will be blacklisted from the Apex Forge frontend interface immediately.</p>
                  </>
                )}
                {activeView === 'legal_fees' && (
                  <>
                    <p><strong>Network Fee:</strong> It costs a flat 0.05 SOL to create and launch a new token on the platform.</p>
                    <p><strong>Trading Fee:</strong> We charge a 0.5% fee on all buying and selling transactions to sustain the platform infrastructure.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {activeView === 'faqs' && (
            <div className="w-full animate-fadeIn duration-200 border-y border-white/5 bg-[#0A0A0A]">
              {[
                { q: "What is Apex Forge?", a: "Apex Forge is a decentralized platform built on Solana that lets anyone instantly launch and trade tokens without needing initial liquidity." },
                { q: "How much does it cost?", a: "It costs a flat 0.05 SOL network fee to launch a new token. There are no hidden developer fees." },
                { q: "How does the bonding curve work?", a: "Our bonding curve mathematically dictates the token's price. As more SOL is used to buy tokens, the price automatically increases, guaranteeing that there is always liquidity available." },
                { q: "What happens when a token graduates?", a: "When the bonding curve hits its limit (approx. 85 SOL), trading pauses temporarily. The accumulated liquidity is permanently locked and moved to Raydium to create a public liquidity pool." },
                { q: "Are my funds safe?", a: "Yes. The platform is completely non-custodial. This means you hold your own funds at all times, and not even the Apex Forge team can access them." }
              ].map((item, idx) => (
                <details key={idx} className="group border-b border-white/5 last:border-none">
                  <summary className="w-full flex justify-between items-center p-4 cursor-pointer list-none">
                    <span className="text-[15px] font-medium text-white pr-4">{item.q}</span>
                    <span className="text-[#089981] font-bold group-open:rotate-45 transition-transform text-xl">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-[15px] text-zinc-400 leading-relaxed">
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