import { useReadContract } from 'thirdweb/react';
import { useWalletAddress } from '../useWalletAddress';
import { mobNftStakingContract } from '../../contract/contracts';

export const useStakingReward = () => {
  const walletAddress = useWalletAddress();

  const { data: stakingRewardData, refetch: refetchStakingRewardData } = useReadContract({
    contract: mobNftStakingContract,
    method: 'function calculateRewards(address user) view returns (uint256)',
    params: [walletAddress],
  });

  const weiToEth = wei => {
    return wei ? (parseFloat(wei.toString()) / 10 ** 18).toFixed(4) : '0.00';
  };

  const stakingRewardRaw = weiToEth(stakingRewardData);
  const stakingReward = (stakingRewardRaw * 0.85).toFixed(4);

  return { stakingReward, refetchStakingRewardData };
};
