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

// 🚀 CRASH-PROOF ANCHOR HOOK
export const useApexForgeProgram = () => {
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet || !wallet.publicKey) return null;

    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'confirmed',
      });

      const rawProgramId = import.meta.env.VITE_PROGRAM_ID || idl?.address || FALLBACK_PROGRAM_ID;
      const programId = new PublicKey(rawProgramId.trim());

      const formattedIdl = {
        ...idl,
        address: programId.toBase58()
      };

      console.log("Anchor Initialized Successfully for Program:", programId.toBase58());
      
      return new Program(formattedIdl, programId, provider);

    } catch (err) {
      console.error("🔴 CRITICAL: Failed to construct Anchor Program instance:", err);
      return null;
    }
  }, [wallet]);
};