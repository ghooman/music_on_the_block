import { prepareContractCall } from 'thirdweb';
import { useSendAndConfirmTransaction } from 'thirdweb/react';
import { useWalletAddress } from './useWalletAddress';
import { marketPlaceContract } from '../contract/contracts';
import { ethers } from 'ethers';
import { USDC_CONTRACT_ADDRESS, USDT_CONTRACT_ADDRESS } from '../contract/contractAddresses';

export const useBuyFromListing = () => {
  const walletAddress = useWalletAddress();
  const { mutateAsync: sendAndConfirmTransaction } = useSendAndConfirmTransaction();

  const buyFromListing = async (listingId, currencyAddress, price) => {
    console.log('listingId', listingId);
    console.log('currencyAddress', currencyAddress);
    console.log('price', price);

    const isSixDecimal =
      currencyAddress === USDT_CONTRACT_ADDRESS || currencyAddress === USDC_CONTRACT_ADDRESS;

    const decimals = isSixDecimal ? 6 : 18;
    const priceToWei = ethers.parseUnits(price.toString(), decimals);
    console.log('priceToWei', priceToWei);

    try {
      const transaction = prepareContractCall({
        contract: marketPlaceContract,
        method:
          'function buyFromListing(uint256 _listingId, address _buyFor, uint256 _quantity, address _currency, uint256 _expectedTotalPrice) payable',

        params: [listingId, walletAddress, 1, currencyAddress, priceToWei],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('buyFromListing receipt:', receipt);
      return receipt.transactionHash; // tx_id 반환
    } catch (error) {
      console.error('Error during buyFromListing:', error.message);
      throw error;
    }
  };

  return buyFromListing;
};
