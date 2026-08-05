import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
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

      const programId = new PublicKey(idl.address || "zVUrGLVA9VYEGAaBexZfaNCiB6zTVtn61kDRfcRwYsc");
      const program = new Program(idl, programId, provider);

      // 1. Generate Keypair & Derive PDA
      const mintKeypair = Keypair.generate();
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintKeypair.publicKey.toBuffer()],
        programId
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

      // 3. Send the Transaction with Pre-Instructions
      const tx = await program.methods
        .createToken(name, symbol, uri)
        .accounts({
          bondingCurve: bondingCurvePDA,
          mint: mintKeypair.publicKey,
          creator: wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .preInstructions([createMintAccountIx, initializeMintIx]) // 🟢 Added missing initialization!
        .signers([mintKeypair])
        .rpc();

      console.log("✅ Token Launched! Signature:", tx);
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