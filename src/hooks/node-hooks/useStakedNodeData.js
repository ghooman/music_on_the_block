import { useReadContract } from 'thirdweb/react';
import { useNodeWalletAddress } from '../useNodeWalletAddress';
import { mobNftStakingContract } from '../../contract/contracts';

export const useStakedNodeData = () => {
  const { data: nodeWalletAddress, isLoading } = useNodeWalletAddress();

  const { data: stakedNftData, refetch: refetchStakedNftData } = useReadContract({
    contract: mobNftStakingContract,
    method: 'function stakings(address) view returns (uint256 amount, uint256 lastUpdate)',
    params: [nodeWalletAddress],
  });

  const stakedNftBalance = stakedNftData ? parseFloat(stakedNftData[0]) : 0;

  return { stakedNftBalance, refetchStakedNftData, nodeWalletAddress };
};
