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
      
      const programId = new PublicKey(idl.address || "zVUrGLVA9VYEGAaBexZfaNCiB6zTVtn61kDRfcRwYsc");
      const program = new Program(idl, programId, provider);

      const amountInLamports = new BN(Math.floor(parseFloat(amount) * 1e9));
      
      // Parse Mint Address
      let mintPubkey;
      try {
        const safeMintString = (tokenMint && typeof tokenMint === 'string' && tokenMint.length > 30) 
          ? tokenMint 
          : "11111111111111111111111111111111"; 
        mintPubkey = new PublicKey(safeMintString);
      } catch (keyError) {
        console.error("🔴 INVALID TOKEN ADDRESS:", tokenMint);
        alert("Trade Failed: Invalid token mint address.");
        setIsProcessing(false);
        return false;
      }

      // 🚀 DERIVE THE BONDING CURVE PDA FROM THE SEEDS
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintPubkey.toBuffer()],
        programId
      );

      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      if (mode === 'buy') {
        const tx = await program.methods
          .buyTokens(amountInLamports)
          .accounts({
            bondingCurve: bondingCurvePDA, // 🟢 Passed correct PDA
            buyer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();
        
        console.log("✅ Buy Successful! Signature:", tx);
        alert("Transaction Successful!");
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