import { useReadContract } from 'thirdweb/react';
import { useWalletAddress } from './useWalletAddress';
import { mobContract, polContract, usdtContract, usdcContract } from '../contract/contracts';

export const useTokenBalance = () => {
  const walletAddress = useWalletAddress();

  // MOB
  const { data: mobData, refetch: refetchMob } = useReadContract({
    contract: mobContract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [walletAddress],
  });

  // POL
  const { data: polData, refetch: refetchPol } = useReadContract({
    contract: polContract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [walletAddress],
  });

  // USDT
  const { data: usdtData, refetch: refetchUsdt } = useReadContract({
    contract: usdtContract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [walletAddress],
  });

  // USDC
  const { data: usdcData, refetch: refetchUsdc } = useReadContract({
    contract: usdcContract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [walletAddress],
  });

  const toEther = wei => (wei ? (Number(wei) / 10 ** 18).toFixed(2) : '0.00');

  return {
    mobBalance: toEther(mobData),
    polBalance: toEther(polData),
    usdtBalance: toEther(usdtData),
    usdcBalance: toEther(usdcData),
    refetchAll: () => {
      refetchMob();
      refetchPol();
      refetchUsdt();
      refetchUsdc();
    },
  };
};
