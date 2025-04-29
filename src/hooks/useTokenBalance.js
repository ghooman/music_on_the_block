import { useReadContract } from 'thirdweb/react';
import { useWalletAddress } from './useWalletAddress';
import { mobContract } from '../contract/contracts';

export const useTokenBalance = () => {
  const walletAddress = useWalletAddress();

  const { data: mobData, refetch: refetchMobData } = useReadContract({
    contract: mobContract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [walletAddress],
  });
  console.log('mobData', mobData);

  const mobBalance = mobData ? (Number(mobData) / 10 ** 18).toFixed(2) : '0.00';

  return { mobBalance };
};
