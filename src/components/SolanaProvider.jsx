import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';

import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter
} from '@solana/wallet-adapter-wallets';

import idl from '../idl/idl.json';
import '@solana/wallet-adapter-react-ui/styles.css';

// Program ID from your build
const PROGRAM_ID = new PublicKey(import.meta.env.VITE_PROGRAM_ID || '4vLUMypMsazY7Xsm56Q1h5wbkT1EBFuvevtmE77SYbfJ');

export default function SolanaProvider({ children }) {
  // ⚙️ Switched to Devnet for contract testing
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    return 'https://api.devnet.solana.com';
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
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

// 🚀 Hook to interact directly with your Apex Forge Anchor contract in UI components
export const useApexForgeProgram = () => {
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) return null;

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: 'confirmed',
    });

    return new Program(idl, PROGRAM_ID, provider);
  }, [wallet]);
};