import { useReadContract } from 'thirdweb/react';
import { useNodeWalletAddress } from '../useNodeWalletAddress';
import { mobNftContract } from '../../contract/contracts';

/**
 * 서버에 등록된 지갑 주소 기준으로 NFT 보유량 조회
 */
export const useOwnedNftData = () => {
  const { data: nodeWalletAddress, isLoading } = useNodeWalletAddress();

  const { data: nftData, refetch: refetchNftData } = useReadContract({
    contract: mobNftContract,
    method: 'function balanceOf(address account, uint256 id) view returns (uint256)',
    params: [nodeWalletAddress, 0],
    enabled: !!nodeWalletAddress && !isLoading,
  });

  const ownedNftBalance = nftData ? parseFloat(nftData) : 0;

  return { refetchNftData, ownedNftBalance };
};
