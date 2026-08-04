import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BN, Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl/idl.json'; // 🚀 Reading the clean IDL directly!

export const useTrade = () => {
  const wallet = useWallet();
  const { connection } = useConnection(); // Grabs the live network connection
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTradeOnChain = async (mode, amount, tokenMint) => {
    // 1. Check if Phantom is missing
    if (!wallet.publicKey) {
      alert("❌ Wallet not connected! Please connect Phantom.");
      return false;
    }

    setIsProcessing(true);
    
    try {
      // 🚀 THE ULTIMATE FIX: Build the contract instantly on click!
      // This completely bypasses the React "null" race condition.
      const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
      const program = new Program(idl, provider);

      const amountInLamports = new BN(parseFloat(amount) * 1e9);
      
      // Fallback placeholder just in case tokenMint isn't loaded yet
      const mintPubkey = new PublicKey(tokenMint || "11111111111111111111111111111111");
      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      if (mode === 'buy') {
        // 🚀 SMART CONTRACT BUY LOGIC
        const tx = await program.methods
          .buyTokens(amountInLamports)
          .accounts({
            // MATCHING THE EXACT 4 ACCOUNTS FROM OUR NEW IDL!
            bondingCurve: mintPubkey, // (Placeholder until PDA seed logic is added)
            buyer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();
        
        console.log("✅ Buy Successful! Signature:", tx);
        alert("Transaction Sent! Check console for signature.");
      } else {
        // We removed sell_tokens from the 52-line IDL to keep it clean, 
        // so we will just alert here until you write the Sell smart contract!
        alert("⚠️ Sell logic coming soon! Smart contract currently only supports Buy.");
      }

      setIsProcessing(false);
      return true; 

    } catch (err) {
      console.error("🔴 Trade Failed:", err);
      alert("Trade Failed: Check the console for details!");
      setIsProcessing(false);
      return false; 
    }
  };

  return { executeTradeOnChain, isProcessing };
};