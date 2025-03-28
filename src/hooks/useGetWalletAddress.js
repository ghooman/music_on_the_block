import { useActiveAccount } from "thirdweb/react";

export const useGetWalletAddress = () => {
  const activeAccount = useActiveAccount();
  const walletAddress = activeAccount?.address;

  return walletAddress;
};
