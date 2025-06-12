import { useReadContract } from 'thirdweb/react';
import { mobContract } from '../../contract/contracts';
import { useNodeWalletAddress } from '../useNodeWalletAddress';

export const useNodeWalletTokenBalance = () => {
  const { data: nodeWalletAddress, isLoading } = useNodeWalletAddress();

  const { data: mobData, refetch: refetchMobData } = useReadContract({
    contract: mobContract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [nodeWalletAddress],
  });
  console.log('mobData', mobData);

  const mobBalance = mobData ? (Number(mobData) / 10 ** 18).toFixed(4) : '0.0000';

  return { mobBalance, refetchMobData };
};
