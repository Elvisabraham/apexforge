import React, { useState, useRef, useEffect } from 'react';

export default function WalletProfileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile States
  const [username, setUsername] = useState('ElvisAI');
  const [userTag, setUserTag] = useState('sijwjiwuhaa');
  const [bio, setBio] = useState('Web3 builder & Solana Degen 🚀');
  const [twitter, setTwitter] = useState('@CryptoElvis');
  const [telegram, setTelegram] = useState('@elvis_dev');
  const [savedToast, setSavedToast] = useState(false);

  const [activeAccount, setActiveAccount] = useState({
    name: 'ElvisAI',
    address: '43pU..q2HR',
    balance: '90.19 SOL',
    fiat: '$45,702.07'
  });

  const [burnerAccounts, setBurnerAccounts] = useState([
    { name: 'Burner Degen #1', address: '9xK2..8fy1', balance: '4.2 SOL', fiat: '$1,240.50', isBurner: true },
    { name: 'Burner #2', address: 'y561..5F', balance: '0.0 SOL', fiat: '$0.00', isBurner: true },
  ]);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = (acc) => {
    const previousActive = activeAccount;
    setActiveAccount(acc);
    setBurnerAccounts(prev => [
      ...prev.filter(a => a.address !== acc.address),
      { name: previousActive.name, address: previousActive.address, balance: previousActive.balance, fiat: previousActive.fiat, isBurner: true }
    ]);
    setIsOpen(false);
  };

  const createNewBurner = () => {
    const newBurner = {
      name: `Burner #${burnerAccounts.length + 2}`,
      address: `${Math.random().toString(36).substring(2, 6)}..${Math.random().toString(36).substring(2, 4)}`,
      balance: '0.0 SOL',
      fiat: '$0.00',
      isBurner: true
    };
    setBurnerAccounts(prev => [...prev, newBurner]);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setActiveAccount(prev => ({ ...prev, name: username }));
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setIsEditing(false);
    }, 1200);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Trigger Pill - Connected Wallet text hidden */}
      <button 
        onClick={() => { setIsOpen(!isOpen); setIsEditing(false); }}
        className="flex items-center gap-3 bg-[#111318] hover:bg-[#151820] border border-white/10 hover:border-[#089981]/50 px-3.5 py-2 rounded-xl transition-all group cursor-pointer text-left shadow-lg"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#089981] to-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-[0_0_12px_rgba(8,153,129,0.4)]">
          {username[0]}
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
            @{username}
          </span>
          {userTag && (
            <span className="text-[10px] text-zinc-400 font-sans tabular-nums">
              {userTag}
            </span>
          )}
        </div>

        <svg className={`w-3.5 h-3.5 text-zinc-400 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[#090A0D] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-2.5 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          
          {!isEditing ? (
            <>
              {/* Wallet Accounts Header */}
              <div className="flex items-center justify-between px-1 py-0.5 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Wallet Accounts ({burnerAccounts.length + 1})
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Active Session
                </span>
              </div>

              {/* Active Account Display */}
              <div className="p-2.5 bg-[#111318] border border-[#089981]/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#089981]/20 border border-[#089981] flex items-center justify-center font-bold text-[#089981] text-xs">
                    {username[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">
                      @{username} {userTag && <span className="text-zinc-400 text-[9px]">{userTag}</span>}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-sans tabular-nums">{activeAccount.address}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold font-sans tabular-nums text-emerald-400">{activeAccount.balance}</span>
                  <span className="text-[9px] text-zinc-500 font-sans tabular-nums">{activeAccount.fiat}</span>
                </div>
              </div>

              {/* Burner Accounts List */}
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-zinc-800">
                {burnerAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSwitch(acc)}
                    className="w-full p-2 bg-[#111318]/60 hover:bg-[#151820] border border-white/5 hover:border-white/15 rounded-xl flex items-center justify-between transition-all text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-zinc-400 text-[10px] group-hover:text-white">
                        {acc.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white">{acc.name}</span>
                          <span className="text-[7px] font-black uppercase bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30">
                            Burner
                          </span>
                        </div>
                        <span className="text-[8px] text-zinc-500 font-sans tabular-nums">{acc.address}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-sans tabular-nums font-bold text-zinc-200">{acc.balance}</span>
                      <span className="text-[8px] text-zinc-500 font-sans tabular-nums">{acc.fiat}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create Burner Button */}
              <button
                onClick={createNewBurner}
                className="w-full py-2 bg-[#121419] hover:bg-[#181b22] border border-dashed border-white/15 hover:border-[#089981] rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-300 hover:text-emerald-400 transition-all flex items-center justify-center gap-1"
              >
                + Create New Burner Account
              </button>

              {/* Edit Profile Trigger */}
              <div className="pt-1.5 border-t border-white/10">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 bg-gradient-to-r from-[#089981]/20 to-transparent hover:from-[#089981]/30 border border-[#089981]/40 hover:border-[#089981] rounded-xl text-[10px] font-black uppercase tracking-wider text-emerald-400 transition-all flex items-center justify-center gap-1.5"
                >
                  ✏️ Edit Profile & Socials
                </button>
              </div>
            </>
          ) : (
            /* Edit Profile Form View */
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Edit Profile & Socials
                </span>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="text-[10px] text-zinc-400 hover:text-white"
                >
                  ✕ Back
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#089981]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Tag / Handle Suffix</label>
                <input 
                  type="text" 
                  value={userTag} 
                  onChange={(e) => setUserTag(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#089981]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Bio</label>
                <input 
                  type="text" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#089981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase">Twitter / X</label>
                  <input 
                    type="text" 
                    value={twitter} 
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-[#111318] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#089981]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase">Telegram</label>
                  <input 
                    type="text" 
                    value={telegram} 
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full bg-[#111318] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#089981]"
                  />
                </div>
              </div>

              {savedToast ? (
                <div className="w-full py-1.5 bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-center text-[10px] font-bold rounded-lg animate-pulse">
                  ✓ Profile Updated Successfully!
                </div>
              ) : (
                <button 
                  type="submit"
                  className="w-full py-2 bg-[#089981] hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(8,153,129,0.4)] mt-1"
                >
                  Save Changes
                </button>
              )}
            </form>
          )}

        </div>
      )}
    </div>
  );
}