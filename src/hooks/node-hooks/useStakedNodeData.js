import { useReadContract } from 'thirdweb/react';
import { mobNftStakingContract } from '../contracts/contract';
import { useWalletAddress } from './useWalletAddress';

export const useStakedNodeData = () => {
  const walletAddress = useWalletAddress();

  const { data: stakedNftData, refetch: refetchStakedNftData } = useReadContract({
    contract: mobNftStakingContract,
    method: 'function stakings(address) view returns (uint256 amount, uint256 lastUpdate)',
    params: [walletAddress],
  });

  const stakedNftBalance = stakedNftData ? parseFloat(stakedNftData[0]) : 0;

  return { stakedNftBalance, refetchStakedNftData };
};
