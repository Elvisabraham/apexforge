import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

import idl from '../idl/idl.json';
import '@solana/wallet-adapter-react-ui/styles.css';

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

// 🚀 ANCHOR PROGRAM HOOK (COMPATIBLE WITH SOLANA PLAYGROUND IDLs)
export const useApexForgeProgram = () => {
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet || !wallet.publicKey) return null;

    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'confirmed',
      });

      const rawProgramId = import.meta.env.VITE_PROGRAM_ID || FALLBACK_PROGRAM_ID;
      const programId = new PublicKey(rawProgramId.trim());

      // Format IDL to ensure program ID and accounts map cleanly
      const normalizedIdl = {
        ...idl,
        address: programId.toBase58(),
        metadata: {
          address: programId.toBase58(),
          ...(idl.metadata || {})
        }
      };

      console.log("⚡ Anchor Program Context Initialized:", programId.toBase58());

      // Fallback constructor strategy to bridge version mismatches
      try {
        return new Program(normalizedIdl, provider);
      } catch (e1) {
        return new Program(normalizedIdl, programId, provider);
      }

    } catch (err) {
      console.error("🔴 Anchor Provider Error:", err);
      return null;
    }
  }, [wallet]);
};