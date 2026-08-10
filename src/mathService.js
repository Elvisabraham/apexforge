// src/services/mathService.js

// Initial Virtual Reserves matching your Rust smart contract
const VIRTUAL_SOL_INITIAL = 30 * 1e9; // 30 SOL in lamports
const VIRTUAL_TOKEN_INITIAL = 1_000_000_000 * 1e6; // 1 Billion tokens (6 decimals)
const GRADUATION_TARGET_SOL = 85; 

export const formatCurrency = (val) => {
  if (!val) return '0.00';
  let parts = val.toString().replace(/,/g, '').split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join('.');
};

export const calculateMaxWithGas = (balance, gasFee = 0.000005) => {
  const bal = parseFloat(balance.replace(/,/g, ''));
  const withdrawable = bal - gasFee;
  return withdrawable > 0 ? formatCurrency(withdrawable.toFixed(6)) : '0.00';
};

// 🚀 NEW APEX FORGE AMM MATH FUNCTIONS

/**
 * BUY ESTIMATION: Calculates tokens received for a given SOL input
 */
export const calculateBuyEstimation = (solAmountStr, virtualSol = VIRTUAL_SOL_INITIAL, virtualTokens = VIRTUAL_TOKEN_INITIAL) => {
  // 🚀 FIX 1: Strip commas before parsing to prevent calculation failures
  const cleanStr = solAmountStr ? solAmountStr.toString().replace(/,/g, '') : "0";
  
  if (!cleanStr || isNaN(cleanStr) || parseFloat(cleanStr) <= 0) {
    return { tokensOut: "0.00", priceImpact: "0.00" };
  }

  const solAmount = parseFloat(cleanStr) * 1e9;
  const totalFee = Math.floor(solAmount / 100); 
  const curveAmount = solAmount - totalFee; 

  const tokensToMint = (curveAmount * virtualTokens) / (virtualSol + curveAmount);
  
  // 🚀 FIX 2: Bounded Price Impact Formula (0-100%)
  const impact = (curveAmount / (virtualSol + curveAmount)) * 100;

  return {
    tokensOut: (tokensToMint / 1e6).toFixed(2),
    priceImpact: impact.toFixed(2)
  };
};

/**
 * SELL ESTIMATION: Calculates SOL received for a given Token input
 */
export const calculateSellEstimation = (tokenAmountStr, virtualSol = VIRTUAL_SOL_INITIAL, virtualTokens = VIRTUAL_TOKEN_INITIAL) => {
  // 🚀 FIX 1: Strip commas before parsing to prevent calculation failures
  const cleanStr = tokenAmountStr ? tokenAmountStr.toString().replace(/,/g, '') : "0";

  if (!cleanStr || isNaN(cleanStr) || parseFloat(cleanStr) <= 0) {
    return { solOut: "0.00", priceImpact: "0.00" };
  }

  const tokenAmount = parseFloat(cleanStr) * 1e6;

  const solOut = (tokenAmount * virtualSol) / (virtualTokens + tokenAmount);
  
  const totalFee = Math.floor(solOut / 100);
  const userSolAmount = solOut - totalFee;

  // 🚀 FIX 2: Bounded Price Impact Formula (0-100%)
  const impact = (tokenAmount / (virtualTokens + tokenAmount)) * 100;

  return {
    solOut: (userSolAmount / 1e9).toFixed(4),
    priceImpact: impact.toFixed(2)
  };
};

/**
 * PROGRESS BAR: Calculates the live progress towards 85 SOL
 */
export const calculateCurveProgress = (realSolReservesLamports) => {
  if (!realSolReservesLamports) return 0;
  const realSol = realSolReservesLamports / 1e9;
  const progress = (realSol / GRADUATION_TARGET_SOL) * 100;
  return Math.min(progress, 100).toFixed(2);
};

/**
 * MARKET CAP: Calculates Market Cap based on current ratio
 */
export const calculateMarketCap = (virtualSol = VIRTUAL_SOL_INITIAL, virtualTokens = VIRTUAL_TOKEN_INITIAL, solUsdPrice = 76.50) => {
  const spotPriceInSol = virtualSol / virtualTokens; 
  const tokenPriceSol = spotPriceInSol / 1e3; 
  
  const totalSupply = 1_000_000_000;
  const mcapSol = tokenPriceSol * totalSupply;
  const mcapUsd = mcapSol * solUsdPrice;

  if (mcapUsd >= 1000000) {
    return "$" + (mcapUsd / 1000000).toFixed(2) + "M";
  }
  return "$" + (mcapUsd / 1000).toFixed(2) + "K";
};