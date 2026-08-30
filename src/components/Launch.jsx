import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import MediaUploader from './MediaUploader'; 
import { supabase } from '../supabaseClient';
import { useLaunchToken } from '../hooks/useLaunchToken';

export default function Forge({ onForgeSuccess }) {
  const { connected, publicKey } = useWallet();
  const { executeLaunchOnChain, isLaunching } = useLaunchToken();

  // FORM STATES
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [description, setDescription] = useState('');
  
  // MEDIA STATES
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [mediaType, setMediaType] = useState('image'); 
  const [uploaderKey, setUploaderKey] = useState(0); 
  
  // SOCIALS & SNIPE STATES
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const [initialBuy, setInitialBuy] = useState('');
  
  // DISCLAIMER & MODAL STATES
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initializing transaction...');

  // REAL DEPLOYMENT HANDLER
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

  // MEDIA UPLOAD CALLBACK
  const handleMediaSelected = (mediaData) => {
    setImagePreview(mediaData.previewUrl);
    setThumbnailUrl(mediaData.thumbnailUrl);
    setMediaType(mediaData.type);
  };

  // FORMAT INPUT SOL BUY AMOUNT
  const handleInitialBuyChange = (e) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    if ((val.match(/\./g) || []).length > 1) val = val.substring(0, val.lastIndexOf('.'));
    const parts = val.split('.');
    if (parts[0]) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setInitialBuy(parts.join('.'));
  };

  // RESET FORM
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

  // CALCULATE CURVE FILL PERCENTAGE
  const calculatedProgress = () => {
    const parsed = parseFloat(initialBuy.replace(/,/g, '')) || 0;
    return Math.min(((parsed / 85) * 100), 100).toFixed(1);
  };

  const isFormReady = tokenName.trim() !== '' && tokenSymbol.trim() !== '' && imagePreview && acceptedDisclaimer && connected;

  return (
    <div className="w-full h-full bg-[#0c0d10] text-white p-3 lg:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#00f2a1] text-xl font-bold">⚡</span>
            <h1 className="text-xl lg:text-2xl font-black uppercase tracking-wider font-mono">The Forge</h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Deploy fair-launch tokens on Solana with auto-bonding curve initialization.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#121318] border border-white/5 rounded-xl font-mono text-xs">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#00f2a1] animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-zinc-300 font-bold">
            {connected ? 'Solana Connected' : 'Wallet Disconnected'}
          </span>
        </div>
      </div>

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: 01 / ASSET PARAMETERS */}
        <div className="lg:col-span-7 bg-[#121318] border border-white/5 rounded-2xl p-4 lg:p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-mono font-black tracking-widest text-[#00f2a1] uppercase">
              01 / Asset Parameters
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">* Required Fields</span>
          </div>

          {/* MEDIA UPLOADER INTEGRATION */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase block">
              Asset Media (Video / GIF / Image) <span className="text-red-400">*</span>
            </label>
            <div className="rounded-xl border border-dashed border-white/10 bg-[#0a0b0e] p-2 hover:border-[#089981]/50 transition-colors">
              <MediaUploader key={uploaderKey} onMediaSelected={handleMediaSelected} />
            </div>
          </div>

          {/* TOKEN NAME & TICKER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase block">
                Token Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Forge"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-white/10 focus:border-[#089981] rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 outline-none font-mono transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase block">
                Ticker Symbol <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-mono">$</span>
                <input
                  type="text"
                  placeholder="APEX"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  className="w-full bg-[#0a0b0e] border border-white/10 focus:border-[#089981] rounded-xl pl-7 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 outline-none font-mono uppercase transition-colors"
                />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase block">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe token utility, vision, or community link..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0b0e] border border-white/10 focus:border-[#089981] rounded-xl p-3 text-xs text-white placeholder-zinc-600 outline-none font-mono resize-none transition-colors"
            />
          </div>

          {/* SOCIAL LINKS */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block">
              Social Links (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">𝕏</span>
                <input
                  type="text"
                  placeholder="https://x.com/..."
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full bg-[#0a0b0e] border border-white/10 focus:border-[#089981] rounded-xl pl-8 pr-2.5 py-2 text-[11px] text-white placeholder-zinc-600 outline-none font-mono transition-colors"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">✈️</span>
                <input
                  type="text"
                  placeholder="https://t.me/..."
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="w-full bg-[#0a0b0e] border border-white/10 focus:border-[#089981] rounded-xl pl-8 pr-2.5 py-2 text-[11px] text-white placeholder-zinc-600 outline-none font-mono transition-colors"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">🌐</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-[#0a0b0e] border border-white/10 focus:border-[#089981] rounded-xl pl-8 pr-2.5 py-2 text-[11px] text-white placeholder-zinc-600 outline-none font-mono transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & SNIPE DEPLOY */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* LIVE ASSET PREVIEW CARD */}
          <div className="bg-[#121318] border border-white/5 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f2a1] shadow-[0_0_6px_#00f2a1]" />
                <span className="text-xs font-mono font-black tracking-widest text-white uppercase">
                  Live Asset Preview
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#089981]/20 text-[#00f2a1] border border-[#089981]/30 text-[9px] font-mono font-bold rounded-md uppercase">
                Pre-Launch
              </span>
            </div>

            <div className="bg-[#0a0b0e] border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview ? (
                  mediaType === 'video' ? (
                    <video src={imagePreview} autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  )
                ) : (
                  <span className="text-zinc-600 font-mono text-lg font-bold">?</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white truncate font-mono">
                  {tokenName || 'Asset Name'}
                </h3>
                <p className="text-xs text-[#00f2a1] font-mono font-bold truncate">
                  ${tokenSymbol || 'SYMBOL'}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">
                  {description || 'No description provided yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* 02 / LIQUIDITY SNIPE & DEPLOY CARD */}
          <div className="bg-[#121318] border border-white/5 rounded-2xl p-4 lg:p-5 space-y-4 shadow-xl">
            <div className="border-b border-white/5 pb-3">
              <span className="text-xs font-mono font-black tracking-widest text-[#00f2a1] uppercase">
                02 / Liquidity Snipe & Deploy
              </span>
            </div>

            {/* INITIAL SNIPE INPUT */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                  Initial SOL Snipe Amount
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {connected ? 'Wallet Ready' : 'Wallet Unconnected'}
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={initialBuy}
                  onChange={handleInitialBuyChange}
                  className="w-full bg-[#0a0b0e] border border-white/10 focus:border-[#089981] rounded-xl pl-3 pr-12 py-2.5 text-sm text-white font-mono placeholder-zinc-600 outline-none transition-colors"
                />
                <span className="absolute right-3 top-3 text-xs font-mono font-bold text-[#00f2a1]">
                  SOL
                </span>
              </div>

              {/* QUICK PRESET SOL BUTTONS */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {['0', '0.5', '1.0', '2.5', '5.0'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInitialBuy(amt === '0' ? '' : amt)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                      initialBuy === amt || (amt === '0' && !initialBuy)
                        ? 'bg-[#089981] text-white border-[#089981] shadow-sm shadow-[#089981]/30'
                        : 'bg-[#0a0b0e] text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {amt === '0' ? 'Reset' : amt}
                  </button>
                ))}
              </div>
            </div>

            {/* CURVE FILL STATS */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-zinc-400 uppercase">Estimated Initial Curve Fill</span>
                <span className="text-[#00f2a1] font-bold">{calculatedProgress()}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#089981] to-[#00f2a1] transition-all duration-300"
                  style={{ width: `${Math.max(parseFloat(calculatedProgress()) || 0, 2)}%` }}
                />
              </div>
            </div>

            {/* RISK ACKNOWLEDGEMENT CHECKBOX */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={acceptedDisclaimer}
                onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                className="mt-0.5 rounded bg-[#0a0b0e] border-white/20 text-[#089981] focus:ring-0 cursor-pointer accent-[#089981]"
              />
              <span className="text-[11px] font-mono text-zinc-400 leading-tight">
                <strong className="text-white">Acknowledge Risk:</strong> I confirm this token is created for social utility and fair deployment.
              </span>
            </label>

            {/* INITIALIZE CONTRACT BUTTON */}
            <button
              type="button"
              onClick={handleRealDeployment}
              disabled={isLaunching || !isFormReady}
              className={`w-full py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isFormReady && !isLaunching
                  ? 'bg-gradient-to-r from-[#089981] to-[#00f2a1] text-black shadow-lg shadow-[#089981]/25 hover:opacity-90 active:scale-[0.99] cursor-pointer'
                  : 'bg-zinc-800/60 text-zinc-500 border border-white/5 cursor-not-allowed opacity-60'
              }`}
            >
              <span>{isLaunching ? 'Deploying On-Chain...' : 'Initialize Contract'}</span>
              <span>🚀</span>
            </button>
          </div>

        </div>

      </div>

      {/* TERMINAL DEPLOYMENT MODAL */}
      {isDeploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0c0d10] border border-[#089981]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative font-mono">
            
            {!deploySuccess && (
              <button
                type="button"
                onClick={resetForge}
                className="absolute top-3 right-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 cursor-pointer z-10"
              >
                Cancel
              </button>
            )}

            <div className="bg-[#121318] px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-[#00f2a1]/80" />
              <span className="ml-2 text-[10px] text-zinc-500">
                terminal@apex-forge: ~/deploy/${tokenSymbol || 'token'}
              </span>
            </div>

            <div className="p-8 text-xs h-64 flex flex-col items-center justify-center gap-4 text-center">
              {!deploySuccess && (
                <>
                  <div className="w-12 h-12 border-4 border-[#089981]/20 border-t-[#00f2a1] rounded-full animate-spin" />
                  <p className="text-[#00f2a1] font-bold text-sm animate-pulse">{statusMessage}</p>
                </>
              )}

              {deploySuccess && (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-14 h-14 bg-[#089981]/20 border border-[#089981]/40 rounded-full flex items-center justify-center text-[#00f2a1] text-2xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase text-white">Contract Live On-Chain</h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Solana Bonding Curve Initialized</p>
                  </div>
                  
                  <div className="w-full bg-[#0a0b0e] border border-white/10 px-3 py-2 rounded-xl text-center">
                    <span className="text-[#00f2a1] font-bold text-xs select-all break-all">
                      {deployedTokenAddress}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      type="button"
                      onClick={resetForge} 
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Deploy Another
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        if (onForgeSuccess) {
                          onForgeSuccess({
                            address: deployedTokenAddress,
                            name: tokenName,
                            symbol: tokenSymbol,
                            image: imagePreview,
                            description: description,
                            mediaType: mediaType
                          });
                        }
                        resetForge();
                      }} 
                      className="px-5 py-2 bg-gradient-to-r from-[#089981] to-[#00f2a1] text-black font-black uppercase text-xs rounded-xl transition-all shadow-md shadow-[#089981]/20 cursor-pointer"
                    >
                      View Token 🚀
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