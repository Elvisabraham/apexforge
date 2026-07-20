import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SolanaProvider from './components/SolanaProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* We wrap the entire App in the Solana Engine so every page can read the wallet */}
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </React.StrictMode>,
)