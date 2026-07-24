import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (!isOpen) return null;

  const handleSimulatedAuth = (provider) => {
    setSelectedMethod(provider);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Mock user profile data generated upon sign-in
      const mockProfile = {
        username: provider === 'google' ? 'GoogleUser' : provider === 'twitter' ? 'CryptoElvis' : 'SolanaWhale',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}_${Date.now()}`,
        walletAddress: '8AVmX9aQwZoonSolanaNet11oHEZforge',
        provider: provider
      };

      if (onLoginSuccess) {
        onLoginSuccess(mockProfile);
      }
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-[#141419] border border-white/10 rounded-3xl w-full max-w-md p-6 sm:p-8 relative z-10 animate-slideUpNative flex flex-col shadow-2xl overflow-hidden">
        
        {/* Glow ambient effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#089981]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-white uppercase tracking-wider">Welcome to Apex Forge</h3>
            <p className="text-xs text-zinc-400 font-medium mt-1">Sign in to trade, chat, and build your empire.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 relative z-10">
            <div className="w-10 h-10 border-2 border-[#089981] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
              Connecting via {selectedMethod?.toUpperCase()}...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 relative z-10">
            
            {/* Google Sign In */}
            <button 
              onClick={() => handleSimulatedAuth('google')}
              className="w-full py-3.5 px-5 bg-white hover:bg-zinc-100 text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.15C3.18 21.35 7.28 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.39l4.07-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.18 2.65 1.2 6.61l4.07 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              Continue with Google
            </button>

            {/* X (Twitter) Sign In */}
            <button 
              onClick={() => handleSimulatedAuth('twitter')}
              className="w-full py-3.5 px-5 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-inner"
            >
              <span className="text-sm font-black">𝕏</span>
              Continue with X (Twitter)
            </button>

            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">Or Web3 Native</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Connect Solana Wallet */}
            <button 
              onClick={() => handleSimulatedAuth('wallet')}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-[#089981] to-[#06806b] hover:opacity-90 text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_15px_rgba(8,153,129,0.2)]"
            >
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect Solana Wallet
            </button>

          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-zinc-500 font-medium">
            By connecting, you agree to Apex Forge Terms of Service & Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
}