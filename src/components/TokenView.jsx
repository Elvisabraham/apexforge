import React, { useState } from 'react';

export default function TokenHome({ 
  selectedTokenData, 
  setSelectedTokenData, 
  globalTokens = [], 
  userSolBalance = 0,
  formatWithCommas = (val) => val,
  calculateTokenYield = () => '0',
  handleExecuteTrade = () => {} 
}) {
  const [leftTab, setLeftTab] = useState('Tokens');
  const [centerTab, setCenterTab] = useState('chat');
  const [tradeMode, setTradeMode] = useState('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Chat state for Token Chat tab
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { id: 1, user: 'SolWhale_99', text: 'Chart looking super bullish here! 🚀', time: '10:24' },
    { id: 2, user: 'ApexTrader', text: 'Just doubled my position on this dip.', time: '10:25' },
    { id: 3, user: 'CryptoDev_X', text: 'Liquidity is locked. Solid project.', time: '10:26' },
  ]);

  // Active token fallback
  const currentToken = selectedTokenData || globalTokens[0] || {
    name: 'POPCAT',
    symbol: 'POPCAT',
    price: '$0.064061',
    mcap: '$62.78M',
    change24h: '+13.51%',
    isPositive: true,
    mintAddress: '7GCihgDB8fe6KNjn2MYtkzzZcRjQy3t9GHdC8uHYmW2hr',
    icon: '🐱'
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLogs(prev => [
      ...prev, 
      { id: Date.now(), user: 'You', text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatMessage('');
  };

  return (
    <div className="w-full h-full bg-[#0c0d10] text-white grid grid-cols-12 gap-2 p-2 overflow-hidden select-none">
      
      {/* ==================== LEFT SIDEBAR: WATCHLIST ==================== */}
      <div className="col-span-12 lg:col-span-3 xl:col-span-2.5 bg-[#121318] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden">
        {/* Nav Header Tabs */}
        <div className="flex items-center border-b border-white/5 bg-[#0a0b0e] p-1.5 gap-1">
          {['Tokens', 'Follows', 'Track'].map((tab) => (
            <button
              key={tab}
              onClick={() => setLeftTab(tab)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                leftTab === tab 
                  ? 'bg-[#1c1d24] text-white shadow' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Watchlist Token List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03] p-1">
          {(globalTokens.length > 0 ? globalTokens : [
            { symbol: 'POPCAT', mcap: '$63.78M', change24h: '+15.67%', isPositive: true },
            { symbol: 'KMNO', mcap: '$141.54M', change24h: '+6.3%', isPositive: true },
            { symbol: 'META', mcap: '$157.52M', change24h: '+41.6%', isPositive: true },
            { symbol: 'SNDK', mcap: '$1.72M', change24h: '+0.93%', isPositive: true },
            { symbol: 'Morty', mcap: '$2.49M', change24h: '-17.15%', isPositive: false },
            { symbol: 'SKHY', mcap: '$3.22M', change24h: '+0.8%', isPositive: true },
            { symbol: 'GIGA', mcap: '$29.94M', change24h: '+30.06%', isPositive: true },
            { symbol: 'PUMP', mcap: '$1.91B', change24h: '-0.87%', isPositive: false }
          ]).map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTokenData && setSelectedTokenData(item)}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                currentToken.symbol === item.symbol ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                  {item.icon || item.symbol.slice(0, 2)}
                </div>
                <span className="text-xs font-black text-white">{item.symbol}</span>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-[11px] font-mono text-zinc-400">{item.mcap}</span>
                <span className={`text-[11px] font-mono font-bold ${item.isPositive !== false ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  {item.change24h}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Bottom Balance Badge */}
        <div className="p-2.5 border-t border-white/5 bg-[#0a0b0e] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-bold">Portfolio Balance</span>
          <span className="text-xs font-mono font-black text-[#00f2a1]">$99.60</span>
        </div>
      </div>

      {/* ==================== CENTER COLUMN: CHART & TOKEN CHAT ==================== */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-6.5 flex flex-col h-full gap-2 overflow-hidden">
        
        {/* Token Meta Header */}
        <div className="bg-[#121318] border border-white/5 rounded-xl p-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-lg overflow-hidden">
              {currentToken.imagePreview ? (
                <img src={currentToken.imagePreview} alt={currentToken.symbol} className="w-full h-full object-cover" />
              ) : (
                currentToken.icon || '🪙'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white tracking-wide">{currentToken.name || currentToken.symbol}</h1>
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                    isFollowing ? 'bg-white/10 text-white' : 'bg-[#1c1d24] hover:bg-white/20 text-zinc-300'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                <span>5m</span>
                <span>•</span>
                <span className="truncate max-w-[120px]">{currentToken.mintAddress || 'CA: 7GCi...mW2hr'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase">Price</span>
              <span className="text-xs font-mono font-black text-white">{currentToken.price || '$0.064061'}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase">Market Cap</span>
              <span className="text-xs font-mono font-black text-white">{currentToken.mcap || '$62.78M'}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase">24h Change</span>
              <span className={`text-xs font-mono font-black ${currentToken.isPositive !== false ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                {currentToken.change24h || '+13.51%'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive TradingView Candle Chart Area */}
        <div className="flex-1 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-hidden relative min-h-[300px]">
          {/* Chart Controls Bar */}
          <div className="flex items-center justify-between p-2 border-b border-white/5 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              {['15m', '1h', '4h', '1d'].map((tf, i) => (
                <button key={tf} className={`px-2 py-0.5 rounded hover:text-white ${i === 0 ? 'bg-white/10 text-white font-bold' : ''}`}>
                  {tf}
                </button>
              ))}
              <span className="h-3 w-[1px] bg-white/10 mx-1" />
              <button className="text-white font-bold">Price / MCap</button>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span>Show Outliers</span>
              <span>•</span>
              <span>Phantom</span>
            </div>
          </div>

          {/* Chart Canvas Mock Representation */}
          <div className="flex-1 w-full bg-[#0e0f14] relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#089981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="z-10 text-center">
              <div className="text-4xl mb-2">📈</div>
              <span className="text-xs text-zinc-500 font-mono">TradingView Real-Time Chart Widget Embed</span>
            </div>
          </div>

          {/* Time Selector Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5 bg-[#0a0b0e] text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-3">
              {['5y', '1y', '6m', '3m', '1m', '5d', '1d'].map((range) => (
                <button key={range} className="hover:text-white">{range}</button>
              ))}
            </div>
            <span>11:29:05 (UTC+1)</span>
          </div>
        </div>

        {/* Docked Bottom Sub-Tabs Panel */}
        <div className="h-56 bg-[#121318] border border-white/5 rounded-xl flex flex-col overflow-hidden">
          {/* Sub-Tab Navigation */}
          <div className="flex items-center border-b border-white/5 bg-[#0a0b0e] px-2 gap-4">
            {[
              { id: 'chat', label: 'Token Chat' },
              { id: 'positions', label: 'Positions' },
              { id: 'traders', label: 'Top Traders' },
              { id: 'holders', label: 'Holders (143.29K)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCenterTab(tab.id)}
                className={`py-2 text-xs font-bold border-b-2 transition-all ${
                  centerTab === tab.id 
                    ? 'border-[#089981] text-[#00f2a1]' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 overflow-y-auto p-3">
            {centerTab === 'chat' && (
              <div className="flex flex-col h-full justify-between gap-2">
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {chatLogs.map((log) => (
                    <div key={log.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-2 text-xs flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#089981] mr-2">{log.user}:</span>
                        <span className="text-zinc-300">{log.text}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 shrink-0 ml-2">{log.time}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={`Chat about ${currentToken.symbol}...`}
                    className="flex-1 bg-[#0a0b0e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#089981]"
                  />
                  <button type="submit" className="bg-[#089981] hover:bg-[#07957e] text-black font-black text-xs px-4 py-1.5 rounded-lg transition-all">
                    Send
                  </button>
                </form>
              </div>
            )}

            {centerTab === 'positions' && (
              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/5 text-xs">
                <span className="text-zinc-400">Your Active Position</span>
                <span className="font-mono font-bold text-white">0 {currentToken.symbol}</span>
              </div>
            )}

            {centerTab === 'traders' && (
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-500 text-[10px] uppercase font-bold px-1">
                  <span>Wallet</span>
                  <span>Bought</span>
                  <span>Profit</span>
                </div>
                <div className="flex justify-between p-2 bg-white/[0.02] rounded border border-white/5">
                  <span className="text-zinc-300">7xW9...K3pQ</span>
                  <span className="text-white">12.5 SOL</span>
                  <span className="text-[#089981] font-bold">+$14.2K</span>
                </div>
              </div>
            )}

            {centerTab === 'holders' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Top 10 Holders</span>
                  <span className="text-sm font-mono font-black text-white">39.41%</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] rounded-lg border border-white/5">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Total Holders</span>
                  <span className="text-sm font-mono font-black text-white">143,290</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== RIGHT SIDEBAR: EXECUTION TERMINAL ==================== */}
      <div className="col-span-12 lg:col-span-3 bg-[#121318] border border-white/5 rounded-xl p-3 flex flex-col h-full overflow-y-auto">
        
        {/* 5-Minute Volume Delta Bar */}
        <div className="bg-[#0a0b0e] border border-white/5 rounded-xl p-3 mb-4 shrink-0">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-zinc-400 font-bold">5m Vol</span>
            <span className="font-mono font-black text-white">$349.5K</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono mb-2">
            <span className="text-[#089981] font-bold">1.12K • $157.4K</span>
            <span className="text-[#F23645] font-bold">979 • $192.1K</span>
          </div>
          {/* Dual-Color Volume Ratio Bar */}
          <div className="w-full h-1.5 bg-[#F23645] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#089981]" style={{ width: '45%' }} />
          </div>
        </div>

        {/* Buy / Sell Primary Switcher */}
        <div className="flex p-1 bg-[#0a0b0e] rounded-xl mb-4 border border-white/5 shrink-0">
          <button
            onClick={() => setTradeMode('buy')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              tradeMode === 'buy' ? 'bg-[#089981] text-white shadow' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setTradeMode('sell')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              tradeMode === 'sell' ? 'bg-[#F23645] text-white shadow' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Amount Entry Input */}
        <div className="bg-[#0a0b0e] border border-white/5 rounded-xl p-3 mb-3 focus-within:border-[#089981]/50 transition-colors">
          <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase mb-1">
            <span>Amount to {tradeMode}</span>
            <span>SOL</span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={formatWithCommas(tradeAmount)}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9.]/g, '');
              if ((val.match(/\./g) || []).length > 1) val = val.substring(0, val.lastIndexOf('.'));
              setTradeAmount(val);
            }}
            className="w-full bg-transparent text-2xl font-black text-white outline-none placeholder-zinc-700 font-mono"
          />
        </div>

        {/* SOL Preset Selector Buttons */}
        <div className="grid grid-cols-3 gap-1.5 mb-4 shrink-0">
          {['0.1', '0.25', '0.5', '1', '5', 'Max'].map((preset) => (
            <button
              key={preset}
              onClick={() => setTradeAmount(preset === 'Max' ? '1' : preset)}
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-mono font-bold text-zinc-300 py-1.5 rounded-lg transition-all active:scale-95"
            >
              {preset} {preset !== 'Max' && '≡'}
            </button>
          ))}
        </div>

        {/* Yield & Holdings Calculations */}
        <div className="space-y-2 mb-6 text-xs font-mono shrink-0">
          <div className="flex justify-between text-zinc-400">
            <span>Amount</span>
            <span className="text-white font-bold">{tradeAmount ? calculateTokenYield(tradeAmount) : 0} {currentToken.symbol}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Holdings</span>
            <span className="text-white font-bold">0 {currentToken.symbol}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto shrink-0">
          <button
            onClick={() => handleExecuteTrade(tradeMode, tradeAmount, currentToken)}
            className={`w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all active:scale-95 shadow-lg ${
              userSolBalance > 0 
                ? 'bg-[#089981] hover:bg-[#07957e] text-white' 
                : 'bg-[#089981] hover:bg-[#07957e] text-black font-extrabold'
            }`}
          >
            {userSolBalance > 0 ? `${tradeMode} ${currentToken.symbol}` : 'Add SOL for fees'}
          </button>
          
          <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2 px-1">
            <span>$0 fee</span>
            <button className="hover:text-zinc-300">Details ▾</button>
          </div>
        </div>

      </div>

    </div>
  );
}