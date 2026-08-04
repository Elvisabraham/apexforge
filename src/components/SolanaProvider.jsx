import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

// 🚀 IMPORTS FOR MOBILE AND DESKTOP WALLET ADAPTERS
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import idl from '../idl/idl.json';
import '@solana/wallet-adapter-react-ui/styles.css';

const FALLBACK_PROGRAM_ID = 'zVUrGLVA9VYEGAaBexZfaNCiB6zTVtn61kDRfcRwYsc';

export default function SolanaProvider({ children }) {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    return 'https://api.devnet.solana.com';
  }, []);

  // 🚀 REGISTER WALLET ADAPTERS FOR MOBILE BROWSERS & EXTENSIONS
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    [network]
  );

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

// 🚀 CRASH-PROOF ANCHOR HOOK (Handles ALL Anchor versions)
export const useApexForgeProgram = () => {
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) {
      console.log("🟡 Waiting for Anchor Wallet to connect...");
      return null;
    }

    try {
      console.log("🟢 Anchor Wallet Connected:", wallet.publicKey.toBase58());
      
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'confirmed',
      });

      // 🛑 EMERGENCY CHECK: Is the IDL actually there?
      if (!idl || Object.keys(idl).length === 0 || (!idl.instructions && !idl.methods)) {
        console.error("🔴 CRITICAL: IDL is empty or invalid! Please paste your compiled Anchor contract into src/idl/idl.json");
        return null;
      }

      const rawProgramId = import.meta.env.VITE_PROGRAM_ID || idl?.metadata?.address || idl?.address || FALLBACK_PROGRAM_ID;
      const programId = new PublicKey(rawProgramId.trim());
      
      console.log("🟢 Initializing Smart Contract with Program ID:", programId.toBase58());

      try {
        // Try Standard Anchor v0.29 (Most Common)
        return new Program(idl, programId, provider);
      } catch (innerErr) {
        // Fallback for Anchor v0.30+
        const formattedIdl = { ...idl, address: programId.toBase58() };
        return new Program(formattedIdl, provider);
      }

    } catch (err) {
      console.error("🔴 Anchor Provider Crashed. Reason:", err.message);
      return null;
    }
  }, [wallet]);
};