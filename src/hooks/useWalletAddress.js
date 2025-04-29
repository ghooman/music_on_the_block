import { useActiveAccount } from 'thirdweb/react';

export const useWalletAddress = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  return walletAddress;
};
