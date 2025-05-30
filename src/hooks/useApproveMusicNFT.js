import { prepareContractCall } from 'thirdweb';
import { useSendAndConfirmTransaction } from 'thirdweb/react';
import { musicNftContract } from '../contract/contracts';
import { MARKET_PLACE_CONTRACT_ADDRESS } from '../contract/contractAddresses';

export const useApproveMusicNFT = () => {
  const { mutateAsync: sendAndConfirmTransaction } = useSendAndConfirmTransaction();

  const approveMusicNFT = async () => {
    try {
      console.log('approveMusicNFT 실행');
      const transaction = prepareContractCall({
        contract: musicNftContract,
        method: 'function setApprovalForAll(address operator, bool approved)',
        params: [MARKET_PLACE_CONTRACT_ADDRESS, true],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('approveMusicNFT receipt:', receipt);
    } catch (error) {
      console.error('Error during approveMusicNFT:', error.message);
      throw error;
    }
  };

  return approveMusicNFT;
};
