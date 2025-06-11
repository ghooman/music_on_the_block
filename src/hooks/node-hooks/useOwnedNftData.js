import { useReadContract } from 'thirdweb/react';
import { useWalletAddress } from '../useWalletAddress';
import { mobNftContract } from '../../contract/contracts';

export const useOwnedNftData = () => {
  const walletAddress = useWalletAddress();
  // owned nft balance
  const { data: nftData, refetch: refetchNftData } = useReadContract({
    contract: mobNftContract,
    method: 'function balanceOf(address account, uint256 id) view returns (uint256)',
    params: [walletAddress, 0],
  });

  console.log('nftData', nftData);

  const owendNftBalance = nftData ? parseFloat(nftData) : 0;

  return { refetchNftData, owendNftBalance };
};
