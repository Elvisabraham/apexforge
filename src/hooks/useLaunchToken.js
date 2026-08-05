import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
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

      // 1. Generate a brand new Keypair for the Token Mint
      const mintKeypair = Keypair.generate();

      // 2. Derive the Bonding Curve PDA exactly like the smart contract expects
      const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding_curve"), mintKeypair.publicKey.toBuffer()],
        programId
      );

      const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

      // 3. Send the Create Token Transaction to the blockchain
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
        .signers([mintKeypair])
        .rpc();

      console.log("✅ Token Launched! Signature:", tx);
      console.log("🪙 New Mint Address:", mintKeypair.publicKey.toString());
      
      setIsLaunching(false);
      // Return the new mint address so your UI can save it
      return mintKeypair.publicKey.toString();

    } catch (err) {
      console.error("🔴 Launch Failed:", err);
      alert("Token Launch Failed: Check the console for details!");
      setIsLaunching(false);
      return null;
    }
  };

  return { executeLaunchOnChain, isLaunching };
};