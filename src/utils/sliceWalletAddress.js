export const sliceWalletAddress = walletAddress => {
  if (!walletAddress || typeof walletAddress !== 'string') return;
  return walletAddress.slice(0, 5) + '...' + walletAddress.slice(-3);
};
