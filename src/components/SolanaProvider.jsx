import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Bringing in the heavy hitters
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TrustWalletAdapter
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

export default function SolanaProvider({ children }) {
  const network = WalletAdapterNetwork.Mainnet;

  // Uses a free RPC endpoint to prevent 403 Forbidden errors
  const endpoint = useMemo(() => {
    return 'https://rpc.ankr.com/solana';
  }, []);

  // Your expanded wallet list
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