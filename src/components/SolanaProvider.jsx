import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

// 🚀 WALLET ADAPTERS FOR MOBILE AND DESKTOP
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import idl from '../idl/idl.json';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function SolanaProvider({ children }) {
  // Read network mode dynamically from .env (defaults to Devnet)
  const networkEnv = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
  const network = networkEnv === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet;

  // Read RPC URL dynamically from .env
  const endpoint = useMemo(() => {
    return import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(network);
  }, [network]);

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

// 🚀 CRASH-PROOF ANCHOR HOOK (Anchor v0.30+)
export const useApexForgeProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) {
      console.log("🟡 Waiting for Anchor Wallet to connect...");
      return null;
    }

    try {
      console.log("🟢 Anchor Wallet Connected:", wallet.publicKey.toBase58());

      // Reuses active connection from ConnectionProvider
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'confirmed',
      });

      if (!idl || Object.keys(idl).length === 0) {
        console.error("🔴 CRITICAL: IDL is empty!");
        return null;
      }

      console.log("🟢 Initializing Smart Contract (Anchor v0.30 Mode)...");
      return new Program(idl, provider);

    } catch (err) {
      console.error("🔴 Anchor Provider Crashed. Reason:", err.message);
      return null;
    }
  }, [wallet, connection]);
};