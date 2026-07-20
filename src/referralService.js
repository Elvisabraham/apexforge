// src/services/referralService.js

export const generateReferralLink = (username) => {
  const baseUrl = "https://apexforge.io/ref/";
  // In a real backend, this would check if the hash is unique
  const hash = btoa(username + Date.now()).slice(0, 8).toUpperCase();
  return `${baseUrl}${hash}`;
};

export const calculateReferralReward = (swapVolume, rewardTier = 'standard') => {
  // Reward matrix: Standard gets 0.1% of swap volume in SOL
  const rate = rewardTier === 'institutional' ? 0.002 : 0.001; 
  const volume = parseFloat(swapVolume.replace(/,/g, ''));
  const reward = volume * rate;
  
  return reward > 0 ? reward.toFixed(4) : '0.0000';
};