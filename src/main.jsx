import { Buffer } from '@solana/web3.js';
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SolanaProvider from './components/SolanaProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </React.StrictMode>,
)