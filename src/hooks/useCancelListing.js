import { prepareContractCall } from 'thirdweb';
import { useSendAndConfirmTransaction } from 'thirdweb/react';
import { useWalletAddress } from './useWalletAddress';
import { marketPlaceContract } from '../contract/contracts';

export const useCancelListing = () => {
  const { mutateAsync: sendAndConfirmTransaction } = useSendAndConfirmTransaction();

  const cancelListing = async listingId => {
    try {
      const transaction = prepareContractCall({
        contract: marketPlaceContract,
        method: 'function cancelListing(uint256 _listingId)',
        params: [listingId],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('cancelListing receipt:', receipt);
    } catch (error) {
      console.error('Error during cancelListing:', error.message);
      throw error;
    }
  };

  return cancelListing;
};
