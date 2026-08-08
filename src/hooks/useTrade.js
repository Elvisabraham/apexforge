import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BN, Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'; // 🟢 Added SPL import
import idl from '../idl/idl.json';

export const useTrade = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTradeOnChain = async (mode, amount, tokenMint, creatorAddress = null, referrerAddress = null) => {
    if (!wallet.publicKey) {
      alert("❌ Wallet not connected! Please connect Phantom.");
      return false;
    }

    setIsProcessing(true);

    try {
      const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
      setProvider(provider);

      const programID = new PublicKey("cbVU2Yavor2XCxK8bnXoLjd1Lw11JngQAnkKjTu9PL3");
      const program = new Program(idl, programID, provider);

      // --- SETUP V2 ACCOUNTS ---
      // For Devnet testing, missing targets route fees to your own wallet
      const APEX_TREASURY = wallet.publicKey; 
      const TOKEN_CREATOR = creatorAddress ? new PublicKey(creatorAddress) : wallet.publicKey;
      const REFERRER = referrerAddress ? new PublicKey(referrerAddress) : wallet.publicKey;
      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      if (!tokenMint || typeof tokenMint !== 'string' || tokenMint.length < 30) {
        alert("⚠️ Trade Failed: Invalid or missing token mint address.");
        setIsProcessing(false);
        return false;
      }

      if (tokenMint.includes('8AVmX9aQwZoonSolanaNet11oHEZforge')) {
        alert("⚠️ UI Error: The app is still trying to trade the fake placeholder address! Let the database sync.");
        setIsProcessing(false);
        return false;
      }

      const mintPubkey = new PublicKey(tokenMint.trim());

      const accountCheck = await provider.connection.getAccountInfo(mintPubkey, 'confirmed');
      
      if (!accountCheck) {
        alert("⚠️ Devnet Lag: The blockchain successfully created your token, but hasn't synced it yet! Please wait 15 seconds.");
        setIsProcessing(false);
        return false;
      }
      
      if (accountCheck.owner.toBase58() === '11111111111111111111111111111111') {
        alert("⚠️ Launch Error: The token was saved to the database, but the blockchain rejected the mint.");
        setIsProcessing(false);
        return false;
      }

      // 2. Derive the unique Bonding Curve PDA
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintPubkey.toBuffer()],
        programID 
      );

      // 3. Derive User's Associated Token Account (ATA)
      const userTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        wallet.publicKey
      );

      const transaction = new Transaction();

      if (mode === 'buy') {
        // Amount is in SOL (9 decimals) - 🚀 FIX: Strip commas before parsing
        const amountInLamports = new BN(Math.floor(parseFloat(amount.toString().replace(/,/g, '')) * 1e9));
        
        const buyIx = await program.methods
          .buyTokens(amountInLamports)
          .accounts({
            bondingCurve: bondingCurvePDA,
            mint: mintPubkey,
            buyerTokenAccount: userTokenAccount,
            buyer: wallet.publicKey,
            apexTreasury: APEX_TREASURY,
            tokenCreator: TOKEN_CREATOR,
            referrer: REFERRER,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .instruction();
        
        transaction.add(buyIx);

      } else if (mode === 'sell') {
        // Amount is in Tokens (6 decimals) - 🚀 FIX: Strip commas before parsing
        const tokenAmountRaw = new BN(Math.floor(parseFloat(amount.toString().replace(/,/g, '')) * 1_000_000));
        
        const sellIx = await program.methods
          .sellTokens(tokenAmountRaw)
          .accounts({
            bondingCurve: bondingCurvePDA,
            mint: mintPubkey,
            sellerTokenAccount: userTokenAccount,
            seller: wallet.publicKey,
            apexTreasury: APEX_TREASURY,
            tokenCreator: TOKEN_CREATOR,
            referrer: REFERRER,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .instruction();

        transaction.add(sellIx);
      }

      // 4. BUNDLE AND SEND (Wait for real confirmation!)
      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTx = await provider.wallet.signTransaction(transaction);
      
      const tx = await connection.sendRawTransaction(signedTx.serialize()); 

      console.log("⏳ Waiting for Solana to confirm trade...");
      
      // Force React to wait for the official blockchain receipt
      const confirmation = await connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error("Transaction rejected by the blockchain (Insufficient funds or liquidity).");
      }

      console.log(`🚀 ${mode.toUpperCase()} Successful! Signature:`, tx);
      alert(`🚀 Trade Successful! Tx: ${tx}`);
      
      setIsProcessing(false);
      return true;

   } catch (err) {
      console.error("🔴 Trade Failed:", err);
      const errMsg = err?.message || "";

      // 1. Check if the user is trying to sell without owning an account
      if (errMsg.includes("seller_token_account") && errMsg.includes("AccountNotInitialized")) {
        alert("⚠️ Trade Blocked: You cannot sell a token you don't own! (0 Balance)");
      } 
      // 2. Check if the curve itself is missing
      else if (errMsg.includes("AccountNotInitialized")) {
        alert("⚠️ Trade Failed: This token's bonding curve has not been launched on the blockchain yet!");
      } 
      // 3. Any other errors (like Insufficient Liquidity)
      else {
        alert(`Trade Failed: Check the console for details. (Error: ${errMsg})`);
      }

      setIsProcessing(false);
      return false;
    }
  };

  return { executeTradeOnChain, isProcessing };
};