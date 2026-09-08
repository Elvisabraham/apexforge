import React, { useState } from 'react';
import { X, Copy, Check, Download, Share } from 'lucide-react';
import { toPng } from 'html-to-image';

// Standard X (Twitter) Icon
const XIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Your Custom DexDollarIcon
const DexDollarIcon = ({ className = "w-3 h-3", strokeWidth = 3 }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default function ShareModal({ currentToken, onClose }) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const symbol = currentToken?.symbol || 'TKN';
  const charSum = symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  const rawAddress = (currentToken?.mintAddress || `7hVVo${charSum}czBBsc2G9Xm`).replace(/^CA:\s*/i, '');
  const formattedAddress = rawAddress.length > 10 ? `${rawAddress.slice(0, 6)}...${rawAddress.slice(-4)}` : rawAddress;
  
  const mockPrice = ((charSum % 80) + 1) * 0.0001;
  const mockMcap = ((charSum % 90) + 10) + 'K';
  
  const displayPrice = (currentToken?.price || mockPrice.toFixed(5)).toString().replace(/\$/g, '');
  const displayMcap = (currentToken?.mcap || mockMcap).toString().replace(/\$/g, '');

  // NEW: Calculate the 24h Percentage Change
  const rawChange = currentToken?.change24h || `+${((charSum % 150) + 15).toFixed(2)}%`;
  const isPositive = rawChange.toString().startsWith('+') || parseFloat(rawChange) > 0;
  const displayChange = rawChange.toString().startsWith('+') || rawChange.toString().startsWith('-') ? rawChange : `+${rawChange}`;

  const shareText = `Apeing $${symbol} on ApexForge! 🚀\nCA: ${rawAddress}\n\nTrade here: ${window.location.href}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleSaveImage = async () => {
    setIsDownloading(true);
    const cardElement = document.getElementById('apex-share-card');
    
    if (cardElement) {
      try {
        const dataUrl = await toPng(cardElement, {
          cacheBust: true,
          backgroundColor: '#0a0b0e',
          pixelRatio: 2
        });
        
        const link = document.createElement('a');
        link.download = `ApexForge-${symbol}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error saving image:', err);
      }
    }
    setIsDownloading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ApexForge: ${symbol}`,
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm relative text-left animate-in fade-in zoom-in-95 duration-150">
        
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div id="apex-share-card" className="bg-gradient-to-b from-[#13141a] to-[#0a0b0e] border border-[#00f2a1]/20 rounded-3xl p-6 mb-5 relative overflow-hidden shadow-[0_0_50px_rgba(0,242,161,0.15)]">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00f2a1]/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
            <span className="text-[12px] font-black tracking-widest text-white uppercase flex items-center gap-1.5">
              <img src="/logo.png" alt="ApexForge" className="w-5 h-5 object-contain" onError={(e) => e.target.style.display='none'} />
              APEX<span className="text-[#00f2a1]">FORGE</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Built for the trenches</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-[#1c1d24] flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0">
              {currentToken?.imagePreview ? (
                <img src={currentToken.imagePreview} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                symbol.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h4 className="text-2xl font-black text-white tracking-tight leading-none mb-1">
                {currentToken?.name || symbol}
              </h4>
              <span className="text-sm text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5 flex items-center w-max">
                <DexDollarIcon className="w-3.5 h-3.5 mr-[1px] text-zinc-500" strokeWidth={2.5} />{symbol}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
              <div className="flex justify-between items-start mb-1">
                <span className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest">Price</span>
                {/* 24h Percentage Change Added Here */}
                <span className={`text-[11px] font-black tracking-wider ${isPositive ? 'text-[#00f2a1]' : 'text-[#F23645]'}`}>
                  {displayChange}
                </span>
              </div>
              <span className="flex items-center text-xl font-black text-white tabular-nums tracking-tight">
                <DexDollarIcon className="w-4 h-4 mr-[1px] text-zinc-400" strokeWidth={3} />
                {displayPrice}
              </span>
            </div>
            
            <div className="bg-[#00f2a1]/10 p-4 rounded-2xl border border-[#00f2a1]/20 shadow-[inset_0_0_20px_rgba(0,242,161,0.05)]">
              <span className="block text-[10px] text-[#00f2a1]/70 uppercase font-black tracking-widest mb-1">Market Cap</span>
              <span className="flex items-center text-xl font-black text-[#00f2a1] tabular-nums tracking-tight">
                <DexDollarIcon className="w-4 h-4 mr-[1px] text-[#00f2a1]/70" strokeWidth={3} />
                {displayMcap}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-black/60 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">CA</span>
            <span className="text-xs text-zinc-300 font-mono tracking-wider">{formattedAddress}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleTweet}
            className="w-full bg-white hover:bg-zinc-200 text-black font-black text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg active:scale-[0.98]"
          >
            <XIcon className="w-4 h-4 fill-black" /> Post on X
          </button>
          
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={handleSaveImage}
              disabled={isDownloading}
              className={`bg-[#1c1d24] hover:bg-white/10 text-zinc-300 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer active:scale-[0.98] ${isDownloading ? 'opacity-50' : ''}`}
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-[#00f2a1]' : ''}`} /> 
              {isDownloading ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleShare}
              className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <Share className="w-4 h-4" /> Share
            </button>
            <button 
              onClick={handleCopy}
              className="bg-[#1c1d24] hover:bg-white/10 text-zinc-300 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer active:scale-[0.98]"
            >
              {copied ? <Check className="w-4 h-4 text-[#00f2a1]" /> : <Copy className="w-4 h-4" />} Copy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}