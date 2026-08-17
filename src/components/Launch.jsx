import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import MediaUploader from './MediaUploader'; 
import { supabase } from '../supabaseClient';
import { useLaunchToken } from '../hooks/useLaunchToken';

export default function Launch({ onForgeSuccess }) {
  const { connected, publicKey } = useWallet();
  const { executeLaunchOnChain, isLaunching } = useLaunchToken();

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [mediaType, setMediaType] = useState('image'); 
  const [uploaderKey, setUploaderKey] = useState(0); 
  
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const [initialBuy, setInitialBuy] = useState('');
  
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initializing transaction...');

  const handleRealDeployment = async () => {
    if (!tokenName.trim() || !tokenSymbol.trim()) {
      alert("⚠️ Token Name and Ticker Symbol are required.");
      return;
    }
    if (!imagePreview) {
      alert("⚠️ Please upload asset media.");
      return;
    }
    if (!acceptedDisclaimer) {
      alert("⚠️ Please acknowledge the risk disclosure checkbox before launching.");
      return;
    }
    if (!connected || !publicKey) {
      alert("🔒 Wallet Not Connected! Please connect Phantom.");
      return;
    }

    try {
      setIsDeploying(true);
      setDeploySuccess(false);
      setStatusMessage("> Requesting wallet signature to deploy on-chain...");

      const safeName = tokenName.trim().slice(0, 32);
      const safeSymbol = tokenSymbol.trim().toUpperCase().slice(0, 10);
      const realMetadataUri = thumbnailUrl || imagePreview;

      const mintAddress = await executeLaunchOnChain(safeName, safeSymbol, realMetadataUri);

      if (!mintAddress) {
        setIsDeploying(false);
        return;
      }

      setStatusMessage("> Transaction broadcasted! Syncing database...");
      setDeployedTokenAddress(mintAddress);

      const parsedBuy = parseFloat(initialBuy.replace(/,/g, '')) || 0;
      const socialLinks = {
        twitter: twitter.trim() || null,
        telegram: telegram.trim() || null,
        website: website.trim() || null
      };

      const newToken = {
        id: mintAddress,
        name: safeName,
        symbol: safeSymbol,
        description: description.trim(), 
        links: socialLinks,
        mintAddress: mintAddress,
        creatorAddress: publicKey.toBase58(),
        imageUrl: realMetadataUri, 
        mediaType: mediaType, 
        initialSnipeSol: parsedBuy,
        isGraduated: false, 
        progress: parsedBuy ? Math.min((parsedBuy / 85) * 100, 100) : 0,
        createdAt: new Date().toISOString()
      };

      if (supabase) {
        const { error: dbError } = await supabase.from('tokens').insert([{
          mint_address: newToken.mintAddress,
          name: newToken.name,
          symbol: newToken.symbol,
          description: newToken.description,
          image_url: newToken.imageUrl,
          creator_address: newToken.creatorAddress,
          progress: newToken.progress,
          initial_snipe_sol: newToken.initialSnipeSol,
          links: newToken.links,
          media_type: newToken.mediaType,
          is_graduated: false,
          created_at: newToken.createdAt
        }]);

        if (dbError) {
          console.error("Supabase Sync Error:", dbError.message);
          throw new Error(`Database save failed: ${dbError.message}`);
        }
      }

      setDeploySuccess(true);
      if (onForgeSuccess) onForgeSuccess(newToken);

    } catch (err) {
      console.error("Deployment failed:", err);
      alert(`⚠️ Deployment Error: ${err?.message || "Transaction rejected."}`);
      setIsDeploying(false);
    }
  };

  const handleMediaSelected = (mediaData) => {
    setImagePreview(mediaData.previewUrl);
    setThumbnailUrl(mediaData.thumbnailUrl);
    setMediaType(mediaData.type);
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
    setAcceptedDisclaimer(false);
    setIsDeploying(false);
    setDeploySuccess(false);
    setDeployedTokenAddress('');
    setUploaderKey(prev => prev + 1); 
  };

  const calculatedProgress = () => {
    const parsed = parseFloat(initialBuy.replace(/,/g, '')) || 0;
    return Math.min(((parsed / 85) * 100), 100).toFixed(1);
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f12] text-white font-sans p-4 lg:p-6 select-none">
      
      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-lg lg:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#089981]" fill="currentColor">
              <path d="M 50 10 L 10 90 L 30 90 L 50 45 L 70 90 L 90 90 Z" fill="#FFFFFF" />
              <path d="M 50 45 C 35 70, 35 85, 50 85 C 65 85, 65 70, 50 45 Z" fill="#089981" />
            </svg>
            The Forge
          </h1>
          <p className="text-[11px] text-zinc-400 font-medium">Deploy fair-launch tokens on Solana with auto-bonding curve initialization.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#1a1b22] border border-white/10 px-3 py-1 rounded-xl text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
          Solana Network
        </div>
      </div>

      {/* 2-COLUMN DASHBOARD GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: ASSET CONFIGURATION & SOCIAL LINKS */}
        <div className="lg:col-span-7 flex flex-col gap-3 bg-[#1a1b22] border border-white/10 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#089981]">01 / Asset Parameters</span>

          {/* MEDIA UPLOADER */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Asset Media (Video / GIF / Image) <span className="text-rose-500">*</span></label>
            <div className="max-h-36 overflow-hidden rounded-xl border border-dashed border-white/15 bg-[#101014] p-2">
              <MediaUploader key={uploaderKey} onMediaSelected={handleMediaSelected} />
            </div>
          </div>

          {/* TOKEN IDENTIFIERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Token Name <span className="text-rose-500">*</span></label>
              <input type="text" placeholder="e.g. Apex Forge" value={tokenName} onChange={(e) => setTokenName(e.target.value)} className="w-full bg-[#101014] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981] font-bold text-xs transition-all" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Ticker Symbol <span className="text-rose-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-xs">$</span>
                <input type="text" placeholder="APEX" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())} className="w-full bg-[#101014] border border-white/10 rounded-xl pl-6 pr-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981] font-black text-xs uppercase transition-all" />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Description</label>
            <textarea placeholder="Describe token utility, vision, or community link..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-[#101014] border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981] font-medium text-xs resize-none transition-all" />
          </div>

          {/* VISIBLE SOCIAL LINKS */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Social Links (Optional)</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">X / Twitter</label>
                <input type="text" placeholder="https://x.com/..." value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full bg-[#101014] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Telegram</label>
                <input type="text" placeholder="https://t.me/..." value={telegram} onChange={(e) => setTelegram(e.target.value)} className="w-full bg-[#101014] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase">Website</label>
                <input type="text" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-[#101014] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-[#089981]" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW, SNIPE AMOUNT & DISCLAIMER */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {/* TOKEN PREVIEW CARD */}
          <div className="bg-[#1a1b22] border border-white/10 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Asset Preview</span>
              <span className="text-[9px] font-mono bg-[#089981]/20 text-[#089981] px-2 py-0.5 rounded-full font-bold">PRE-LAUNCH</span>
            </div>

            <div className="flex items-center gap-3 bg-[#101014] p-2.5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center text-base text-zinc-500">
                {imagePreview ? (
                  mediaType === 'video' ? <video src={imagePreview} autoPlay loop muted className="w-full h-full object-cover" /> : <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : '?'}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="text-xs font-black text-white truncate">{tokenName || 'Asset Name'}</h3>
                <span className="text-[10px] font-mono font-bold text-[#089981]">${tokenSymbol || 'SYMBOL'}</span>
                <p className="text-[9px] text-zinc-500 truncate mt-0.5">{description || 'No description provided yet.'}</p>
              </div>
            </div>
          </div>

          {/* INITIAL SNIPE & LAUNCH ACTION CARD */}
          <div className="bg-[#1a1b22] border border-white/10 rounded-2xl p-3.5 shadow-xl flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#089981]">02 / Liquidity Snipe & Deploy</span>
            
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Initial SOL Snipe Amount</label>
              <div className="flex items-center bg-[#101014] border border-white/10 rounded-xl px-3 py-1 focus-within:border-[#089981] transition-all">
                <input type="text" inputMode="decimal" placeholder="0.00" value={initialBuy} onChange={handleInitialBuyChange} className="w-full bg-transparent text-lg font-black text-white outline-none py-0.5 font-mono" />
                <span className="text-xs font-black text-[#089981]">SOL</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {['0.5', '1.0', '2.5', '5.0'].map(amt => (
                <button key={amt} type="button" onClick={() => setInitialBuy(amt)} className="py-1 bg-white/5 hover:bg-[#089981]/20 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-[#089981] transition-colors border border-white/5 cursor-pointer">{amt}</button>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-[9px] font-black uppercase text-zinc-500 mb-1">
                <span>Curve Fill</span>
                <span>{calculatedProgress()}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#101014] rounded-full overflow-hidden">
                <div className="h-full bg-[#089981] transition-all duration-300" style={{ width: `${calculatedProgress()}%` }}></div>
              </div>
            </div>

            {/* MANDATORY DISCLAIMER CHECKBOX */}
            <div className="flex items-start gap-2 bg-[#101014] border border-white/10 p-2 rounded-xl">
              <input type="checkbox" id="disclaimer" checked={acceptedDisclaimer} onChange={(e) => setAcceptedDisclaimer(e.target.checked)} className="mt-0.5 min-w-[14px] min-h-[14px] accent-[#089981] cursor-pointer" />
              <label htmlFor="disclaimer" className="text-[9px] text-zinc-400 font-medium leading-tight cursor-pointer select-none">
                <strong className="text-white">Acknowledge Risk:</strong> I confirm this token is created for social utility.
              </label>
            </div>

            {/* DEPLOY BUTTON */}
            <button onClick={handleRealDeployment} disabled={isLaunching || !acceptedDisclaimer} className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${acceptedDisclaimer && !isLaunching ? 'bg-[#089981] hover:bg-[#06806b] text-white active:scale-[0.98] cursor-pointer' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'}`}>
              Initialize Contract 🚀
            </button>
          </div>

        </div>

      </div>

     {/* TERMINAL MODAL */}
      {isDeploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0f0f12] border border-[#089981]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
            
            {!deploySuccess && (
              <button onClick={resetForge} className="absolute top-3 right-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 cursor-pointer">Cancel</button>
            )}

            <div className="bg-[#1a1b22] px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#089981]/80"></div>
              <span className="ml-2 text-[10px] font-mono font-bold text-zinc-500">terminal@apex-forge: ~/deploy/${tokenSymbol || 'token'}</span>
            </div>

            <div className="p-8 font-mono text-xs h-64 flex flex-col items-center justify-center gap-4 text-center">
              {!deploySuccess && (
                <>
                  <div className="w-12 h-12 border-4 border-[#089981]/20 border-t-[#089981] rounded-full animate-spin"></div>
                  <p className="text-[#089981] font-bold text-sm animate-pulse">{statusMessage}</p>
                </>
              )}

              {deploySuccess && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-[#089981]/20 rounded-full flex items-center justify-center text-[#089981] text-2xl font-bold">✓</div>
                  <h3 className="text-lg font-black uppercase text-white">Contract Live On-Chain</h3>
                  
                  <div className="bg-black border border-white/10 px-4 py-2 rounded-lg max-w-xs overflow-hidden">
                    <span className="text-[#089981] font-bold text-xs select-all break-all">{deployedTokenAddress}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={resetForge} 
                      className="px-4 py-2 bg-white/10 text-white font-bold uppercase text-xs rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      Deploy Another
                    </button>
                    <button 
                      onClick={() => {
                        resetForge();
                      }} 
                      className="px-5 py-2 bg-[#089981] text-black font-black uppercase text-xs rounded-lg hover:bg-[#06806b] transition-colors cursor-pointer"
                    >
                      View Terminal 🚀
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}