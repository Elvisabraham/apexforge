import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

import idl from '../idl/idl.json';
import '@solana/wallet-adapter-react-ui/styles.css';

// Fallback constant string
const FALLBACK_PROGRAM_ID = '4vLUMypMsazY7Xsm56Q1h5wbkT1EBFuvevtmE77SYbfJ';

export default function SolanaProvider({ children }) {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    return 'https://api.devnet.solana.com';
  }, []);

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

// 🚀 CRASH-PROOF ANCHOR PROGRAM HOOK
export const useApexForgeProgram = () => {
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet || !wallet.publicKey) return null;

    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'confirmed',
      });

      // 1. SAFELY RESOLVE PROGRAM ID INSIDE HOOK
      const rawProgramId = import.meta.env.VITE_PROGRAM_ID || idl?.address || FALLBACK_PROGRAM_ID;
      const programId = new PublicKey(rawProgramId.trim());

      console.log("Initializing Anchor Program with ID:", programId.toBase58());

      // 2. CONSTRUCT PROGRAM
      try {
        return new Program(idl, provider);
      } catch (v30Err) {
        return new Program(idl, programId, provider);
      }

    } catch (err) {
      console.error("🔴 CRITICAL: Failed to construct Anchor Program instance:", err);
      return null;
    }
  }, [wallet]);
};