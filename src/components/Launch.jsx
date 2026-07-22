import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import MediaUploader from './MediaUploader'; // 🚀 IMPORTING OUR NEW COMPONENT

export default function Launch({ onForgeSuccess }) {
  const { connected, publicKey } = useWallet();

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  
  // 🚀 MEDIA STATES WIRED TO UPLOADER
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  
  const [showSocials, setShowSocials] = useState(false);
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const [initialBuy, setInitialBuy] = useState('');
  
  // 🚀 APP STORE COMPLIANCE & SECURITY STATE
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [deployedHistory, setDeployedHistory] = useState([]); // 🚀 Duplicate Blocker Memory

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [mockTokenAddress, setMockTokenAddress] = useState('');

  const deploymentStages = [
    { text: "> initializing anchor workspace...", duration: 800 },
    { text: "> verifying unique asset hash...", duration: 1000 },
    { text: "> compiling smart contract...", duration: 1200 },
    { text: "> uploading metadata to IPFS...", duration: 1500 },
    { text: "> generating mint authority...", duration: 1000 },
    { text: "> establishing bonding curve...", duration: 1200 },
    { text: "> awaiting wallet signature...", duration: 2000 }, 
    { text: "> broadcasting transaction...", duration: 800 },
    { text: "> confirming block finality...", duration: 1000 }
  ];

  useEffect(() => {
    if (isDeploying && deploymentStep < deploymentStages.length) {
      const timer = setTimeout(() => {
        setDeploymentStep(prev => prev + 1);
      }, deploymentStages[deploymentStep].duration);
      return () => clearTimeout(timer);
    } else if (isDeploying && deploymentStep === deploymentStages.length) {
      setTimeout(() => {
        setDeploySuccess(true);
        const finalAddress = generateMockAddress();
        
        // 🚀 Add to local history to prevent duplicates
        setDeployedHistory(prev => [...prev, tokenName.toLowerCase()]);
        
        if (onForgeSuccess) {
          const newToken = {
            id: Date.now().toString(),
            name: tokenName,
            symbol: tokenSymbol,
            description: description, 
            links: {                  
              twitter: twitter,
              telegram: telegram,
              website: website
            },
            mintAddress: finalAddress,
            imagePreview: thumbnailUrl || imagePreview, // Pass the static thumbnail for lists/charts
            videoUrl: mediaType === 'video' ? imagePreview : null, // Pass actual video to watch feed
            mediaType: mediaType, 
            icon: '🔥', 
            mcap: '$10.0K', 
            price: '0.0001',
            change: '+0.0%',
            initialSnipe: parseFloat(initialBuy || '0'),
            isGraduated: false, 
            progress: initialBuy ? ((parseFloat(initialBuy) / 85) * 100) : 0
          };
          onForgeSuccess(newToken);
        }

      }, 600);
    }
  }, [isDeploying, deploymentStep]);

  // 🚀 RECEIVE MEDIA FROM OUR NEW UPLOADER
  const handleMediaSelected = (mediaData) => {
    setImagePreview(mediaData.previewUrl);
    setThumbnailUrl(mediaData.thumbnailUrl);
    setMediaType(mediaData.type);
  };

  // 🚀 APP STORE COMPLIANCE: The Smart Sanitizer
  const handleDescriptionChange = (e) => {
    let val = e.target.value;
    
    // Prohibited words that get apps banned from Apple/Google
    const bannedWords = [/100x/gi, /guaranteed profit/gi, /rug pull/gi, /moon safe/gi, /financial advice/gi, /risk free/gi];
    let isFlagged = false;

    bannedWords.forEach(regex => {
      if (regex.test(val)) {
        val = val.replace(regex, "***");
        isFlagged = true;
      }
    });

    setDescription(val);

    if (isFlagged) {
      alert("⚠️ App Store Safety Protocol: Certain financial hype words have been sanitized to protect the Apex Forge ecosystem and maintain platform compliance.");
    }
  };

  const handleInitialBuyChange = (e) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    if ((val.match(/\./g) || []).length > 1) val = val.substring(0, val.lastIndexOf('.'));
    const parts = val.split('.');
    if (parts[0]) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setInitialBuy(parts.join('.'));
  };

  const generateMockAddress = () => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let addr = '';
    for (let i = 0; i < 44; i++) {
      addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setMockTokenAddress(addr);
    return addr;
  };

  const startMockDeployment = () => {
    if (!tokenName || !tokenSymbol) {
      alert("⚠️ Token Name and Symbol are required to forge an asset.");
      return;
    }
    if (!imagePreview) {
      alert("⚠️ Please upload an asset logo or video to proceed.");
      return;
    }
    if (!acceptedDisclaimer) {
      alert("⚠️ You must acknowledge the entertainment and risk disclaimer before launching an asset.");
      return;
    }
    
    // 🚀 THE DUPLICATE / RUG BLOCKER
    if (deployedHistory.includes(tokenName.toLowerCase())) {
      alert(`⚠️ Rug Blocker Active: You have already deployed an asset named "${tokenName}". Please choose a unique name to prevent community confusion.`);
      return;
    }
    
    setIsDeploying(true);
    setDeploymentStep(0);
    setDeploySuccess(false);
  };

  const resetForge = () => {
    setTokenName('');
    setTokenSymbol('');
    setDescription('');
    setImagePreview(null);
    setThumbnailUrl(null);
    setTwitter('');
    setTelegram('');
    setWebsite('');
    setInitialBuy('');
    setShowSocials(false);
    setAcceptedDisclaimer(false);
    
    setIsDeploying(false);
    setDeploySuccess(false);
    setDeploymentStep(0);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white font-sans overflow-hidden relative select-none">
      
      {/* --- HEADER --- */}
      <header className="flex-none z-40 bg-[#050505]/95 backdrop-blur-md px-4 py-4 border-b border-white/[0.04] flex items-center justify-center shadow-md relative">
        <h1 className="text-xl font-black tracking-wide text-white uppercase flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#089981]" fill="currentColor">
            <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
            <path d="M 50 45 C 35 70, 35 85, 50 85 C 65 85, 65 70, 50 45 Z" fill="#089981" />
          </svg>
          The Forge
        </h1>
      </header>

      {/* --- DEPLOYMENT FORM --- */}
      <div className={`flex-1 overflow-y-auto no-scrollbar pb-32 transition-opacity duration-300 ${isDeploying ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-full max-w-2xl mx-auto px-4 pt-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-white tracking-tight">Deploy Asset</h2>
            <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">Create and launch a fair-launch token instantly. Liquidity is securely locked.</p>
          </div>

          {/* 🚀 UPGRADED: REPLACED WITH OUR NEW MEDIA UPLOADER */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Media (Video/GIF/Image) <span className="text-rose-500">*</span></label>
            <MediaUploader onMediaSelected={handleMediaSelected} />
          </div>

          {/* TOKEN DETAILS */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Token Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. Apex Forge" value={tokenName} onChange={(e) => setTokenName(e.target.value)} className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981]/50 transition-all font-black text-lg shadow-inner"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Ticker Symbol <span className="text-rose-500">*</span></label>
              <div className="relative flex flex-col gap-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-lg">$</span>
                <input type="text" placeholder="APEX" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())} className="w-full bg-[#121212] border border-white/5 rounded-xl pl-9 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981]/50 transition-all font-black text-lg uppercase shadow-inner" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Description</label>
              </div>
              <textarea 
                placeholder="Describe your project's utility and vision... (Note: Excessive financial hype will be sanitized)" 
                value={description} 
                onChange={handleDescriptionChange} 
                rows={4} 
                className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981]/50 transition-all font-medium text-sm resize-none shadow-inner" 
              />
            </div>
          </div>

          {/* SOCIALS */}
          <div className="flex flex-col bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-inner">
            <button onClick={() => setShowSocials(!showSocials)} className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Add Social Links (Optional)
              </span>
              <svg className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${showSocials ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showSocials && (
              <div className="p-4 pt-0 flex flex-col gap-3 border-t border-white/5 animate-fadeIn">
                <div className="flex items-center bg-[#050505] border border-white/5 rounded-lg overflow-hidden focus-within:border-[#089981]/50 transition-colors shadow-inner">
                  <span className="pl-3 pr-2 text-zinc-500 font-black">𝕏</span>
                  <input type="text" placeholder="(Optional) Twitter Link" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full bg-transparent py-2.5 pr-3 text-sm text-white placeholder-zinc-600 outline-none" />
                </div>
                <div className="flex items-center bg-[#050505] border border-white/5 rounded-lg overflow-hidden focus-within:border-[#089981]/50 transition-colors shadow-inner">
                  <span className="pl-3 pr-2 text-zinc-500 font-black">TG</span>
                  <input type="text" placeholder="(Optional) Telegram Link" value={telegram} onChange={(e) => setTelegram(e.target.value)} className="w-full bg-transparent py-2.5 pr-3 text-sm text-white placeholder-zinc-600 outline-none" />
                </div>
                <div className="flex items-center bg-[#050505] border border-white/5 rounded-lg overflow-hidden focus-within:border-[#089981]/50 transition-colors shadow-inner">
                  <span className="pl-3 pr-2 text-zinc-500 font-black">🌐</span>
                  <input type="text" placeholder="(Optional) Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-transparent py-2.5 pr-3 text-sm text-white placeholder-zinc-600 outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* ANTI-BOT PROTECTION CARD */}
          <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#089981]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(8,153,129,0.05)] relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#089981]/10 rounded-full blur-3xl group-hover:bg-[#089981]/20 transition-colors"></div>
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-5 relative z-10">
              <h3 className="text-[11px] font-black text-[#089981] uppercase tracking-widest flex items-center gap-2">⚡ Initial Snipe</h3>
              <span className="text-[9px] font-mono text-zinc-500 bg-black/50 px-2 py-1 rounded">ANTI-BOT PROTECTION</span>
            </div>
            
            <p className="text-xs text-zinc-400 font-medium mb-5 leading-relaxed relative z-10">
              Secure the lowest entry price at block 0. Choose how much SOL to inject instantly upon contract deployment to prevent sniper bots from front-running you.
            </p>
            
            <div className="flex items-center bg-[#050505] border border-white/10 rounded-2xl px-5 py-2 focus-within:border-[#089981]/80 transition-colors shadow-inner relative z-10">
               <input type="text" inputMode="decimal" placeholder="0.00" value={initialBuy} onChange={handleInitialBuyChange} className="w-full bg-transparent text-4xl font-black text-white outline-none py-3 placeholder-zinc-700" />
               <div className="flex flex-col items-end shrink-0">
                 <span className="text-lg font-black text-[#089981]">SOL</span>
               </div>
            </div>
            
            <div className="flex gap-2 mt-4 w-full relative z-10">
               {['0.5', '1.0', '2.5', '5.0'].map(amt => (
                 <button key={amt} onClick={() => setInitialBuy(amt)} className="flex-1 py-3 bg-white/5 hover:bg-[#089981]/20 rounded-xl text-xs font-black text-zinc-300 hover:text-[#089981] transition-colors border border-white/5 active:scale-95 shadow-sm">{amt}</button>
               ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 relative z-10">
              <div className="flex justify-between text-[9px] font-black uppercase text-zinc-600 mb-2">
                <span>Curve Progress</span>
                <span>{initialBuy ? ((parseFloat(initialBuy)/85)*100).toFixed(1) : '0.0'}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
                <div className="h-full bg-[#089981] transition-all duration-300" style={{width: `${initialBuy ? ((parseFloat(initialBuy)/85)*100) : 0}%`}}></div>
              </div>
            </div>
          </div>

          {/* 🚀 MANDATORY APP STORE DISCLAIMER */}
          <div className="flex items-start gap-3 bg-[#121212] border border-white/10 p-4 rounded-xl mt-2 mb-4">
            <input 
              type="checkbox" 
              checked={acceptedDisclaimer} 
              onChange={(e) => setAcceptedDisclaimer(e.target.checked)} 
              className="mt-1 min-w-[20px] min-h-[20px] accent-[#089981] cursor-pointer"
            />
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
              <strong className="text-white">Mandatory Disclosure:</strong> I acknowledge that assets deployed on Apex Forge are community digital art concepts intended strictly for entertainment and social engagement. They hold no intrinsic financial value and do not constitute investment products.
            </p>
          </div>

        </div>
      </div>

      {/* 🚀 LIVE SUPPORT WIDGET */}
      {!isDeploying && (
        <div 
          onClick={() => alert("Connecting to live Forge Support Agent...")}
          className="absolute right-4 bottom-28 z-40 w-12 h-12 bg-[#089981] rounded-full shadow-[0_0_20px_rgba(8,153,129,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-pulse"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </div>
      )}

      {/* --- COMPILATION TERMINAL (ACTIVE DURING DEPLOYMENT) --- */}
      {isDeploying && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0A0A0A] border border-[#089981]/40 rounded-xl overflow-hidden shadow-[0_0_80px_rgba(8,153,129,0.15)] flex flex-col relative">
            
            {!deploySuccess && (
              <button onClick={resetForge} className="absolute top-3 right-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors z-20 cursor-pointer">
                Abort
              </button>
            )}

            <div className="bg-[#121212] px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#089981]/80"></div>
              <span className="ml-2 text-[10px] font-mono font-bold text-zinc-500">root@apex-forge: ~/deploy/${tokenSymbol || 'unknown'}</span>
            </div>

            <div className="p-6 font-mono text-xs sm:text-sm h-64 overflow-y-auto flex flex-col gap-2 relative">
              {!deploySuccess ? (
                <>
                  {deploymentStages.slice(0, deploymentStep).map((stage, idx) => (
                    <div key={idx} className="text-zinc-500 flex items-center gap-2 animate-fadeIn">
                      <span className="text-[#089981]">✓</span> {stage.text.replace('> ', '')}
                    </div>
                  ))}
                  
                  {deploymentStep < deploymentStages.length && (
                    <div className="text-[#089981] flex items-center gap-2">
                      <span className="animate-spin text-white">⟳</span> {deploymentStages[deploymentStep].text.replace('> ', '')}
                      <span className="animate-pulse block w-2 h-4 bg-[#089981] ml-1"></span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn gap-4">
                  <div className="w-16 h-16 bg-[#089981]/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(8,153,129,0.5)]">
                    <svg className="w-8 h-8 text-[#089981]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest">Contract Live</h3>
                  <div className="bg-black border border-white/10 px-4 py-2 rounded-lg">
                    <span className="text-[#089981] font-bold select-all">{mockTokenAddress}</span>
                  </div>
                  <button onClick={resetForge} className="mt-4 px-6 py-3 bg-[#089981] text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-[#06806b] transition-colors">
                    Deploy Another
                  </button>
                </div>
              )}
            </div>

            {!deploySuccess && (
              <div className="h-1 w-full bg-[#121212]">
                <div className="h-full bg-[#089981] transition-all duration-300" style={{ width: `${(deploymentStep / deploymentStages.length) * 100}%` }}></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🚀 COMPACT STICKY FOOTER */}
      {!isDeploying && (
        <div className="absolute bottom-0 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl py-3 px-4 border-t border-white/[0.04] shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            
            <div className="flex flex-col shrink-0">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Network Cost</span>
              <span className="text-sm font-black text-white">0.05 SOL</span>
            </div>

            <button 
              onClick={startMockDeployment} 
              className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(8,153,129,0.3)] ${
                acceptedDisclaimer 
                  ? 'bg-[#089981] hover:bg-[#06806b] text-white active:scale-95 cursor-pointer' 
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
              }`}
            >
              Initialize Contract 🚀
            </button>
          </div>
        </div>
      )}

    </div>
  );
}