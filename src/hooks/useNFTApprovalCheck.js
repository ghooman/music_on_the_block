import { useReadContract } from 'thirdweb/react';
import { useWalletAddress } from './useWalletAddress';
import { musicNftContract } from '../contract/contracts';
import { MARKET_PLACE_CONTRACT_ADDRESS } from '../contract/contractAddresses';

export const useNFTApprovalCheck = () => {
  console.log('1번 실행');
  const walletAddress = useWalletAddress();

  const { data: nftApprovalCheckData } = useReadContract({
    contract: musicNftContract,
    method: 'function isApprovedForAll(address owner, address operator) view returns (bool)',
    params: [walletAddress, MARKET_PLACE_CONTRACT_ADDRESS],
  });
  console.log('nftApprovalCheckData', nftApprovalCheckData);
  return nftApprovalCheckData;
};
