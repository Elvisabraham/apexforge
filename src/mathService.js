// src/services/mathService.js

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