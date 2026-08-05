import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BN, Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl/idl.json'; 

export const useTrade = () => {
  const wallet = useWallet();
  const { connection } = useConnection(); 
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTradeOnChain = async (mode, amount, tokenMint) => {
    if (!wallet.publicKey) {
      alert("❌ Wallet not connected! Please connect Phantom.");
      return false;
    }

    setIsProcessing(true);
    
    try {
      const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
      setProvider(provider); 
      
      // 🚀 STRICT 2-ARGUMENT SETUP
      const program = new Program(idl, provider);

      const amountInLamports = new BN(Math.floor(parseFloat(amount) * 1e9));
      
      let mintPubkey;
      try {
        const safeMintString = (tokenMint && typeof tokenMint === 'string' && tokenMint.length > 30) 
          ? tokenMint 
          : "11111111111111111111111111111111"; 
        mintPubkey = new PublicKey(safeMintString);
      } catch (keyError) {
        console.error("🔴 INVALID TOKEN ADDRESS:", tokenMint);
        alert("Trade Failed: The UI passed an invalid token address string.");
        setIsProcessing(false);
        return false;
      }

      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      if (mode === 'buy') {
        const tx = await program.methods
          .buyTokens(amountInLamports)
          .accounts({
            bondingCurve: mintPubkey, 
            buyer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();
        
        console.log("✅ Buy Successful! Signature:", tx);
        alert("Transaction Sent! Check console for signature.");
      } else {
        alert("⚠️ Sell logic coming soon!");
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