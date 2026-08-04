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

// 🚀 CRASH-PROOF ANCHOR HOOK (Strictly for Anchor v0.30+)
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

      if (!idl || Object.keys(idl).length === 0) {
        console.error("🔴 CRITICAL: IDL is empty!");
        return null;
      }

      console.log("🟢 Initializing Smart Contract (Anchor v0.30 Mode)...");

      // 🚀 THE FIX: Anchor v0.30+ ONLY takes 2 arguments!
      // It will automatically read the Program ID from your 52-line IDL file.
      return new Program(idl, provider);

    } catch (err) {
      console.error("🔴 Anchor Provider Crashed. Reason:", err.message);
      return null;
    }
  }, [wallet]);
};