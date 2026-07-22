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
  view, // 🚀 Catching the prop Wallet.jsx is sending
  onBack, 
  onCloseSettings, 
  onClose, // 🚀 Catching the close command Wallet.jsx is sending
  userProfile, 
  setUserProfile 
}) {
  
  // 🚀 FIXED: Synchronizing the props perfectly between the files
  const startingView = view || initialView || 'wallet_drawer';
  const closeScreen = onClose || onCloseSettings;

  // Normalizes 'settings' (from the hamburger menu) into 'main'
  const normalizedInitView = startingView === 'settings' ? 'main' : startingView;
  const [activeView, setActiveView] = useState(normalizedInitView);

  useEffect(() => {
    setActiveView(startingView === 'settings' ? 'main' : startingView);
  }, [startingView]);

  // App Configurations
  const [appLanguage, setAppLanguage] = useState('English');
  const [appearanceMode, setAppearanceMode] = useState('Dark');
  
  const [editUsername, setEditUsername] = useState(userProfile?.username || '@elviscrypto');
  const [editBio, setEditBio] = useState(userProfile?.bio || 'HODL');
  const [editAvatar, setEditAvatar] = useState(userProfile?.avatar || null);

  // Fake Wallet Balances
  const primaryWalletBalance = "$16,530.00";
  const otherAccounts = [
    { username: 'turbosharkpious', address: 'FihWW...fgskM', balance: '$0.07', avatar: '🦈' }
  ];

  // System States
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [cloudBackupActive, setCloudBackupActive] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [mentionAlerts, setMentionAlerts] = useState(false);
  const [backupPassword, setBackupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Trade Settings
  const [routingMode, setRoutingMode] = useState('smart');
  const [priceToleranceMode, setPriceToleranceMode] = useState('auto');
  const [priceTolerance, setPriceTolerance] = useState(15);
  const [fuelMode, setFuelMode] = useState('auto');
  const [fuelTier, setFuelTier] = useState('med');
  const [manualFuelValue, setFuelValue] = useState('0.001');
  const [validatorTipValue, setValidatorTipValue] = useState('0.001');
  const [blockBundleProtection, setBlockBundleProtection] = useState(true);

  // Community Settings
  const [twitterLink, setTwitterLink] = useState('https://x.com/apexforge_portal');
  const [telegramLink, setTelegramLink] = useState('https://t.me/apexforge_portal');
  const [websiteLink, setWebsiteLink] = useState('https://apexforge.labs');
  const [allowTrollboxGifs, setAllowTrollboxGifs] = useState(true);
  const [requireHolderVerification, setRequireHolderVerification] = useState(false);
  const [minTokensToChat, setMinTokensToChat] = useState(1000);

  // Support Chat
  const [supportInput, setSupportInput] = useState('');
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'ForgeAI Concierge', text: 'Welcome to Apex Forge Core Support. How can we assist you today?', isAgent: true, time: 'Just now' }
  ]);

  const handleSaveProfile = () => {
    if (setUserProfile) setUserProfile({ username: editUsername, bio: editBio, avatar: editAvatar });
    alert("Profile metadata updated successfully!"); 
    // Close cleanly back out
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
      let automatedReply = "Query received. Our team will verify your address shortly.";
      setSupportMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ForgeAI Concierge', text: automatedReply, isAgent: true, time: 'Just now' }]);
    }, 1000);
  };

  // 🚀 FIXED: Rock-solid navigation mapping matrix with working close events
  const handleBackNavigation = () => {
    // If we are currently on the exact view the modal opened with, close it entirely (X)
    if (activeView === normalizedInitView) {
      if (closeScreen) closeScreen();
      else if (onBack) onBack();
      return;
    }

    // Explicit routing back to the root if deep
    if (activeView === 'editProfile' || activeView === 'main') {
      setActiveView(normalizedInitView);
      return;
    }

    // Deep room routing map (Sends you back to the correct parent)
    const menuMap = { 
      'export_warning': 'security', 
      'export_reveal': 'export_warning', 
      'backup_password': 'security', 
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

  // --- REUSABLE COMPONENTS ---
  function MenuItem({ icon, label, value, onClick, highlight }) {
    return (
      <button onClick={onClick} className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors active:bg-white/10 group border-b border-white/[0.02] last:border-none ${highlight ? 'bg-[#089981]/5' : ''}`}>
        <div className="flex items-center space-x-3">
          <span className="text-xl w-6 text-center opacity-80">{icon}</span>
          <span className={`font-bold text-sm tracking-wide transition-colors ${highlight ? 'text-[#089981]' : 'text-white group-hover:text-[#089981]'}`}>{label}</span>
        </div>
        <div className="flex items-center space-x-2">
          {value && <span className="text-xs text-zinc-500 font-mono font-bold">{value}</span>}
          <span className="text-zinc-600 group-hover:text-[#089981] transition-colors">›</span>
        </div>
      </button>
    );
  }

  function ToggleItem({ label, description, enabled, onToggle }) {
    return (
      <div className="flex items-center justify-between py-4 border-b border-white/[0.02] last:border-none">
        <div className="flex-1 pr-4 text-left">
          <p className="text-sm font-bold text-white">{label}</p>
          {description && <p className="text-[11px] font-medium text-zinc-500 mt-1 leading-relaxed">{description}</p>}
        </div>
        <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${enabled ? 'bg-[#089981]' : 'bg-white/10'}`}>
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
    );
  }

  function LegalItem({ label, onClick }) {
    return (
      <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/[0.02] last:border-none transition-colors group">
        <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{label}</span>
        <span className="text-zinc-600 group-hover:text-[#089981] font-mono text-sm">↗</span>
      </button>
    );
  }

  function LegalTextBody({ title, content }) {
    return (
      <div className="w-full animate-fadeIn space-y-4 text-left">
        <h3 className="text-sm font-black text-[#089981] font-mono uppercase tracking-widest">Protocol manifest // {title}</h3>
        <div className="bg-[#121212] border border-white/5 rounded-xl p-5 h-[60vh] overflow-y-auto text-[13px] text-zinc-400 leading-relaxed space-y-5 font-medium shadow-inner no-scrollbar">
          {content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <button onClick={() => setActiveView('legal')} className="w-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm">Back to Legal Menu</button>
      </div>
    );
  }

  function FaqItem({ question, answer }) {
    return (
      <details className="group border-b border-white/[0.02] last:border-none [&_summary::-webkit-details-marker]:hidden">
        <summary className="w-full flex justify-between items-center py-4 text-left cursor-pointer list-none">
          <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors pr-4">{question}</span>
          <span className="text-zinc-600 font-mono text-sm group-open:rotate-45 transition-transform duration-200 group-hover:text-[#089981]">+</span>
        </summary>
        <div className="pb-4 text-[13px] font-medium text-zinc-500 leading-relaxed text-left">
          {answer}
        </div>
      </details>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white font-sans overflow-hidden animate-fadeIn relative">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* --- HEADER --- */}
      <header className="flex-none z-50 bg-[#050505]/95 backdrop-blur-xl pt-4 pb-3 px-4 border-b border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBackNavigation} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors active:scale-95 shrink-0">
            {/* 🚀 FIXED: Dynamic icon rendering based on navigation depth */}
            {activeView === normalizedInitView ? (
              // X icon for 'Close Modal'
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              // Back Arrow for 'Return to Previous Menu'
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            )}
          </button>
          <h1 className="text-lg font-black tracking-widest text-white uppercase">
            {activeView === 'wallet_drawer' ? 'Your Accounts' :
             activeView === 'main' ? 'App Settings' :
             activeView === 'editProfile' ? 'Edit Profile' :
             activeView === 'security' ? 'Security & Backup' :
             activeView === 'notifications' ? 'Notifications' :
             activeView === 'execution' ? 'Trade Settings' :
             activeView === 'language' ? 'Language' :
             activeView === 'support' ? 'Support Hub' :
             activeView === 'legal' ? 'Legal Info' :
             activeView === 'faqs' ? 'FAQs' :
             activeView === 'community' ? 'Community Settings' :
             activeView === 'appearance' ? 'Appearance' : 'Document View'}
          </h1>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative pb-32">
        <div className="flex flex-col px-4 pt-6 gap-6 max-w-2xl mx-auto">
        
          {/* ==================================================== */}
          {/* VIEW 0: THE IDENTITY MATRIX (WALLET DRAWER) */}
          {/* ==================================================== */}
          {activeView === 'wallet_drawer' && (
            <div className="w-full animate-fadeIn duration-200">
              <div onClick={() => { if(closeScreen) closeScreen(); }} className="bg-gradient-to-r from-[#121212] to-[#0A0A0A] border border-[#089981]/50 rounded-3xl p-5 shadow-[0_0_30px_rgba(8,153,129,0.15)] relative overflow-hidden flex flex-col mb-8 cursor-pointer hover:border-[#089981] transition-all group">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#089981]/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex justify-between items-start z-10 w-full mb-6">
                  <div className="w-14 h-14 bg-black border-2 border-[#089981] rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                     {editAvatar ? <img src={editAvatar} alt="You" className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="You" className="w-full h-full object-cover" />}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setActiveView('editProfile'); }} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-colors text-white">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                  </button>
                </div>
                <div className="flex justify-between items-end z-10 w-full">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-white leading-tight">{editUsername.replace('@', '')}</span>
                    <span className="text-xs font-mono font-bold text-zinc-500 mt-0.5">FzVQv...9xCuH</span>
                  </div>
                  <span className="text-2xl font-black text-white font-mono tracking-tight">{primaryWalletBalance}</span>
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="h-px bg-white/10 w-full"></div>
                <span className="px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Other Accounts</span>
                <div className="h-px bg-white/10 w-full"></div>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {otherAccounts.map((acc, idx) => (
                  <div key={idx} className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#1A1A24] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black border border-white/10 rounded-full flex items-center justify-center text-xl overflow-hidden">{acc.avatar}</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{acc.username}</span>
                        <span className="text-[10px] font-mono font-bold text-zinc-500">{acc.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-white font-mono">{acc.balance}</span>
                      <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#121212] border border-white/10 hover:border-[#089981]/50 text-white font-black text-sm uppercase py-4 rounded-xl tracking-widest shadow-sm transition-all flex items-center justify-center gap-2">
                  <span>+</span> Create Burner Wallet
                </button>
              </div>

              {/* ROUTE TO MAIN SETTINGS */}
              <button onClick={() => setActiveView('main')} className="w-full flex justify-between items-center py-5 mt-6 border-t border-white/10 group">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">App Preferences & Security</span>
                <span className="text-zinc-600 group-hover:text-white">›</span>
              </button>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 1: MAIN DASHBOARD (FULL PLATFORM MANAGEMENT) */}
          {/* ==================================================== */}
          {activeView === 'main' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="bg-[#121212] rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                <MenuItem icon="✏️" label="Edit Profile" highlight={true} onClick={() => setActiveView('editProfile')} />
                <div className="w-full h-px bg-white/5" />
                <MenuItem icon="🛡️" label="Security & Backup" onClick={() => setActiveView('security')} />
                <MenuItem icon="⚡" label="Trade Settings" onClick={() => setActiveView('execution')} />
                <MenuItem icon="🌐" label="Community & Feeds" onClick={() => setActiveView('community')} />
                <MenuItem icon="🔔" label="Notifications" onClick={() => setActiveView('notifications')} />
                <div className="w-full h-px bg-white/5" />
                <MenuItem icon="🎨" label="Appearance" value={appearanceMode} onClick={() => setActiveView('appearance')} />
                <MenuItem icon="文" label="Language" value={appLanguage} onClick={() => setActiveView('language')} />
                <div className="w-full h-px bg-white/5" />
                <MenuItem icon="📚" label="FAQs" onClick={() => setActiveView('faqs')} />
                <MenuItem icon="⚖️" label="Legal & Policies" onClick={() => setActiveView('legal')} />
                
                <button onClick={() => setActiveView('support')} className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/5 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#089981] text-xl w-6 text-center">🎧</span>
                    <span className="text-[#089981] font-black text-sm tracking-wide uppercase">Live chat support</span>
                  </div>
                  <span className="text-zinc-600 group-hover:text-[#089981]">›</span>
                </button>
              </div>

              {/* FOOTER */}
              <div className="mt-8 flex flex-col items-center space-y-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Official Channels</p>
                <div className="flex space-x-4">
                  {['𝕏', '✈️', '👾'].map((ch, idx) => (
                    <button key={idx} className="w-12 h-12 rounded-full border border-white/10 bg-[#121212] flex items-center justify-center text-xl text-zinc-400 hover:text-white hover:border-[#089981] transition-colors shadow-inner">{ch}</button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 font-mono tracking-widest font-bold mt-2">APEX FORGE v1.0.4</p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW: EDIT PROFILE */}
          {/* ==================================================== */}
          {activeView === 'editProfile' && (
            <div className="w-full animate-fadeIn duration-200 space-y-6 text-left">
              <div className="flex flex-col items-center justify-center p-6 bg-[#121212] border border-white/5 rounded-2xl shadow-inner mb-2">
                <div className="w-24 h-24 bg-[#050505] border border-white/10 rounded-full flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-inner mb-4">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {editAvatar ? <img src={editAvatar} alt="Preview" className="w-full h-full object-cover z-10" /> : <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername}`} alt="Preview" className="w-full h-full object-cover z-10" />}
                  <div className="absolute inset-0 bg-black/80 hidden group-hover:flex items-center justify-center text-xs font-black text-white uppercase tracking-widest transition-all z-10 pointer-events-none">Change</div>
                </div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tap to update avatar</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest pl-1">Handle / Username</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white font-black outline-none focus:border-[#089981]/50 transition-colors shadow-inner mt-1.5" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest pl-1">Bio Manifest</label>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={250} className="w-full h-24 bg-[#121212] border border-white/5 rounded-xl p-4 text-sm font-medium mt-1.5 text-white outline-none focus:border-[#089981]/50 transition-colors resize-none shadow-inner" placeholder="Tell the community about yourself..." />
                  
                  {/* APP STORE SAFETY COMPLIANCE DISCLAIMER */}
                  <div className="flex justify-between items-start mt-2 px-1">
                    <p className="text-[9px] font-medium text-zinc-500 max-w-[80%] leading-relaxed">
                      By saving, you agree to our <button onClick={() => setActiveView('legal_terms')} className="text-[#089981] hover:underline">Terms of Service</button>. Harmful, explicit, or abusive content is strictly prohibited and will result in immediate account termination.
                    </p>
                    <div className="text-right text-[10px] text-zinc-500 font-bold shrink-0">{editBio.length} / 250</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button onClick={handleSaveProfile} className="w-full bg-[#089981] hover:bg-[#06806b] text-white font-black text-sm uppercase py-4 rounded-xl tracking-widest shadow-sm active:scale-95 transition-all">Save Profile</button>
                <button onClick={() => alert("Are you sure? This will disconnect the wallet.")} className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 font-black text-xs uppercase py-4 rounded-xl tracking-widest transition-all">Remove Account</button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* THE REST OF THE PLATFORM SETTINGS */}
          {/* ==================================================== */}
          
          {/* SECURITY */}
          {activeView === 'security' && (
            <div className="w-full animate-fadeIn duration-200 flex flex-col justify-between h-full">
              <div className="bg-[#121212] border border-white/5 rounded-2xl p-2 shadow-inner">
                <button onClick={() => setActiveView('export_warning')} className="w-full flex justify-between items-center py-4 px-3 border-b border-white/[0.02] group transition-colors hover:bg-white/5 rounded-t-xl">
                  <div className="text-left">
                    <p className="text-sm font-bold text-white group-hover:text-[#089981] transition-colors">Export wallet</p>
                    <p className="text-[11px] font-medium text-zinc-500 mt-1">Export your wallet private key.</p>
                  </div>
                  <span className="text-zinc-600 text-lg group-hover:text-[#089981]">›</span>
                </button>
                <div className="px-3"><ToggleItem label="Biometric auth" description="Require Face ID/Touch ID." enabled={biometricAuth} onToggle={() => setBiometricAuth(!biometricAuth)} /></div>
                <div className="w-full flex justify-between items-center py-4 px-3 border-b border-white/[0.02] text-left">
                  <div>
                    <p className="text-sm font-bold text-white">Check for backup</p>
                    <p className="text-[11px] font-medium text-zinc-500 mt-1">Check if you have a cloud wallet backup.</p>
                  </div>
                  <button onClick={() => alert("No index matches found.")} className="text-[10px] font-black text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:text-white uppercase tracking-widest">Scan</button>
                </div>
                <div className="px-3"><ToggleItem label="Cloud backup" description="Back up your wallet to Google Drive." enabled={cloudBackupActive} onToggle={() => { if(!cloudBackupActive) setActiveView('backup_password'); else setCloudBackupActive(false); }} /></div>
              </div>
            </div>
          )}

          {activeView === 'export_warning' && (
            <div className="w-full animate-fadeIn duration-200 text-center py-4">
              <div className="space-y-6">
                <div className="text-amber-500 text-5xl">⚠️</div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Before You Export</h2>
                <p className="text-[13px] font-medium text-zinc-400 max-w-sm mx-auto leading-relaxed">Your private keys give full access to your wallet. Please read these important security tips.</p>
                <div className="text-left bg-[#121212] border border-white/5 rounded-xl p-5 space-y-5 shadow-inner">
                  <div className="flex space-x-3">
                    <span className="text-xl">🔒</span>
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Keep it secure</h4>
                      <p className="text-[11px] font-medium text-zinc-500 mt-1">Never share your private key or seed phrase with anyone. It can lead to a loss of funds.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <button onClick={() => setActiveView('export_reveal')} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest transition-colors shadow-sm">Continue</button>
                <button onClick={() => setActiveView('security')} className="w-full py-4 text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {activeView === 'export_reveal' && (
            <div className="w-full animate-fadeIn duration-200 text-center py-4 space-y-6">
              <div className="text-[#F23645] text-5xl">🚨</div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Back Up Your Wallet</h2>
              <p className="text-[11px] font-bold text-[#F23645] bg-[#F23645]/10 border border-[#F23645]/20 p-3 rounded-xl uppercase tracking-wider">Please make sure to back up your private key securely.</p>
              <div className="space-y-4 text-left">
                <div className="bg-[#121212] border border-white/5 rounded-xl p-4 space-y-2 shadow-inner">
                  <p className="text-[10px] uppercase text-zinc-500 font-black tracking-widest">Private Key</p>
                  <p className="text-xs font-mono break-all text-[#089981] bg-[#089981]/10 p-3 rounded-lg border border-[#089981]/20 select-all font-bold">4f7a93b...d2e1f4c8b9a0e1f2c3d4e5f6a7b8c9d0</p>
                </div>
                <div className="bg-[#121212] border border-white/5 rounded-xl p-4 space-y-2 shadow-inner">
                  <p className="text-[10px] uppercase text-zinc-500 font-black tracking-widest">Seed Phrase</p>
                  <p className="text-xs font-mono break-normal text-[#089981] bg-[#089981]/10 p-3 rounded-lg border border-[#089981]/20 select-all font-bold leading-relaxed">alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima</p>
                </div>
              </div>
              <button onClick={() => setActiveView('security')} className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 transition-colors shadow-sm mt-4">Back to Security</button>
            </div>
          )}

          {/* TRADE SETTINGS */}
          {activeView === 'execution' && (
            <div className="w-full animate-fadeIn duration-200 space-y-6 text-left">
              <div className="flex p-1 bg-[#121212] border border-white/5 rounded-xl font-mono shadow-inner">
                <button onClick={() => setRoutingMode('smart')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${routingMode === 'smart' ? 'bg-[#089981] text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}>Auto</button>
                <button onClick={() => setRoutingMode('expert')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${routingMode === 'expert' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}>Custom</button>
              </div>

              {routingMode === 'smart' ? (
                <div className="bg-[#121212] border border-white/5 rounded-xl p-5 space-y-2 shadow-inner">
                   <p className="text-sm font-black text-[#089981] flex items-center gap-2"><span>✦</span> Auto Routing</p>
                   <p className="text-xs font-medium text-zinc-400 leading-relaxed">The default for a reason. We handle setting fees, slippage, and MEV protection in real time so you get fast, protected transactions.</p>
                </div>
              ) : (
                <div className="space-y-6 pb-8">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                     <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
                     <div>
                       <p className="text-[11px] font-black uppercase tracking-widest text-amber-500">Custom Mode Warning</p>
                       <p className="text-[11px] font-medium text-amber-500/80 mt-1 leading-relaxed">Using custom settings may lead to an increase in failed transactions. Proceed with caution.</p>
                     </div>
                  </div>
                  
                  {/* Slippage */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-white">Slippage Tolerance</p>
                        <p className="text-[10px] font-medium text-zinc-500 mt-0.5">Expected vs actual price variance</p>
                      </div>
                      <div className="flex bg-[#121212] rounded-lg overflow-hidden border border-white/5 p-0.5 shadow-inner">
                        <button onClick={() => setPriceToleranceMode('auto')} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded transition-colors ${priceToleranceMode === 'auto' ? 'bg-[#089981] text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Auto</button>
                        <button onClick={() => setPriceToleranceMode('manual')} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded transition-colors ${priceToleranceMode === 'manual' ? 'bg-white/10 text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Manual</button>
                      </div>
                    </div>
                    {priceToleranceMode === 'manual' && (
                      <div className="space-y-3 animate-fadeIn bg-[#121212] p-4 rounded-xl border border-white/5 shadow-inner">
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-3 flex justify-between items-center shadow-inner">
                          <input type="number" value={priceTolerance} onChange={(e) => setPriceTolerance(Number(e.target.value))} className="bg-transparent text-white font-black font-mono outline-none text-left w-full" />
                          <span className="text-zinc-500 font-bold">%</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 3, 5, 10].map(val => (
                            <button key={val} onClick={() => setPriceTolerance(val)} className={`flex-1 py-2 rounded-lg text-[11px] font-black transition-colors ${priceTolerance === val ? 'bg-[#089981] text-white' : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white'}`}>{val}%</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMMUNITY & NOTIFICATIONS & LANGUAGE */}
          {activeView === 'notifications' && (
            <div className="w-full animate-fadeIn duration-200 bg-[#121212] border border-white/5 rounded-2xl p-4 shadow-inner">
              <ToggleItem label="Global Push Notifications" enabled={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />
              <ToggleItem label="Trade Alerts" description="Notify me on large on-chain price actions." enabled={tradeAlerts} onToggle={() => setTradeAlerts(!tradeAlerts)} />
              <ToggleItem label="Chat Mentions" description="Ping me when your wallet address is tagged." enabled={mentionAlerts} onToggle={() => setMentionAlerts(!mentionAlerts)} />
            </div>
          )}

          {activeView === 'language' && (
            <div className="w-full animate-fadeIn duration-200 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-inner">
              {V1_POPULAR_LOCALES.map((loc) => (
                <button key={loc.code} onClick={() => { setAppLanguage(loc.native); setActiveView('main'); }} className="w-full flex items-center justify-between p-4 border-b border-white/[0.02] hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{loc.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{loc.native}</p>
                      <p className="text-[10px] font-bold text-zinc-500 mt-0.5">{loc.english}</p>
                    </div>
                  </div>
                  {appLanguage === loc.native && <span className="w-5 h-5 rounded-full bg-[#089981] flex items-center justify-center text-black text-xs font-black shadow-sm">✓</span>}
                </button>
              ))}
            </div>
          )}

          {activeView === 'appearance' && (
            <div className="w-full animate-fadeIn duration-200 space-y-3">
              {['Dark', 'Light', 'Cyberpunk'].map((mode) => (
                <button key={mode} onClick={() => setAppearanceMode(mode)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 shadow-sm ${appearanceMode === mode ? 'bg-[#089981]/10 border-[#089981]/50 shadow-inner' : 'bg-[#121212] border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">{mode === 'Dark' ? '🌙' : mode === 'Light' ? '☀️' : '🤖'}</span>
                    <span className={`text-sm font-black ${appearanceMode === mode ? 'text-white' : 'text-zinc-500'}`}>{mode} Mode</span>
                  </div>
                  {appearanceMode === mode && <span className="w-5 h-5 rounded-full bg-[#089981] flex items-center justify-center text-black text-xs font-black shadow-sm">✓</span>}
                </button>
              ))}
            </div>
          )}

          {activeView === 'community' && (
            <div className="w-full animate-fadeIn duration-200 space-y-6 text-left">
              <div className="bg-[#121212] border border-white/5 rounded-xl p-4 flex items-start gap-3 shadow-inner">
                <span className="text-[#089981] mt-0.5">🌐</span>
                <div>
                  <p className="text-[11px] font-black text-[#089981] uppercase tracking-widest">Token Social Hub</p>
                  <p className="text-[11px] font-medium text-zinc-400 mt-1 leading-relaxed">Configure your coin's institutional channels. These anchors are pushed directly to the front terminal page arrays.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest pl-1">Official X (Twitter)</label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-4 top-3.5 text-zinc-500 text-sm font-black">𝕏</span>
                    <input type="text" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} className="w-full bg-[#121212] border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white font-mono font-bold outline-none focus:border-[#089981]/50 transition-colors shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest pl-1">Telegram Channel</label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-4 top-3.5 text-zinc-500 text-sm">✈</span>
                    <input type="text" value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)} className="w-full bg-[#121212] border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white font-mono font-bold outline-none focus:border-[#089981]/50 transition-colors shadow-inner" />
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 mt-2 shadow-inner">
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-3 px-1">Feed Customization</p>
                <ToggleItem label="Allow GIFs in Trollbox" enabled={allowTrollboxGifs} onToggle={() => setAllowTrollboxGifs(!allowTrollboxGifs)} />
                <ToggleItem label="Holder Chat Gate" description="Require wallets to hold tokens to chat." enabled={requireHolderVerification} onToggle={() => setRequireHolderVerification(!requireHolderVerification)} />
                {requireHolderVerification && (
                  <div className="pt-3 pb-2 px-1 space-y-2 animate-fadeIn">
                    <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Minimum Supply Units</label>
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-3 flex justify-between items-center shadow-inner">
                      <input type="number" value={minTokensToChat} onChange={(e) => setMinTokensToChat(Number(e.target.value))} className="bg-transparent text-white font-mono font-black outline-none text-left w-full" />
                      <span className="text-[#089981] font-mono text-[10px] font-black uppercase">Tokens</span>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => { alert("Configuration broadcasted."); setActiveView('main'); }} className="w-full bg-[#089981] hover:bg-[#06806b] text-white font-black text-sm uppercase py-4 rounded-xl tracking-widest shadow-sm active:scale-95 transition-all mt-6">Commit Changes</button>
            </div>
          )}

          {/* SUPPORT */}
          {activeView === 'support' && (
            <div className="w-full h-[75vh] animate-fadeIn duration-200 flex flex-col justify-between">
              <div className="bg-[#121212] border border-white/5 p-4 rounded-xl flex items-start gap-3 mb-4 shadow-inner text-left">
                 <span className="text-zinc-500 text-sm mt-0.5">🛡️</span>
                 <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">This environment is protected by <span className="text-[#089981] font-black">ApexAI</span>. Never paste your private recovery seed values here.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 text-left no-scrollbar">
                {supportMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isAgent ? 'items-start' : 'items-end'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${msg.isAgent ? 'text-[#089981]' : 'text-zinc-500'} mb-1.5`}>{msg.sender}</p>
                    <div className={`p-3.5 rounded-xl max-w-[85%] text-xs font-medium leading-relaxed shadow-sm ${msg.isAgent ? 'bg-[#121212] border border-white/5 text-zinc-300 rounded-tl-sm' : 'bg-[#089981]/10 border border-[#089981]/20 text-white rounded-tr-sm'}`}>{msg.text}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-3">
                 <div className="flex flex-wrap gap-2">
                   <button onClick={() => handleSendSupport("Transaction Pending / Stalled")} className="bg-[#121212] border border-white/5 text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm">⏳ Trade Pending</button>
                   <button onClick={() => handleSendSupport("Deployment Disruption Exception")} className="bg-[#121212] border border-white/5 text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm">🚀 Deploy Error</button>
                   <button onClick={() => handleSendSupport("Connect Live Core Engineer")} className="bg-[#089981]/10 border border-[#089981]/30 text-[#089981] hover:bg-[#089981]/20 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm">👨‍💻 Escalate</button>
                 </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSendSupport(supportInput); }} className="pt-3 border-t border-white/5 flex gap-2 items-center">
                <input type="text" value={supportInput} onChange={(e) => setSupportInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-[#121212] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-medium text-white outline-none focus:border-[#089981]/50 transition-colors shadow-inner" />
                <button type="submit" className="bg-[#089981] text-black hover:bg-[#06806b] px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm">Send</button>
              </form>
            </div>
          )}

          {/* LEGAL & FAQS */}
          {activeView === 'legal' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                <LegalItem label="Terms and conditions" onClick={() => setActiveView('legal_terms')} />
                <LegalItem label="Privacy policy" onClick={() => setActiveView('legal_privacy')} />
                <LegalItem label="Livestream policy" onClick={() => setActiveView('legal_livestream')} />
                <LegalItem label="Fee schedule" onClick={() => setActiveView('legal_fees')} />
              </div>
            </div>
          )}
          {activeView === 'legal_terms' && <LegalTextBody title="Terms and Conditions" content="Welcome to Apex Forge Terminal. By interacting with our non-custodial deployment parameters, you explicitly confirm that you understand the speculative risks inherent to on-chain decentralized market setups.\n\nApex Forge acts strictly as an open-source, decentralized portal interface layer. We do not assume authority, custody, or control over token architectures, liquidity pools, or user funds deployed using this system.\n\nCryptographic assets are subject to extreme market volatility. The protocol does not guarantee any financial return, stability, or liquidity. By connecting your wallet, you agree that you are accessing the blockchain at your own absolute risk and hold Apex Forge blameless for any network-level exploits, slippage losses, or smart contract anomalies.\n\nUsers are strictly prohibited from utilizing the Apex Forge infrastructure to facilitate illegal transactions, launder funds, or bypass international financial sanctions. Any detection of such activities will result in immediate frontend blacklisting and termination of interface access." />}
          {activeView === 'legal_privacy' && <LegalTextBody title="Privacy Policy" content="Data collection parameters within Apex Forge are zero-footprint structures. Your RPC endpoints, wallet signatures, and balance arrays are gathered dynamically from the Solana public mainnet telemetry for your local viewing only.\n\nWe do not utilize tracking cookies, and absolutely no client profiling or physical operational metrics are logged to remote centralized storage modules. Your private keys and seed phrases are generated locally and never leave your secure device environment.\n\nAny information shared in the public Trollbox or community channels is permanently recorded on decentralized ledgers or public databases. Exercise extreme caution and never share personally identifiable information (PII). Apex Forge engineers, admins, and support staff will never request your private keys or seed phrases under any circumstances." />}
          {activeView === 'legal_livestream' && <LegalTextBody title="Livestream Policy" content="Broadcast arrays tied to token deployment profiles must maintain community standards. Explicit, toxic, or malicious deployment broadcasts will result in community moderation filter blacklists.\n\nMaintain system-wide integrity across all asset display layers. Any streams attempting to bypass these parameters via alternative routing networks will be severed." />}
          {activeView === 'legal_fees' && <LegalTextBody title="Fee Schedule" content="Deployment parameters match the global V1 specification metrics:\n\n1. Initial Deploy Protocol Fee: Fixed at 0.05 SOL. This guarantees execution space on the blockchain and initializes the metadata parameters.\n\n2. Inbound/Outbound Liquidity Swaps Platform Fee: Variable balance matching exactly 0.5% of total transaction payload value to sustain the portal infrastructure." />}
          
          {activeView === 'faqs' && (
            <div className="w-full animate-fadeIn duration-200">
              <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden px-4 shadow-inner">
                <FaqItem question="What is Apex Forge?" answer="Apex Forge is a decentralized, non-custodial launchpad and high-frequency trading terminal built natively on the Solana blockchain. It empowers creators to deploy tokens instantly without providing initial capital liquidity, utilizing an automated bonding curve model to ensure fair launches and prevent sniper bot monopolies." />
                <FaqItem question="How much does it cost to launch a coin?" answer="The network fee for deploying a new smart contract via our portal is a fixed 0.05 SOL. This covers the cost of initializing the metadata, establishing the bonding curve parameters, and opening the trading gateway. There are absolutely no hidden developer fees, stealth taxes, or ongoing subscription costs." />
                <FaqItem question="How does the bonding curve work?" answer="Our internal bonding curve mathematically dictates the token's active price. As more SOL is injected into the pool to buy tokens, the price per token increases automatically according to the algorithmic curve. This guarantees that there is always liquidity available for buyers and sellers. Once the curve reaches its target reserve threshold, the curve completely closes and the token graduates to a decentralized exchange." />
                <FaqItem question="What happens when a token graduates?" answer="When the bonding curve hits approximately 85 SOL (roughly equivalent to a $69,000 market capitalization), trading is temporarily paused on the Apex Forge terminal. All accumulated SOL liquidity and remaining tokens are permanently locked and pushed to Raydium to create an immutable liquidity pool. The LP tokens are instantly burned, cryptographically guaranteeing that the liquidity can never be rug-pulled by the developer." />
                <FaqItem question="Are the contracts audited and safe?" answer="Yes. Our V1 core engine utilizes completely immutable, un-upgradable Anchor smart contracts. Mint authorities are revoked instantly upon deployment, meaning creators cannot mint new tokens to inflate the supply. Furthermore, the system is entirely non-custodial—meaning nobody, not even the Apex Forge team, has access to your assets or trading capital." />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}