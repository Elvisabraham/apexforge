import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import { createInitializeMint2Instruction, MINT_SIZE } from '@solana/spl-token';
import idl from '../idl/idl.json';

export const useLaunchToken = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isLaunching, setIsLaunching] = useState(false);

  const executeLaunchOnChain = async (rawName, rawSymbol, rawUri) => {
    if (!wallet.publicKey) {
      alert("❌ Wallet not connected! Please connect Phantom.");
      return null;
    }

    // 🟢 1. SANITIZE & TRUNCATE INPUTS (Prevents Buffer Overrun Errors)
    const cleanName = (rawName || '').trim().slice(0, 32);
    const cleanSymbol = (rawSymbol || '').trim().toUpperCase().slice(0, 10);
    
    // Ensure URI is a valid short link, not a base64 data string
    let cleanUri = (rawUri || '').trim();
    if (cleanUri.startsWith('data:') || cleanUri.length > 200) {
      console.warn("⚠️ Data URL or oversized URI detected. Falling back to placeholder URI.");
      cleanUri = 'https://arweave.net/placeholder';
    }

    setIsLaunching(true);

    try {
      const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
      setProvider(provider);

      const programID = new PublicKey("cbVU2Yavor2XCxK8bnXoLjd1Lw11JngQAnkKjTu9PL3");
      const program = new Program(idl, programID, provider);

      // 2. Generate Keypair & Derive PDA
      const mintKeypair = Keypair.generate();
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintKeypair.publicKey.toBuffer()],
        programID
      );

      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      // 3. Prepare Mint Account
      const mintRent = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
      
      const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports: mintRent,
        programId: TOKEN_PROGRAM_ID,
      });

      const initializeMintIx = createInitializeMint2Instruction(
        mintKeypair.publicKey,
        6,
        bondingCurvePDA,
        null,
        TOKEN_PROGRAM_ID
      );
      
      // 4. Build Anchor Instruction using Cleaned Strings
      const createTokenIx = await program.methods
        .createToken(cleanName, cleanSymbol, cleanUri)
        .accounts({
          bondingCurve: bondingCurvePDA,
          mint: mintKeypair.publicKey,
          creator: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .instruction();

      // 5. Bundle Transaction
      const transaction = new Transaction().add(
        createMintAccountIx,
        initializeMintIx,
        createTokenIx
      );

      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      // 6. Sign with Mint Keypair & Prompt Phantom
      const txSignature = await wallet.sendTransaction(transaction, connection, {
        signers: [mintKeypair] 
      });

      console.log("⏳ Waiting for Solana transaction confirmation...");
      
      const confirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        console.error("🔴 ON-CHAIN ERROR:", confirmation.value.err);
        alert("Launch Failed on the blockchain! Check your console.");
        setIsLaunching(false);
        return null;
      }

      console.log("✅ Token Live On-Chain! Signature:", txSignature);
      setIsLaunching(false);
      return mintKeypair.publicKey.toString();

    } catch (err) {
      console.error("🔴 Launch Failed:", err);
      alert(`Token Launch Failed: ${err?.message || "Check console details!"}`);
      setIsLaunching(false);
      return null;
    }
  };

  return { executeLaunchOnChain, isLaunching };
};