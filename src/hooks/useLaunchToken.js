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

  const executeLaunchOnChain = async (name, symbol, uri) => {
    if (!wallet.publicKey) {
      alert("❌ Wallet not connected! Please connect Phantom.");
      return null;
    }

    setIsLaunching(true);

    try {
      const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
      setProvider(provider);

      // 🟢 FIXED: Using the live Apex Forge V2 Program ID
      const programID = new PublicKey("cbVU2Yavor2XCxK8bnXoLjd1Lw11JngQAnkKjTu9PL3");
      const program = new Program(idl, programID, provider);

      // 1. Generate Keypair & Derive PDA
      const mintKeypair = Keypair.generate();
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintKeypair.publicKey.toBuffer()],
        programID // 🟢 Updated to match the new variable name
      );

      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      // 2. 🚀 PREPARE THE MINT ACCOUNT (This fixes the AccountNotInitialized error!)
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
        6, // Decimals
        wallet.publicKey, // Mint Authority
        null, // Freeze Authority
        TOKEN_PROGRAM_ID
      );

      // 3. GET THE RAW INSTRUCTION (Instead of using Anchor's buggy .rpc)
      const createTokenIx = await program.methods
        .createToken(name, symbol, uri)
        .accounts({
          bondingCurve: bondingCurvePDA,
          mint: mintKeypair.publicKey,
          creator: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .instruction(); // 🚀 THIS IS THE KEY! We grab the instruction instead of firing it.

      // 4. BUNDLE EVERYTHING MANUALLY (The Bulletproof Way)
      const transaction = new Transaction().add(
        createMintAccountIx,
        initializeMintIx,
        createTokenIx
      );

      // Get the latest blockhash to validate the transaction
      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      // 5. FIRE OFF TO PHANTOM & AWAIT BLOCKCHAIN VERDICT
      const txSignature = await wallet.sendTransaction(transaction, connection, {
        signers: [mintKeypair] 
      });

      console.log("⏳ Waiting for Solana to confirm transaction...");
      
      const confirmation = await connection.confirmTransaction({
        signature: txSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');

      if (confirmation.value.err) {
        console.error("🔴 ON-CHAIN ERROR:", confirmation.value.err);
        alert("Launch Failed on the blockchain! Check your console for details.");
        setIsLaunching(false);
        return null; // Stops the dead token from saving to your database!
      }

      console.log("✅ Token Officially Live on Solana! Signature:", txSignature);
      setIsLaunching(false);
      return mintKeypair.publicKey.toString();

    } catch (err) {
      console.error("🔴 Launch Failed:", err);
      alert(`Token Launch Failed: ${err?.message || "Check the console for details!"}`);
      setIsLaunching(false);
      return null;
    }
  };

  return { executeLaunchOnChain, isLaunching };
};