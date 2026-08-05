import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BN, Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
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

// 🚀 THE SAFETY TRIPWIRE
if (tokenMint.includes('8AVmX9aQwZoonSolanaNet11oHEZforge')) {
  alert("⚠️ UI Error: The app is still trying to trade the fake placeholder address! Let the database sync.");
  setIsProcessing(false);
  return false;
}

console.log("🔍 ATTEMPTING TO TRADE EXACT ADDRESS:", tokenMint);
      const mintPubkey = new PublicKey(tokenMint.trim());

      // 🚀 DEVNET SYNC TRIPWIRE
      console.log("🔍 Checking if Devnet has synced your new token...");
      const accountCheck = await provider.connection.getAccountInfo(mintPubkey, 'confirmed');
      
      if (!accountCheck) {
        alert("⚠️ Devnet Lag: The blockchain successfully created your token, but the network hasn't synced it yet! Please wait 15 seconds and try clicking Buy again.");
        setIsProcessing(false);
        return false;
      }
      
      if (accountCheck.owner.toBase58() === '11111111111111111111111111111111') {
        alert("⚠️ Launch Error: The token was saved to the database, but the blockchain rejected the mint. Please forge a new token.");
        setIsProcessing(false);
        return false;
      }

      // 2. Derive the unique Bonding Curve PDA
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintPubkey.toBuffer()],
        programId
      );

      const amountInLamports = new BN(Math.floor(parseFloat(amount) * 1e9));
      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

     if (mode === 'buy') {
        // 3. GET THE RAW INSTRUCTION (Bypasses Anchor's .rpc wrapper)
        const buyIx = await program.methods
          .buyTokens(amountInLamports)
          .accounts({
            bondingCurve: bondingCurvePDA,
            mint: mintPubkey, // 🟢 CRITICAL FIX: The contract now receives the real token address!
            buyer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .instruction();

        // 4. BUNDLE MANUALLY
        const transaction = new Transaction().add(buyIx);
        const latestBlockhash = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = wallet.publicKey;

       // 5. SIGN AND SEND WITH RAW BYTES (Bypasses Phantom simulation lag)
      const signedTx = await provider.wallet.signTransaction(transaction);
      const tx = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true
      });

      console.log("🚀 Buy Successful! Signature:", tx);
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