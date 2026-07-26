import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import MediaUploader from './MediaUploader'; 
import { supabase } from './supabaseClient';
import { useApexForgeProgram } from './SolanaProvider'; // 🚀 Anchor Program Hook

export default function Launch({ onForgeSuccess }) {
  const { connected, publicKey } = useWallet();
  const program = useApexForgeProgram(); // 🚀 Access Anchor Program

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [mediaType, setMediaType] = useState('image'); 
  const [uploaderKey, setUploaderKey] = useState(0); 
  
  const [showSocials, setShowSocials] = useState(false);
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const [initialBuy, setInitialBuy] = useState('');
  
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [deployedHistory, setDeployedHistory] = useState([]); 

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initializing wallet & contract...');

  const connectedAddress = publicKey ? publicKey.toBase58() : '';

  // 🚀 REAL ON-CHAIN DEPLOYMENT HANDLER
  const handleRealDeployment = async () => {
    if (!tokenName || !tokenSymbol) {
      alert("⚠️ Token Name and Symbol are required to forge an asset.");
      return;
    }
    if (!imagePreview) {
      alert("⚠️ Please upload an asset logo or video to proceed.");
      return;
    }
    if (!acceptedDisclaimer) {
      alert("⚠️ You must acknowledge the disclaimer before launching an asset.");
      return;
    }
    if (!connected || !publicKey) {
      alert("⚠️ Wallet not connected! Please connect Phantom first.");
      return;
    }
    if (!program) {
      alert("⚠️ Anchor Program initialized failed. Check your VITE_PROGRAM_ID or connection.");
      return;
    }
    
    if (deployedHistory.includes(tokenName.toLowerCase())) {
      alert(`⚠️ You have already deployed an asset named "${tokenName}". Please choose a unique name.`);
      return;
    }

    try {
      setIsDeploying(true);
      setDeploySuccess(false);
      setStatusMessage("> Awaiting Phantom signature for contract creation...");

      // ------------------------------------------------------------------
      // 🚀 ON-CHAIN Smart Contract Execution (Triggers Phantom Popup)
      // Note: Update '.createToken(...)' & '.accounts({...})' to match 
      // your exact Anchor program instruction names if different.
      // ------------------------------------------------------------------
      const metadataUrl = thumbnailUrl || imagePreview;

      const txSignature = await program.methods
        .createToken(tokenName, tokenSymbol.toUpperCase(), metadataUrl)
        .accounts({
          // Add specific accounts required by your Anchor instruction context
        })
        .rpc(); // <-- THIS `.rpc()` call triggers the Phantom popup!

      setStatusMessage("> Transaction confirmed on-chain! Syncing database...");
      console.log("On-Chain Mint Signature:", txSignature);

      setDeployedTokenAddress(txSignature);
      setDeployedHistory(prev => [...prev, tokenName.toLowerCase()]);

      const newToken = {
        id: Date.now().toString(),
        name: tokenName,
        symbol: tokenSymbol.toUpperCase(),
        description: description, 
        links: {                
          twitter: twitter,
          telegram: telegram,
          website: website
        },
        mintAddress: txSignature,
        creatorAddress: connectedAddress,
        imagePreview: metadataUrl, 
        videoUrl: mediaType === 'video' ? 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31910-large.mp4' : null, 
        mediaType: mediaType, 
        icon: '🔥', 
        mcap: '$10.0K', 
        price: '0.0001',
        change: '+0.0%',
        initialSnipe: parseFloat(initialBuy || '0'),
        isGraduated: false, 
        progress: initialBuy ? ((parseFloat(initialBuy) / 85) * 100) : 0
      };

      // 🚀 SAVE TO SUPABASE AFTER REAL ON-CHAIN CONFIRMATION
      if (supabase) {
        try {
          const { error } = await supabase.from('tokens').insert([
            {
              name: newToken.name,
              symbol: newToken.symbol,
              description: newToken.description,
              icon: newToken.icon,
              image_url: newToken.imagePreview,
              mint_address: newToken.mintAddress,
              creator_address: newToken.creatorAddress,
              market_cap: newToken.mcap,
              progress: newToken.progress,
              links: newToken.links,
              created_at: new Date().toISOString()
            }
          ]);

          if (error) {
            console.error("Supabase Insert Error:", error);
          } else {
            console.log("Token synced to Supabase database!");
          }
        } catch (err) {
          console.error("Database save failed:", err);
        }
      }

      setDeploySuccess(true);
      if (onForgeSuccess) {
        onForgeSuccess(newToken);
      }

    } catch (err) {
      console.error("Deployment failed or cancelled by user:", err);
      alert(`⚠️ Transaction Cancelled or Failed: ${err.message || err}`);
      setIsDeploying(false);
    }
  };

  const handleMediaSelected = (mediaData) => {
    setImagePreview(mediaData.previewUrl);
    setThumbnailUrl(mediaData.thumbnailUrl);
    setMediaType(mediaData.type);
  };

  const handleDescriptionChange = (e) => {
    let val = e.target.value;
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
      alert("⚠️ Safety Protocol: Financial hype words sanitized.");
    }
  };

  const handleInitialBuyChange = (e) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    if ((val.match(/\./g) || []).length > 1) val = val.substring(0, val.lastIndexOf('.'));
    const parts = val.split('.');
    if (parts[0]) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setInitialBuy(parts.join('.'));
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
    setUploaderKey(prev => prev + 1); 
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#050505] text-white font-sans overflow-hidden relative select-none">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- PINNED HEADER --- */}
      <header className="flex-none z-40 bg-[#050505]/95 backdrop-blur-md px-4 py-4 border-b border-white/[0.04] flex items-center justify-center shadow-md">
        <h1 className="text-xl font-black tracking-wide text-white uppercase flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#089981]" fill="currentColor">
            <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
            <path d="M 50 45 C 35 70, 35 85, 50 85 C 65 85, 65 70, 50 45 Z" fill="#089981" />
          </svg>
          The Forge
        </h1>
      </header>

      {/* --- SCROLLABLE FORM --- */}
      <div className={`flex-1 overflow-y-auto no-scrollbar px-4 pt-6 pb-72 transition-opacity duration-300 ${isDeploying ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
          
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-white tracking-tight">Deploy Asset</h2>
            <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">Create and launch a fair-launch token on Solana Devnet.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Media <span className="text-rose-500">*</span></label>
            <MediaUploader key={uploaderKey} onMediaSelected={handleMediaSelected} />
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
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                placeholder="Describe your project's utility and vision..." 
                value={description} 
                onChange={handleDescriptionChange} 
                rows={4} 
                className="w-full bg-[#121212] border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981]/50 transition-all font-medium text-sm resize-none shadow-inner" 
              />
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="flex flex-col bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-inner">
            <button onClick={() => setShowSocials(!showSocials)} className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer">
              <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">🌐 Add Social Links (Optional)</span>
              <svg className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${showSocials ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showSocials && (
              <div className="p-4 pt-0 flex flex-col gap-3 border-t border-white/5">
                <input type="text" placeholder="(Optional) Twitter Link" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="bg-[#050505] p-3 rounded-lg text-sm text-white outline-none border border-white/5" />
                <input type="text" placeholder="(Optional) Telegram Link" value={telegram} onChange={(e) => setTelegram(e.target.value)} className="bg-[#050505] p-3 rounded-lg text-sm text-white outline-none border border-white/5" />
                <input type="text" placeholder="(Optional) Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} className="bg-[#050505] p-3 rounded-lg text-sm text-white outline-none border border-white/5" />
              </div>
            )}
          </div>

          {/* INITIAL SNIPE */}
          <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#089981]/30 rounded-3xl p-6 relative overflow-hidden">
            <h3 className="text-[11px] font-black text-[#089981] uppercase tracking-widest mb-2">⚡ Initial Snipe (Optional)</h3>
            <div className="flex items-center bg-[#050505] border border-white/10 rounded-2xl px-5 py-2">
               <input type="text" inputMode="decimal" placeholder="0.00" value={initialBuy} onChange={handleInitialBuyChange} className="w-full bg-transparent text-4xl font-black text-white outline-none py-3 font-mono" />
               <span className="text-lg font-black text-[#089981]">SOL</span>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="flex items-start gap-3 bg-[#121212] border border-white/10 p-4 rounded-xl">
            <input 
              type="checkbox" 
              checked={acceptedDisclaimer} 
              onChange={(e) => setAcceptedDisclaimer(e.target.checked)} 
              className="mt-1 min-w-[20px] min-h-[20px] accent-[#089981] cursor-pointer"
            />
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
              <strong className="text-white">Mandatory Disclosure:</strong> I acknowledge that assets deployed on Apex Forge are digital assets created on Solana.
            </p>
          </div>

        </div>
      </div>

      {/* --- PINNED BOTTOM ACTION BAR --- */}
      {!isDeploying && (
        <div className="absolute bottom-[90px] md:bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl py-3 px-4 border-t border-white/[0.04]">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col shrink-0">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Network Cost</span>
              <span className="text-sm font-black text-white font-mono">~0.002 SOL</span>
            </div>

            <button 
              onClick={handleRealDeployment} 
              className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(8,153,129,0.3)] ${
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

      {/* --- REAL DEPLOYMENT TERMINAL --- */}
      {isDeploying && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0A0A0A] border border-[#089981]/40 rounded-xl overflow-hidden shadow-[0_0_80px_rgba(8,153,129,0.15)] flex flex-col relative">
            
            {!deploySuccess && (
              <button onClick={resetForge} className="absolute top-3 right-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors z-20 cursor-pointer">
                Cancel
              </button>
            )}

            <div className="bg-[#121212] px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#089981]/80"></div>
              <span className="ml-2 text-[10px] font-mono font-bold text-zinc-500">root@apex-forge: ~/deploy/${tokenSymbol || 'unknown'}</span>
            </div>

            <div className="p-6 font-mono text-xs sm:text-sm h-64 flex flex-col items-center justify-center gap-4 text-center">
              {!deploySuccess ? (
                <>
                  <div className="w-12 h-12 border-4 border-[#089981]/20 border-t-[#089981] rounded-full animate-spin"></div>
                  <p className="text-[#089981] font-bold text-sm animate-pulse">{statusMessage}</p>
                  <p className="text-[10px] text-zinc-500">Please review and confirm the signature popup in Phantom.</p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn gap-4">
                  <div className="w-16 h-16 bg-[#089981]/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(8,153,129,0.5)]">
                    <svg className="w-8 h-8 text-[#089981]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest">Contract Live On-Chain</h3>
                  <div className="bg-black border border-white/10 px-4 py-2 rounded-lg max-w-xs overflow-hidden">
                    <span className="text-[#089981] font-bold text-xs select-all break-all">{deployedTokenAddress}</span>
                  </div>
                  <button onClick={resetForge} className="mt-4 px-6 py-3 bg-[#089981] text-black font-black uppercase tracking-widest text-xs rounded-lg hover:bg-[#06806b] transition-colors cursor-pointer">
                    Deploy Another
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}