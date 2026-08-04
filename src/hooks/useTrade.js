import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BN, Program, AnchorProvider } from '@coral-xyz/anchor';
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
      
      // 🚀 THE FIX: Explicitly define the Program ID and pass all THREE arguments!
      const programId = new PublicKey(idl.address || "zVUrGLVA9VYEGAaBexZfaNCiB6zTVtn61kDRfcRwYsc");
      const program = new Program(idl, programId, provider);

      const amountInLamports = new BN(parseFloat(amount) * 1e9);
      
      // Fallback placeholder just in case tokenMint isn't passed in properly yet
      const mintPubkey = new PublicKey(tokenMint || "11111111111111111111111111111111");
      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      if (mode === 'buy') {
        // 🚀 SMART CONTRACT BUY LOGIC
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