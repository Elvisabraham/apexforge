import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { useApexForgeProgram } from '../components/SolanaProvider'; // Adjust path if needed

export const useTrade = () => {
  const { publicKey } = useWallet();
  const program = useApexForgeProgram();
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTradeOnChain = async (mode, amount, tokenMint) => {
    // 1. Check if wallet is missing
    if (!publicKey) {
      alert("❌ Wallet not connected! Please connect Phantom.");
      return false;
    }

    // 2. Check if Smart Contract is missing
    if (!program) {
      alert("⚠️ Wallet IS connected, but the Smart Contract failed to load! We need to wire the IDL.");
      return false;
    }

    setIsProcessing(true);
    
    try {
      const amountInLamports = new BN(parseFloat(amount) * 1e9);

      if (mode === 'buy') {
        // 🚀 YOUR SMART CONTRACT BUY LOGIC GOES HERE
        const tx = await program.methods
          .buyTokens(amountInLamports) // Match your IDL method name
          .accounts({
            user: publicKey,
            // mint: tokenMint,
          })
          .rpc();
        
        console.log("Buy Successful! Signature:", tx);
      } else {
        // 🚀 YOUR SMART CONTRACT SELL LOGIC GOES HERE
        const tx = await program.methods
          .sellTokens(amountInLamports) // Match your IDL method name
          .accounts({
            user: publicKey,
            // mint: tokenMint,
          })
          .rpc();
          
        console.log("Sell Successful! Signature:", tx);
      }

      setIsProcessing(false);
      return true; 

    } catch (err) {
      console.error("Trade Failed:", err);
      setIsProcessing(false);
      return false; 
    }
  };

  return { executeTradeOnChain, isProcessing };
};