import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

import idl from '../idl/idl.json';
import '@solana/wallet-adapter-react-ui/styles.css';

// 🚀 SAFELY RESOLVE PROGRAM ID TO PREVENT CRASHES IN VERCEL / PRODUCTION
const getProgramId = () => {
  const envId = import.meta.env.VITE_PROGRAM_ID;
  const fallbackId = '4vLUMypMsazY7Xsm56Q1h5wbkT1EBFuvevtmE77SYbfJ';
  try {
    return new PublicKey(envId && envId.trim() !== '' ? envId : fallbackId);
  } catch (e) {
    console.warn("Invalid VITE_PROGRAM_ID provided, falling back to default program ID.");
    return new PublicKey(fallbackId);
  }
};

const PROGRAM_ID = getProgramId();

export default function SolanaProvider({ children }) {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    return 'https://api.devnet.solana.com';
  }, []);

  // 🚀 Standard Wallet Adapter auto-detects Phantom, Solflare, Coinbase, etc.
  // Leaving this empty resolves the standard wallet registration warning.
  const wallets = useMemo(() => [], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// 🚀 DEBUG-READY ANCHOR PROGRAM HOOK
export const useApexForgeProgram = () => {
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet || !wallet.publicKey) {
      console.log("Anchor Hook: Wallet not connected yet.");
      return null;
    }

    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'confirmed',
      });

      console.log("Initializing Program with IDL:", idl?.name || "IDL loaded", "and PROGRAM_ID:", PROGRAM_ID.toBase58());

      // Attempt instantiation
      try {
        return new Program(idl, provider);
      } catch (v30Err) {
        console.warn("v0.30 syntax failed, trying legacy constructor syntax...", v30Err);
        return new Program(idl, PROGRAM_ID, provider);
      }

    } catch (err) {
      console.error("🔴 CRITICAL: Failed to construct Anchor Program instance:", err);
      return null;
    }
  }, [wallet]);
};