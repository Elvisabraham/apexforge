import React, { useState, useEffect } from 'react';

// Language Dataset Matrix
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
  const [editUsername, setEditUsername] = useState(userProfile?.username || '@ElvisVision');
  const [editBio, setEditBio] = useState(userProfile?.bio || 'Independent Platform Architect & Web3 Developer.');
  const [editAvatar, setEditAvatar] = useState(userProfile?.avatar || null);
  const primaryWalletBalance = "$16,530.00";
  const otherAccounts = [
    { username: 'turbosharkpious', address: 'FihWW...fgskM', balance: '$0.07', avatar: '🦈' }
  ];

  // Security & Alerts State
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [cloudBackupActive, setCloudBackupActive] = useState(false);
  const [launchFrequency, setLaunchFrequency] = useState('light'); 
  const [mentionsAlert, setMentionsAlert] = useState(true); 
  const [securityAlert, setSecurityAlert] = useState(true); 
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [stakingYieldAlerts, setStakingYieldAlerts] = useState(true);
  
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
    { id: 1, sender: 'Apex Support', text: 'Hello! How can we help you navigate the platform today?', isAgent: true, time: 'Just now' }
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
      setSupportMessages(prev => [...prev, { id: Date.now() + 1, sender: 'Apex Support', text: "Thanks for reaching out. We have received your message and an agent will be with you shortly.", isAgent: true, time: 'Just now' }]);
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
      <button onClick={onClick} className="w-full flex items-center justify-between py-4 px-5 bg-[#080808] hover:bg-[#121212] transition-colors border-b border-white/5 last:border-none group">
        <div className="flex items-center space-x-4">
          <span className="text-xl w-6 flex justify-center text-[#089981]">{icon}</span>
          <span className="font-bold text-[15px] text-white tracking-wide">{label}</span>
        </div>
        <div className="flex items-center space-x-3">
          {value && <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{value}</span>}
          <span className="text-zinc-600 text-lg leading-none group-hover:text-[#089981] transition-colors">›</span>
        </div>
      </button>
    );
  }

  function ToggleItem({ label, description, enabled, onToggle, locked = false }) {
    return (
      <div onClick={locked ? null : onToggle} className={`flex items-center justify-between p-5 bg-[#080808] border-b border-white/5 last:border-none ${locked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-[#121212] transition-colors'}`}>
        <div className="flex-1 pr-4 text-left">
          <p className="text-[15px] font-bold text-white flex items-center gap-2">
            {label}
            {locked && <span className="text-[9px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-black tracking-widest">Required</span>}
          </p>
          {description && <p className="text-xs font-medium text-zinc-500 mt-1 leading-relaxed">{description}</p>}
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
      <header className="flex-none z-50 bg-[#000000] pt-5 pb-4 px-4 border-b border-white/5 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-2">
          <button onClick={handleBackNavigation} className="p-2 -ml-2 text-white hover:text-[#089981] hover:bg-white/5 rounded-full transition-colors active:scale-95">
            {activeView === normalizedInitView ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            )}
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase tracking-widest text-white">
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
               activeView === 'about' ? 'About' :
               activeView === 'community' ? 'Social Links' :
               activeView === 'appearance' ? 'Appearance' : 'Document'}
            </h1>
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col pt-4">
        
          {/* ==================================================== */}
          {/* VIEW: ACCOUNTS (WALLET DRAWER) */}
          {/* ==================================================== */}
          {activeView === 'wallet_drawer' && (
            <div className="w-full animate-fadeIn duration-200">
              
              <div className="bg-[#080808] mx-4 rounded-3xl p-8 border border-[#089981]/20 flex flex-col items-center justify-center text-center shadow-[0_4px_30px_rgba(8,153,129,0.05)]">
                <div className="w-24 h-24 bg-black border-2 border-[#089981] rounded-full flex items-center justify-center overflow-hidden mb-5 shadow-lg">
                   {editAvatar ? <img src={editAvatar} alt="You" className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="You" className="w-full h-full object-cover" />}
                </div>
                <h2 className="text-3xl font-black text-white font-mono tracking-tighter">{primaryWalletBalance}</h2>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-[15px] font-bold text-white tracking-wide">{editUsername}</span>
                  <span className="text-[10px] bg-[#089981]/10 border border-[#089981]/20 px-2 py-1 rounded text-[#089981] font-mono font-bold tracking-widest">FzVQ...xCuH</span>
                </div>
                <button onClick={() => setActiveView('editProfile')} className="mt-6 px-8 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] uppercase tracking-widest font-black rounded-full transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="px-6 py-4 mt-2"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Other Accounts</span></div>
              <div className="bg-[#080808] border-y border-white/5 px-4">
                {otherAccounts.map((acc, idx) => (
                  <div key={idx} className="py-4 border-b border-white/5 last:border-none flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors rounded-xl px-2">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-black border border-white/10 rounded-full flex items-center justify-center text-xl">{acc.avatar}</div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-white">{acc.username}</span>
                        <span className="text-[10px] text-zinc-500 font-mono font-bold">{acc.address}</span>
                      </div>
                    </div>
                    <span className="text-[15px] font-black font-mono text-white">{acc.balance}</span>
                  </div>
                ))}
                
                <button className="w-full py-5 flex items-center gap-4 text-[#089981] hover:bg-white/5 transition-colors rounded-xl px-2 group">
                  <div className="w-11 h-11 rounded-full bg-[#089981]/10 flex items-center justify-center text-xl font-light group-hover:bg-[#089981]/20 transition-colors">+</div>
                  <span className="text-[15px] font-bold tracking-wide">Add New Wallet</span>
                </button>
              </div>

              <div className="p-4 mt-6">
                <button onClick={() => setActiveView('main')} className="w-full p-5 bg-[#080808] hover:bg-[#121212] border border-white/5 text-white rounded-2xl text-[15px] font-bold transition-colors flex justify-between items-center group shadow-sm">
                  <span className="tracking-wide">Settings</span>
                  <span className="text-zinc-500 text-lg group-hover:text-[#089981] transition-colors">›</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: MAIN SETTINGS (FLAT LIST) */}
          {/* ==================================================== */}
          {activeView === 'main' && (
            <div className="w-full animate-fadeIn duration-200">
              
              {/* Account Group */}
              <div className="px-5 py-3"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Account</span></div>
              <div className="border-y border-white/5 bg-[#080808]">
                <MenuItem icon="👤" label="Profile" onClick={() => setActiveView('editProfile')} />
                <MenuItem icon="🛡️" label="Security" onClick={() => setActiveView('security')} />
              </div>

              {/* App Settings Group */}
              <div className="px-5 py-3 mt-4"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">App Settings</span></div>
              <div className="border-y border-white/5 bg-[#080808]">
                <MenuItem icon="⚡" label="Trading" onClick={() => setActiveView('execution')} />
                <MenuItem icon="🔔" label="Notifications" onClick={() => setActiveView('notifications')} />
                <MenuItem icon="🌐" label="Community Links" onClick={() => setActiveView('community')} />
              </div>

              {/* Preferences Group */}
              <div className="px-5 py-3 mt-4"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Preferences</span></div>
              <div className="border-y border-white/5 bg-[#080808]">
                <MenuItem icon="🎨" label="Appearance" value={appearanceMode} onClick={() => setActiveView('appearance')} />
                <MenuItem icon="文" label="Language" value={appLanguage} onClick={() => setActiveView('language')} />
              </div>

              {/* More Group */}
              <div className="px-5 py-3 mt-4"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">More</span></div>
              <div className="border-y border-white/5 bg-[#080808]">
                <MenuItem icon="ℹ️" label="About Apex Forge" onClick={() => setActiveView('about')} />
                <MenuItem icon="❓" label="Help & FAQs" onClick={() => setActiveView('faqs')} />
                <MenuItem icon="🎧" label="Contact Support" onClick={() => setActiveView('support')} />
                <MenuItem icon="⚖️" label="Legal" onClick={() => setActiveView('legal')} />
              </div>
              
              {/* Disconnect Button & Footer */}
              <div className="px-4 mt-8">
                <button onClick={() => alert("Wallet completely disconnected.")} className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-black text-sm uppercase py-4 rounded-2xl tracking-widest transition-colors border border-rose-500/20">
                  Disconnect Wallet
                </button>
              </div>

              <div className="mt-10 mb-8 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center space-x-6">
                  {/* Social Icons */}
                  <a href="#" className="text-zinc-500 hover:text-[#089981] transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                  <a href="#" className="text-zinc-500 hover:text-[#089981] transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
                  <a href="#" className="text-zinc-500 hover:text-[#089981] transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></a>
                </div>
                <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Apex Forge v2.4</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: NOTIFICATIONS */}
          {/* ==================================================== */}
          {activeView === 'notifications' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-5 py-3"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">New Token Alerts</span></div>
              <div className="bg-[#080808] p-5 border-y border-white/5">
                <p className="text-[15px] font-bold text-white mb-4">Launch Frequency</p>
                <div className="flex bg-black rounded-lg p-1.5 border border-white/10">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'light', label: 'Light' },
                    { id: 'heavy', label: 'Heavy' }
                  ].map(tier => (
                    <button
                      key={tier.id}
                      onClick={() => setLaunchFrequency(tier.id)}
                      className={`flex-1 py-2 rounded text-[13px] font-bold transition-all ${
                        launchFrequency === tier.id ? 'bg-[#089981] text-white shadow-sm' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs font-medium text-zinc-500 mt-4 leading-relaxed">
                  {launchFrequency === 'none' && 'You will not receive any push notifications for new tokens.'}
                  {launchFrequency === 'light' && 'You will only be alerted for tokens you deploy and top graduations.'}
                  {launchFrequency === 'heavy' && 'You will receive a push notification for every single deployment on the platform.'}
                </p>
              </div>

              <div className="px-5 py-3 mt-6"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Account Alerts</span></div>
              <div className="border-y border-white/5 bg-[#080808]">
                <ToggleItem label="Mentions & Tags" description="When someone tags your username in chat." enabled={mentionsAlert} locked={true} />
                <ToggleItem label="Security" description="Failed transactions and critical security alerts." enabled={securityAlert} locked={true} />
                <ToggleItem label="Price Alerts" description="When tokens on your watchlist pump." enabled={priceAlerts} onToggle={() => setPriceAlerts(!priceAlerts)} />
                <ToggleItem label="Yield & Staking" description="When staking rewards are ready to claim." enabled={stakingYieldAlerts} onToggle={() => setStakingYieldAlerts(!stakingYieldAlerts)} />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: TRADING (EXECUTION) */}
          {/* ==================================================== */}
          {activeView === 'execution' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="px-5 py-4">
                <div className="flex bg-[#080808] rounded-xl p-1.5 border border-white/5">
                  <button onClick={() => setRoutingMode('smart')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${routingMode === 'smart' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>Auto Mode</button>
                  <button onClick={() => setRoutingMode('expert')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${routingMode === 'expert' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}>Custom Mode</button>
                </div>
              </div>

              {routingMode === 'smart' ? (
                <div className="px-5 py-2">
                   <div className="bg-[#080808] border border-white/5 rounded-2xl p-6">
                     <p className="text-[15px] font-bold text-[#089981] mb-2 flex items-center gap-2"><span>⚡</span> Auto Routing Active</p>
                     <p className="text-sm font-medium text-zinc-400 leading-relaxed text-justify">Apex Forge will automatically handle slippage, gas priorities, and MEV protection to ensure your trades execute instantly without failed block errors.</p>
                   </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="px-5 py-3"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Slippage Tolerance</span></div>
                  <div className="bg-[#080808] p-5 border-y border-white/5 space-y-6">
                    
                    <div className="flex bg-black rounded-lg border border-white/10 p-1.5 w-full max-w-[240px]">
                      <button onClick={() => setPriceToleranceMode('auto')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${priceToleranceMode === 'auto' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>Auto</button>
                      <button onClick={() => setPriceToleranceMode('manual')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${priceToleranceMode === 'manual' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>Fixed</button>
                    </div>
                    
                    {priceToleranceMode === 'manual' && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-center gap-3">
                          <input type="number" value={priceTolerance} onChange={(e) => setPriceTolerance(Number(e.target.value))} className="w-32 bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-black text-lg outline-none focus:border-[#089981] transition-colors" />
                          <span className="text-zinc-500 font-bold text-lg">%</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 3, 5, 10].map(val => (
                            <button key={val} onClick={() => setPriceTolerance(val)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${priceTolerance === val ? 'bg-[#089981] border-[#089981] text-white' : 'bg-transparent border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}>{val}%</button>
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
          {/* VIEW: EDIT PROFILE */}
          {/* ==================================================== */}
          {activeView === 'editProfile' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="p-8 flex flex-col items-center justify-center border-b border-white/5 bg-[#080808]">
                <div className="w-28 h-28 bg-black border border-white/10 rounded-full flex items-center justify-center overflow-hidden relative cursor-pointer mb-3 shadow-lg group">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {editAvatar ? <img src={editAvatar} alt="Preview" className="w-full h-full object-cover z-10" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="Preview" className="w-full h-full object-cover z-10" />}
                  <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white z-10 pointer-events-none transition-all">Change</div>
                </div>
                <span className="text-[13px] font-bold text-[#089981] tracking-wide">Update Avatar</span>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Username</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-[#080808] border border-white/10 rounded-xl px-4 py-4 text-white text-[15px] font-bold outline-none focus:border-[#089981] transition-colors mt-2 shadow-inner" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Bio / Description</label>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={250} className="w-full h-28 bg-[#080808] border border-white/10 rounded-xl px-4 py-4 text-white text-[15px] font-medium outline-none focus:border-[#089981] transition-colors mt-2 resize-none shadow-inner leading-relaxed" placeholder="Write something about yourself..." />
                  <div className="text-right text-xs font-bold text-zinc-600 mt-2">{editBio.length} / 250</div>
                </div>
              </div>

              <div className="px-5 mt-4 space-y-3">
                <button onClick={handleSaveProfile} className="w-full bg-white text-black font-black text-[13px] uppercase tracking-widest py-4 rounded-xl transition-opacity hover:opacity-90 active:scale-95">Save Profile</button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: WORLD CLASS SUPPORT CHAT */}
          {/* ==================================================== */}
          {activeView === 'support' && (
            <div className="w-full flex flex-col h-[calc(100vh-80px)] animate-fadeIn duration-200">
              
              <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
                {/* Secure Notice */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
                    <span className="text-[#089981] text-sm">🔒</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">End-to-End Encrypted</span>
                  </div>
                </div>

                {/* Chat Bubbles */}
                {supportMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isAgent ? 'items-start' : 'items-end'}`}>
                    <span className="text-[10px] font-bold text-zinc-600 mb-1.5 ml-1">{msg.sender}</span>
                    <div className={`p-4 max-w-[85%] text-[14px] font-medium leading-relaxed shadow-md ${
                      msg.isAgent 
                        ? 'bg-[#121212] border border-white/5 text-white rounded-2xl rounded-tl-sm' 
                        : 'bg-[#089981] text-black rounded-2xl rounded-tr-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-medium text-zinc-600 mt-1.5">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#050505] border-t border-white/5">
                 {/* Quick Chips */}
                 <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
                   <button onClick={() => handleSendSupport("My trade is pending")} className="bg-[#121212] border border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors">⏳ My trade is pending</button>
                   <button onClick={() => handleSendSupport("Error deploying coin")} className="bg-[#121212] border border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors">🚀 Error deploying token</button>
                   <button onClick={() => handleSendSupport("Talk to a human")} className="bg-[#121212] border border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors">👨‍💻 Talk to a human</button>
                 </div>

                {/* Text Bar */}
                <form onSubmit={(e) => { e.preventDefault(); handleSendSupport(supportInput); }} className="flex gap-2 items-end">
                  <textarea 
                    value={supportInput} 
                    onChange={(e) => setSupportInput(e.target.value)} 
                    placeholder="Type a message..." 
                    className="flex-1 bg-[#121212] border border-white/10 rounded-2xl px-4 py-3.5 text-[15px] text-white outline-none focus:border-[#089981] resize-none h-[52px] max-h-[120px] shadow-inner transition-colors" 
                  />
                  <button type="submit" className="bg-[#089981] text-black h-[52px] px-6 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-[#06806b] active:scale-95 shadow-sm">
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: ABOUT */}
          {/* ==================================================== */}
          {activeView === 'about' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="flex flex-col items-center justify-center p-10 text-center border-b border-white/5">
                <div className="w-20 h-20 bg-[#089981] rounded-2xl mb-6 shadow-[0_0_30px_rgba(8,153,129,0.3)] flex items-center justify-center">
                   <span className="text-4xl text-black font-black">A</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Apex Forge</h2>
                <p className="text-sm font-mono text-zinc-500 mt-2">Version 2.4.0 (Build 891)</p>
              </div>
              <div className="p-6 text-[15px] font-medium text-zinc-400 leading-relaxed text-justify space-y-4">
                <p>Apex Forge is the premier decentralized terminal for creating, deploying, and sniping Web3 digital assets. Built directly on top of Solana, the platform ensures completely fair launches via an automated mathematical bonding curve.</p>
                <p>Our mission is to eliminate rug-pulls and developer monopolies by providing a secure, non-custodial gateway for both creators and traders to operate seamlessly on-chain.</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: LEGAL, FAQS, LANGUAGE, APPEARANCE */}
          {/* ==================================================== */}
          {activeView === 'language' && (
            <div className="w-full animate-fadeIn duration-200 border-y border-white/5 bg-[#080808]">
              {V1_POPULAR_LOCALES.map((loc) => (
                <button key={loc.code} onClick={() => { setAppLanguage(loc.native); setActiveView('main'); }} className="w-full flex items-center justify-between px-5 py-4 border-b border-white/5 last:border-none hover:bg-[#121212] transition-colors">
                  <div className="flex items-center gap-5">
                    <span className="text-2xl">{loc.flag}</span>
                    <div className="text-left">
                      <p className="text-[15px] font-bold text-white">{loc.native}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-0.5">{loc.english}</p>
                    </div>
                  </div>
                  {appLanguage === loc.native && <span className="text-[#089981] font-black text-lg">✓</span>}
                </button>
              ))}
            </div>
          )}

          {activeView === 'appearance' && (
            <div className="w-full animate-fadeIn duration-200 px-5 py-4 space-y-3">
              {['Dark', 'Light', 'System Default'].map((mode) => (
                <button key={mode} onClick={() => setAppearanceMode(mode)} className={`w-full flex items-center justify-between p-5 rounded-xl border transition-colors ${appearanceMode === mode ? 'bg-[#089981]/10 border-[#089981]' : 'bg-[#080808] border-white/10 hover:bg-[#121212]'}`}>
                  <span className={`text-[15px] font-bold ${appearanceMode === mode ? 'text-white' : 'text-zinc-400'}`}>{mode}</span>
                  {appearanceMode === mode && <span className="text-[#089981] font-black text-lg">✓</span>}
                </button>
              ))}
            </div>
          )}

          {activeView === 'legal' && (
            <div className="w-full animate-fadeIn duration-200 border-y border-white/5 bg-[#080808]">
              {[
                { id: 'legal_terms', title: 'Terms of Service' },
                { id: 'legal_privacy', title: 'Privacy Policy' },
                { id: 'legal_livestream', title: 'Community Guidelines' },
                { id: 'legal_fees', title: 'Fees & Pricing Structure' }
              ].map(item => (
                <button key={item.id} onClick={() => setActiveView(item.id)} className="w-full flex items-center justify-between p-5 hover:bg-[#121212] border-b border-white/5 last:border-none transition-colors">
                  <span className="text-[15px] font-bold text-white">{item.title}</span>
                  <span className="text-zinc-600 text-lg leading-none">›</span>
                </button>
              ))}
            </div>
          )}

          {['legal_terms', 'legal_privacy', 'legal_livestream', 'legal_fees'].includes(activeView) && (
            <div className="w-full animate-fadeIn duration-200 p-6">
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider">
                {activeView === 'legal_terms' ? 'Terms of Service' :
                 activeView === 'legal_privacy' ? 'Privacy Policy' :
                 activeView === 'legal_livestream' ? 'Community Guidelines' : 'Fees & Pricing'}
              </h2>
              <div className="text-[14px] text-zinc-400 font-medium leading-loose space-y-5 text-justify bg-[#080808] p-6 rounded-2xl border border-white/5 shadow-inner">
                {activeView === 'legal_terms' && (
                  <>
                    <p>Welcome to Apex Forge. By interacting with our non-custodial deployment parameters, you confirm that you understand the speculative risks inherent to on-chain decentralized markets.</p>
                    <p>Apex Forge acts strictly as an open-source interface. We do not assume authority, custody, or control over token architectures, liquidity pools, or user funds.</p>
                    <p>Cryptographic assets are subject to extreme market volatility. The protocol does not guarantee any financial return. Users are strictly prohibited from utilizing the infrastructure to facilitate illegal transactions.</p>
                  </>
                )}
                {activeView === 'legal_privacy' && (
                  <>
                    <p>Data collection parameters within Apex Forge are zero-footprint structures. Your RPC endpoints and wallet arrays are gathered dynamically for your local viewing only.</p>
                    <p>We do not utilize tracking cookies, and absolutely no client profiling or physical operational metrics are logged to remote centralized storage modules.</p>
                    <p>Your private keys and seed phrases are generated locally and never leave your secure device environment. Exercise extreme caution and never share personally identifiable information in public channels.</p>
                  </>
                )}
                {activeView === 'legal_livestream' && (
                  <>
                    <p>Broadcast arrays tied to token deployment profiles must maintain community standards. Explicit, toxic, or malicious deployment broadcasts will result in community moderation filter blacklists.</p>
                    <p>Users must maintain system-wide integrity across all asset display layers. Any streams attempting to bypass these parameters via alternative routing networks will be severed.</p>
                  </>
                )}
                {activeView === 'legal_fees' && (
                  <>
                    <p>Our deployment parameters match the global V1 specification metrics:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li><strong className="text-white">Initial Deploy Protocol Fee:</strong> Fixed at 0.05 SOL. This guarantees execution space on the blockchain and initializes the metadata parameters.</li>
                      <li><strong className="text-white">Inbound/Outbound Liquidity Swaps:</strong> Variable platform fee matching exactly 0.5% of the total transaction payload value to sustain the portal infrastructure.</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {activeView === 'faqs' && (
            <div className="w-full animate-fadeIn duration-200 border-y border-white/5 bg-[#080808]">
              {[
                { q: "What is Apex Forge?", a: "Apex Forge is a decentralized, non-custodial launchpad and high-frequency trading terminal built natively on the Solana blockchain. It empowers creators to deploy tokens instantly." },
                { q: "How much does it cost to launch a coin?", a: "The network fee for deploying a new smart contract via our portal is a fixed 0.05 SOL. There are absolutely no hidden developer fees or stealth taxes." },
                { q: "How does the bonding curve work?", a: "Our internal bonding curve mathematically dictates the token's active price. As more SOL is injected into the pool, the price per token increases automatically according to the algorithmic curve." },
                { q: "What happens when a token graduates?", a: "When the bonding curve hits its limit, trading is temporarily paused. All accumulated SOL liquidity and remaining tokens are pushed to a decentralized exchange to create an immutable liquidity pool." },
                { q: "Are my funds safe?", a: "Yes. The system is entirely non-custodial—meaning nobody, not even the Apex Forge team, has access to your assets or trading capital." }
              ].map((item, idx) => (
                <details key={idx} className="group border-b border-white/5 last:border-none [&_summary::-webkit-details-marker]:hidden">
                  <summary className="w-full flex justify-between items-center p-5 cursor-pointer list-none">
                    <span className="text-[15px] font-bold text-white pr-4">{item.q}</span>
                    <span className="text-zinc-500 font-bold group-open:rotate-45 group-open:text-[#089981] transition-transform text-xl">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-[14px] font-medium text-zinc-400 leading-relaxed text-justify">
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