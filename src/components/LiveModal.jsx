import React, { useState, useEffect } from 'react';

export default function LiveModal({ isOpen, onClose, token = { symbol: 'FORGE', name: 'Apex Forge' } }) {
  const [streamUrl, setStreamUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState('');

  // 🚀 SMART PARSER: Twitch, YouTube, and Kick links
  useEffect(() => {
    if (!streamUrl) {
      setEmbedUrl(null);
      setError('');
      return;
    }

    try {
      const urlStr = streamUrl.toLowerCase();
      let parsedUrl = null;

      if (urlStr.includes('twitch.tv')) {
        const channel = streamUrl.split('/').filter(Boolean).pop();
        const parentDomain = window.location.hostname || 'localhost';
        parsedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}&autoplay=true`;
      } 
      else if (urlStr.includes('youtube.com/watch?v=')) {
        const videoId = new URL(streamUrl).searchParams.get('v');
        parsedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } 
      else if (urlStr.includes('youtu.be/')) {
        const videoId = streamUrl.split('youtu.be/')[1].split('?')[0];
        parsedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } 
      else if (urlStr.includes('kick.com/')) {
        const channel = streamUrl.split('kick.com/')[1].split('/')[0].split('?')[0];
        parsedUrl = `https://player.kick.com/${channel}`;
      } 
      else {
        setError('Unsupported platform. Use Twitch, YouTube, or Kick.');
        setEmbedUrl(null);
        return;
      }

      setError('');
      setEmbedUrl(parsedUrl);
    } catch (err) {
      setError('Invalid URL format.');
      setEmbedUrl(null);
    }
  }, [streamUrl]);

  const handleGoLive = () => {
    if (embedUrl) {
      setIsLive(true);
      setIsMinimized(false);
    }
  };

  const handleEndStream = () => {
    setIsLive(false);
    setIsMinimized(false);
    setStreamUrl('');
    setEmbedUrl(null);
    if (onClose) onClose();
  };

  if (!isOpen && !isLive) return null;

  return (
    <>
      {/* 📺 FLOATING TV MINI-PLAYER (Always sticky in corner when minimized or broadcasting) */}
      {isMinimized && isLive ? (
        <div 
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-24 right-4 z-[250] bg-[#0F0F14]/90 backdrop-blur-xl border border-[#089981]/50 p-3 rounded-2xl shadow-[0_0_30px_rgba(8,153,129,0.3)] flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300 animate-bounce-subtle"
        >
          <div className="relative w-10 h-10 bg-[#050505] border border-white/10 rounded-xl flex items-center justify-center text-lg">
            {/* Pulsing TV Icon */}
            <span className="animate-pulse">📺</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#089981] rounded-full border-2 border-black animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#089981] rounded-full border-2 border-black"></span>
          </div>

          <div className="flex flex-col pr-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
              <span className="text-[10px] font-black uppercase text-[#089981] tracking-widest">LIVE BROADCAST</span>
            </div>
            <span className="text-xs font-black text-white tracking-wide truncate max-w-[120px]">{token.symbol} Stream</span>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-bold transition-colors"
            title="Expand Stream"
          >
            ⤢
          </button>
        </div>
      ) : (

        /* 🚀 MAIN FULL MODAL OVERLAY */
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn p-4">
          <div className="absolute inset-0" onClick={!isLive ? onClose : undefined}></div>
          
          <div className={`bg-[#121217] border border-white/10 rounded-3xl w-full ${isLive ? 'max-w-3xl' : 'max-w-lg'} p-6 relative z-10 animate-slideUpNative flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-all duration-300`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${isLive ? 'bg-[#089981]/10 border-[#089981]/30 text-[#089981]' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
                  <span className="text-base">📺</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">
                    {isLive ? 'Active TV Stream' : 'Broadcast to Token Page'}
                  </h3>
                  <span className="text-[10px] font-bold text-zinc-500 font-mono">${token.symbol} Channel</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLive && (
                  <button 
                    onClick={() => setIsMinimized(true)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5 text-xs font-black uppercase tracking-wider flex items-center gap-1"
                    title="Minimize to Floating TV Widget"
                  >
                    <span>🗗</span> Mini
                  </button>
                )}
                <button 
                  onClick={isLive ? () => setIsMinimized(true) : onClose} 
                  className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {!isLive ? (
              <>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Embed your live stream link directly onto the <strong className="text-white">${token.symbol}</strong> trading interface. Holders can watch live in a floating TV window while trading!
                </p>

                {/* Stream URL Input */}
                <div className="flex flex-col gap-2 mb-6">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Twitch / YouTube / Kick Link</label>
                  <input 
                    type="text" 
                    placeholder="https://twitch.tv/yourchannel"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#089981]/50 rounded-xl px-4 py-3.5 text-xs text-white font-mono outline-none transition-colors shadow-inner"
                  />
                  {error && <span className="text-[10px] font-bold text-rose-500 mt-1">{error}</span>}
                  {!error && embedUrl && <span className="text-[10px] font-bold text-[#089981] mt-1">✓ Valid Stream Source. Ready to Broadcast.</span>}
                </div>

                {/* Badges */}
                <div className="flex gap-2 justify-center mb-8">
                  <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-lg text-zinc-400 border border-white/5">Twitch</span>
                  <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-lg text-zinc-400 border border-white/5">YouTube</span>
                  <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-lg text-zinc-400 border border-white/5">Kick</span>
                </div>

                {/* Launch Stream CTA */}
                <button 
                  onClick={handleGoLive}
                  disabled={!embedUrl}
                  className="w-full bg-[#089981] disabled:opacity-40 hover:bg-[#06806b] text-black py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(8,153,129,0.3)] active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>📺</span> Launch TV Broadcast
                </button>
              </>
            ) : (
              /* ACTIVE EMBED PLAYER */
              <div className="flex flex-col w-full">
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative mb-6">
                  <iframe 
                    src={embedUrl} 
                    className="w-full h-full absolute inset-0"
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; fullscreen"
                    title="Live Stream"
                  ></iframe>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Broadcasting Live</span>
                    <span className="text-xs font-black text-white">{token.name} (${token.symbol}) Holder Stream</span>
                  </div>
                  
                  <button 
                    onClick={handleEndStream}
                    className="px-5 py-2.5 bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                  >
                    End Stream
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}