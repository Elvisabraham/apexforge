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

      // 1. Verify the Mint Address was passed from the UI
      if (!tokenMint || typeof tokenMint !== 'string' || tokenMint.length < 30) {
        alert("⚠️ Trade Failed: Invalid or missing token mint address.");
        setIsProcessing(false);
        return false;
      }

      const mintPubkey = new PublicKey(tokenMint.trim());

      // 2. Derive the unique Bonding Curve PDA
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintPubkey.toBuffer()],
        programId
      );

      const amountInLamports = new BN(Math.floor(parseFloat(amount) * 1e9));
      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      if (mode === 'buy') {
        // 3. Execute the transaction passing ALL required accounts
        const tx = await program.methods
          .buyTokens(amountInLamports)
          .accounts({
            bondingCurve: bondingCurvePDA,
            mint: mintPubkey, // 🟢 CRITICAL FIX: The contract now receives the token address!
            buyer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        console.log("✅ Buy Successful! Signature:", tx);
        alert(`🚀 Trade Successful! Tx: ${tx}`);
      } else {
        alert("⚠️ Sell logic coming soon!");
      }

      setIsProcessing(false);
      return true;

    } catch (err) {
      console.error("🔴 Trade Failed:", err);

      if (err.message && err.message.includes("AccountNotInitialized")) {
        alert("⚠️ Trade Failed: This token's bonding curve has not been launched on the blockchain yet!");
      } else {
        alert(`Trade Failed: ${err?.message || "Check the console for details!"}`);
      }

      setIsProcessing(false);
      return false;
    }
  };

  return { executeTradeOnChain, isProcessing };
};