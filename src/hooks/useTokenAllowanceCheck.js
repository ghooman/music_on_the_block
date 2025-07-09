import { useReadContract } from 'thirdweb/react';
import { useWalletAddress } from './useWalletAddress';
// 0630 하늘 fix: USDT, USDC 관련 내용 주석 처리
import { mobContract, polContract, usdtContract, usdcContract } from '../contract/contracts';
import { MARKET_PLACE_CONTRACT_ADDRESS } from '../contract/contractAddresses';

export const useTokenAllowanceCheck = () => {
  const walletAddress = useWalletAddress();

  const { data: mobAllowanceData } = useReadContract({
    contract: mobContract,
    method: 'function allowance(address owner, address spender) view returns (uint256)',
    params: [walletAddress, MARKET_PLACE_CONTRACT_ADDRESS],
  });

  const { data: polAllowanceData } = useReadContract({
    contract: polContract,
    method: 'function allowance(address owner, address spender) view returns (uint256)',
    params: [walletAddress, MARKET_PLACE_CONTRACT_ADDRESS],
  });

  const { data: usdtAllowanceData } = useReadContract({
    contract: usdtContract,
    method: 'function allowance(address owner, address spender) view returns (uint256)',
    params: [walletAddress, MARKET_PLACE_CONTRACT_ADDRESS],
  });

  const { data: usdcAllowanceData } = useReadContract({
    contract: usdcContract,
    method: 'function allowance(address owner, address spender) view returns (uint256)',
    params: [walletAddress, MARKET_PLACE_CONTRACT_ADDRESS],
  });

  return {
    mobAllowanceData,
    polAllowanceData,
    usdtAllowanceData,
    usdcAllowanceData,
  };
};
