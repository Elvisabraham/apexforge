import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { BN, Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import idl from '../idl/idl.json';
import { supabase } from '../supabaseClient';

export const useTrade = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTradeOnChain = async (mode, amount, tokenMint, creatorAddress = null, referrerAddress = null, isGraduated = false, currentSolInCurve = 0) => {
    if (!wallet.publicKey) {
      alert("❌ Wallet not connected! Please connect Phantom.");
      return false;
    }

    setIsProcessing(true);

    // ==========================================
    // 🚀 THE BRIDGE: Intercept graduated tokens and route to DEX
    // ==========================================
    if (isGraduated) {
      console.log(`⚡ Token ${tokenMint} is graduated. Routing to Jupiter DEX...`);
      alert("⚡ Token is graduated! On Mainnet, this will swap via Jupiter Liquidity Pools.");
      setIsProcessing(false);
      return false; 
    }

    // ==========================================
    // 🏦 STANDARD BONDING CURVE LOGIC (Pre-Graduation)
    // ==========================================
    try {
      const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
      setProvider(provider);

      const programID = new PublicKey("cbVU2Yavor2XCxK8bnXoLjd1Lw11JngQAnkKjTu9PL3");
      const program = new Program(idl, programID, provider);

      // --- SETUP V2 ACCOUNTS ---
      const APEX_TREASURY = wallet.publicKey; 
      const TOKEN_CREATOR = creatorAddress ? new PublicKey(creatorAddress) : wallet.publicKey;
      const REFERRER = referrerAddress ? new PublicKey(referrerAddress) : wallet.publicKey;
      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      if (!tokenMint || typeof tokenMint !== 'string' || tokenMint.length < 30) {
        alert("⚠️ Trade Failed: Invalid or missing token mint address.");
        setIsProcessing(false);
        return false;
      }

      const mintPubkey = new PublicKey(tokenMint.trim());
      const accountCheck = await provider.connection.getAccountInfo(mintPubkey, 'confirmed');
      
      if (!accountCheck) {
        alert("⚠️ Chain Lag: Token mint not confirmed yet. Please wait a few seconds.");
        setIsProcessing(false);
        return false;
      }

      // 1. Derive Bonding Curve PDA
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintPubkey.toBuffer()],
        programID 
      );

      // 2. Derive User ATA
      const userTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        wallet.publicKey
      );

      const transaction = new Transaction();
      const parsedAmount = parseFloat(amount.toString().replace(/,/g, ''));

      if (mode === 'buy') {
        const amountInLamports = new BN(Math.floor(parsedAmount * 1e9));
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
        const tokenAmountRaw = new BN(Math.floor(parsedAmount * 1_000_000));
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

      // 3. SEND TRANSACTION
      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTx = await provider.wallet.signTransaction(transaction);
      const tx = await connection.sendRawTransaction(signedTx.serialize()); 

      console.log("⏳ Waiting for confirmation on Solana:", tx);
      
      const confirmation = await connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error("Transaction rejected by the blockchain.");
      }

      console.log(`🚀 ${mode.toUpperCase()} Confirmed! Sig:`, tx);

      // =====================================================================
      // 🚀 4. INJECT INTO SUPABASE TRADES TABLE (TRIGGERS LIVE CHART)
      // =====================================================================
      const solPriceUsd = 140.0; // Current reference SOL price
      const vSol = 30 + (currentSolInCurve || 0);
      const vTokens = (30 * 1000000000) / vSol;
      const priceInSol = vSol / vTokens;
      const priceInUsd = priceInSol * solPriceUsd;

      const tradeSolAmount = mode === 'buy' ? parsedAmount : (parsedAmount * priceInSol);

      // Insert record into trades to fire the real-time WebSocket
      await supabase.from('trades').insert([{
        token_mint: tokenMint,
        maker: wallet.publicKey.toString(),
        type: mode,
        sol_amount: tradeSolAmount,
        price: priceInUsd,
        tx_signature: tx,
        created_at: new Date().toISOString()
      }]);

      // Update 24h volume on the token summary
      const { data: tokenData } = await supabase
        .from('tokens')
        .select('volume_24h')
        .eq('mint_address', tokenMint)
        .single();

      if (tokenData) {
        await supabase
          .from('tokens')
          .update({ volume_24h: (tokenData.volume_24h || 0) + (tradeSolAmount * solPriceUsd) })
          .eq('mint_address', tokenMint);
      }

      alert(`🚀 Trade Confirmed! Tx: ${tx.slice(0, 8)}...`);
      setIsProcessing(false);
      return true;

    } catch (err) {
      console.error("🔴 Trade Failed:", err);
      const errMsg = err?.message || "";

      if (errMsg.includes("seller_token_account") && errMsg.includes("AccountNotInitialized")) {
        alert("⚠️ Trade Blocked: You cannot sell a token you don't own! (0 Balance)");
      } else if (errMsg.includes("AccountNotInitialized")) {
        alert("⚠️ Trade Failed: Bonding curve not initialized on-chain yet.");
      } else {
        alert(`Trade Failed: ${errMsg || "Check console"}`);
      }

      setIsProcessing(false);
      return false;
    }
  };

  return { executeTradeOnChain, isProcessing };
};