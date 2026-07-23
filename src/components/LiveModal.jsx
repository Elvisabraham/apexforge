import React, { useState, useEffect } from 'react';

export default function LiveModal({ isOpen, onClose, token = { symbol: 'FORGE', name: 'Apex Forge' } }) {
  const [streamUrl, setStreamUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState('');

  // 🚀 SMART PARSER: Automatically formats Twitch, YouTube, and Kick links into embeddable iframes
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
        // Handle Twitch
        const channel = streamUrl.split('/').filter(Boolean).pop();
        const parentDomain = window.location.hostname || 'localhost';
        parsedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}&autoplay=true`;
      } 
      else if (urlStr.includes('youtube.com/watch?v=')) {
        // Handle YouTube standard
        const videoId = new URL(streamUrl).searchParams.get('v');
        parsedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } 
      else if (urlStr.includes('youtu.be/')) {
        // Handle YouTube short link
        const videoId = streamUrl.split('youtu.be/')[1].split('?')[0];
        parsedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } 
      else if (urlStr.includes('kick.com/')) {
        // Handle Kick
        const channel = streamUrl.split('kick.com/')[1].split('/')[0].split('?')[0];
        parsedUrl = `https://player.kick.com/${channel}`;
      } 
      else {
        setError('Unsupported platform. Please use Twitch, YouTube, or Kick.');
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
    if (embedUrl) setIsLive(true);
  };

  const handleEndStream = () => {
    setIsLive(false);
    setStreamUrl('');
    setEmbedUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
      {/* Click outside to close (only if not actively live) */}
      <div className="absolute inset-0" onClick={!isLive ? onClose : undefined}></div>
      
      <div className={`bg-[#121212] border border-white/10 rounded-3xl w-full ${isLive ? 'max-w-3xl' : 'max-w-lg'} p-6 relative z-10 animate-slideUpNative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-[#089981] shadow-[0_0_10px_rgba(8,153,129,0.8)] animate-pulse' : 'bg-rose-500'}`}></span>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              {isLive ? 'Live Broadcast Active' : 'Broadcast to Token Page'}
            </h3>
          </div>
          {!isLive && (
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full">
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        {!isLive ? (
          <>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Embed your external stream directly onto the <strong className="text-white">${token.symbol}</strong> trading page. We currently support Twitch, YouTube, and Kick URLs.
            </p>

            {/* Input URL */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stream URL</label>
              <input 
                type="text" 
                placeholder="https://twitch.tv/yourchannel"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#089981]/50 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none transition-colors shadow-inner"
              />
              {error && <span className="text-[10px] font-bold text-rose-500 mt-1">{error}</span>}
              {!error && embedUrl && <span className="text-[10px] font-bold text-[#089981] mt-1">Valid link detected. Ready to broadcast.</span>}
            </div>

            {/* Supported Platforms Badges */}
            <div className="flex gap-3 justify-center mb-8">
               <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 rounded text-zinc-400 border border-white/5">Twitch</span>
               <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 rounded text-zinc-400 border border-white/5">YouTube</span>
               <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 rounded text-zinc-400 border border-white/5">Kick</span>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleGoLive}
              disabled={!embedUrl}
              className="w-full bg-[#089981] disabled:opacity-50 disabled:hover:bg-[#089981] hover:bg-[#06806b] text-black py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(8,153,129,0.3)] active:scale-95"
            >
              Start Embedding Stream
            </button>
          </>
        ) : (
          // ACTIVE LIVE STATE (Embedded iFrame)
          <div className="flex flex-col w-full">
            
            {/* The actual video player */}
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

            {/* Stream Info & Controls */}
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
               <div className="flex flex-col">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Broadcasting to</span>
                 <span className="text-sm font-black text-white">{token.name} ({token.symbol}) Holders</span>
               </div>
               
               <button 
                onClick={handleEndStream}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95"
              >
                End Stream
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}