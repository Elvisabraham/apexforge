import React, { useState, useEffect } from 'react';
import { useStream } from './StreamProvider'; // 🚀 Brings in the global brain

export default function LiveModal({ isOpen, onClose, token = { symbol: 'FORGE', name: 'Apex Forge' } }) {
  const { startStream } = useStream(); // 🚀 Grab the global start function
  const [streamUrl, setStreamUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState(null);
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
      // 🚀 Fire the global stream instead of local state!
      startStream(embedUrl);
      
      // Clear input and close modal
      setStreamUrl('');
      if (onClose) onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-[#121217] border border-white/10 rounded-3xl w-full max-w-lg p-6 relative z-10 animate-slideUpNative flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-all duration-300">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-500">
              <span className="text-base">📺</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                Broadcast to Token Page
              </h3>
              <span className="text-[10px] font-bold text-zinc-500 font-mono">${token.symbol} Channel</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
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
      </div>
    </div>
  );
}