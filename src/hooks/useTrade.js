import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { useApexForgeProgram } from '../components/SolanaProvider'; // Adjust path if needed

export const useTrade = () => {
  const { publicKey } = useWallet();
  const program = useApexForgeProgram();
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTradeOnChain = async (mode, amount, tokenMint) => {
    if (!program || !publicKey) {
      alert("Please connect your wallet first!");
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
      return true; // Returns true if trade succeeds

    } catch (err) {
      console.error("Trade Failed:", err);
      setIsProcessing(false);
      return false; // Returns false if user rejects or trade fails
    }
  };

  return { executeTradeOnChain, isProcessing };
};