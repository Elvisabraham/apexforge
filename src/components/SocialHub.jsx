import React, { useState } from 'react';

export default function SocialHub({ onBack, userProfile }) {
  const [activeTab, setActiveTab] = useState('CHAT'); // 'CHAT' | 'FEED'
  const [messageInput, setMessageInput] = useState('');
  
  // Mock Trollbox Messages
  const [messages, setMessages] = useState([
    { id: 1, user: 'Ansem.sol', avatar: '🐋', text: 'Just loaded another 50 SOL into $APEX. This chart is breaking out.', time: '2m ago', badge: '🐋' },
    { id: 2, user: 'DegenChad', avatar: '⚡', text: '@Elvis check out the bonding curve progress on the new vault!', time: '5m ago', badge: '⚡' },
    { id: 3, user: 'ForgeDev', avatar: '🛠️', text: 'V2 liquidity locks have been successfully verified on-chain.', time: '12m ago', badge: '🛠️' },
  ]);

  // Mock Alpha Feed Posts
  const [feedPosts, setFeedPosts] = useState([
    { 
      id: 1, 
      author: 'Studio.web3', 
      avatar: '👑', 
      title: 'The Roadmap to Raydium Liquidity Migration', 
      content: 'We are officially pushing the next wave of creator tools live this week. Expect automated anti-bot protection and instant profile verification across all deployed assets.', 
      likes: 342, 
      comments: 45, 
      time: '1h ago',
      image: null
    },
    { 
      id: 2, 
      author: 'AlphaKing', 
      avatar: '🎯', 
      title: 'Top 3 Memes to Watch This Epoch', 
      content: 'Volume is rotating back into community-driven art. Look for assets with active video trailers and locked liquidity.', 
      likes: 189, 
      comments: 19, 
      time: '3h ago',
      image: null
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: userProfile?.name || 'ElvisVision',
      avatar: userProfile?.avatar ? userProfile.avatar : '👤',
      text: messageInput,
      time: 'Just now',
      badge: '👑'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-white font-sans overflow-hidden select-none animate-fadeIn">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- HEADER --- */}
      <header className="flex-none z-50 bg-[#050505]/95 backdrop-blur-xl pt-6 pb-4 px-4 border-b border-white/[0.04] sticky top-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-md">💬</span>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-widest text-white uppercase mt-1">Social Hub</h1>
              <span className="text-[9px] text-[#089981] font-bold tracking-widest uppercase flex items-center gap-1.5">
                Global Trollbox & Alpha Feed
              </span>
            </div>
          </div>
          
          {onBack && (
            <button 
              onClick={onBack} 
              className="w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95 shadow-inner cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* --- TABS --- */}
        <div className="flex bg-[#121212] border border-white/5 p-1 rounded-2xl w-full shadow-inner">
          {['CHAT', 'FEED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#089981] text-white shadow-[0_4px_15px_rgba(8,153,129,0.3)]'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              {tab === 'CHAT' ? '💬 Trollbox Chat' : '📢 Alpha Feed'}
            </button>
          ))}
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 pt-4 flex flex-col">
        
        {activeTab === 'CHAT' ? (
          /* --- TROLLBOX CHAT STREAM --- */
          <div className="flex flex-col gap-3 flex-1">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#121212]/60 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-black border border-white/10 flex items-center justify-center text-base shrink-0 shadow-inner overflow-hidden">
                    {msg.avatar.startsWith('http') || msg.avatar.length > 2 ? (
                      <img src={msg.avatar} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      msg.avatar
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{msg.user}</span>
                        <span className="text-xs">{msg.badge}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">{msg.time}</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium leading-relaxed break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- ALPHA FEED STREAM --- */
          <div className="flex flex-col gap-4">
            {feedPosts.map((post) => (
              <div key={post.id} className="bg-[#121212] border border-white/5 hover:border-[#089981]/30 rounded-2xl p-5 flex flex-col gap-3 transition-colors shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-lg shadow-inner">
                      {post.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">{post.author}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase">{post.time}</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-[#089981]/30 text-[#089981] bg-[#089981]/10">Verified Creator</span>
                </div>

                <h3 className="text-sm font-black text-white tracking-wide mt-1">{post.title}</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">{post.content}</p>

                <div className="flex items-center gap-6 pt-3 border-t border-white/5 text-[10px] font-bold text-zinc-400">
                  <button className="flex items-center gap-1.5 hover:text-[#089981] transition-colors cursor-pointer">
                    <span>❤️</span> {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-[#089981] transition-colors cursor-pointer">
                    <span>💬</span> {post.comments} Comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- CHAT INPUT BAR (ONLY ACTIVE IN CHAT TAB) --- */}
      {activeTab === 'CHAT' && (
        <div className="absolute bottom-0 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl py-3 px-4 border-t border-white/[0.04] shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Broadcast to global trollbox (use @tag to mention)..." 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#089981]/50 transition-colors shadow-inner"
            />
            <button 
              type="submit"
              className="bg-[#089981] hover:bg-[#06806b] text-black font-black uppercase text-xs tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(8,153,129,0.3)] cursor-pointer"
            >
              Send 🚀
            </button>
          </form>
        </div>
      )}

    </div>
  );
}