import { prepareContractCall } from 'thirdweb';
import { useSendAndConfirmTransaction } from 'thirdweb/react';
import { useWalletAddress } from './useWalletAddress';
import { marketPlaceContract } from '../contract/contracts';

export const useBuyFromListing = () => {
  const walletAddress = useWalletAddress();

  const { mutateAsync: sendAndConfirmTransaction } = useSendAndConfirmTransaction();

  const buyFromListing = async () => {
    try {
      const transaction = prepareContractCall({
        contract: marketPlaceContract,
        method:
          'function buyFromListing(uint256 _listingId, address _buyFor, uint256 _quantity, address _currency, uint256 _expectedTotalPrice) payable',
        params: ['리스팅 아이디값', walletAddress, 1, '해당 토큰 주소값', '토큰 수량'],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('buyFromListing receipt:', receipt);
    } catch (error) {
      console.error('Error during buyFromListing:', error.message);
      throw error;
    }
  };

  

  return buyFromListing;
};
