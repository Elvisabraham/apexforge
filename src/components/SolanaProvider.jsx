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

  // 🚀 Replaced rate-limited Ankr endpoint to fix 403 Forbidden errors
  const endpoint = useMemo(() => {
    // Official public fallback:
    return 'https://api.mainnet-beta.solana.com';

    // 💡 Tip: For high-traffic production, replace with a free key from Helius/QuickNode:
    // return 'https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY';
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