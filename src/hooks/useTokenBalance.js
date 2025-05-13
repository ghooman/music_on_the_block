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

  const toDecimal = (wei, decimals = 18) =>
    wei ? (Number(wei) / 10 ** decimals).toFixed(4) : '0.0000';

  return {
    mobBalance: toDecimal(mobData, 18),
    polBalance: toDecimal(polData, 18),
    usdtBalance: toDecimal(usdtData, 6),
    usdcBalance: toDecimal(usdcData, 6),
    refetchAll: () => {
      refetchMob();
      refetchPol();
      refetchUsdt();
      refetchUsdc();
    },
  };
};
