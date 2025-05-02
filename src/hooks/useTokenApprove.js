import { prepareContractCall } from 'thirdweb';
import { useSendAndConfirmTransaction } from 'thirdweb/react';
import {
  mobContract,
  polContract,
  usdcContract,
  usdtContract,
  marketPlaceContract,
} from '../contract/contracts';

export const useTokenApprove = () => {
  const { mutateAsync: sendAndConfirmTransaction } = useSendAndConfirmTransaction();

  const approveAmount = '10000000000000000000000000000';

  const mobTokenApprove = async () => {
    try {
      const transaction = prepareContractCall({
        contract: mobContract,
        method: 'function approve(address spender, uint256 amount) returns (bool)',
        params: [marketPlaceContract.address, approveAmount],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('mobTokenApprove receipt:', receipt);
    } catch (error) {
      console.error('Error during mobTokenApprove:', error.message);
      throw error;
    }
  };

  const polTokenApprove = async () => {
    try {
      const transaction = prepareContractCall({
        contract: polContract,
        method: 'function approve(address spender, uint256 amount) returns (bool)',
        params: [marketPlaceContract.address, approveAmount],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('polTokenApprove receipt:', receipt);
    } catch (error) {
      console.error('Error during polTokenApprove:', error.message);
      throw error;
    }
  };

  const usdcTokenApprove = async () => {
    try {
      const transaction = prepareContractCall({
        contract: usdcContract,
        method: 'function approve(address spender, uint256 amount) returns (bool)',
        params: [marketPlaceContract.address, approveAmount],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('usdcTokenApprove receipt:', receipt);
    } catch (error) {
      console.error('Error during usdcTokenApprove:', error.message);
      throw error;
    }
  };

  const usdtTokenApprove = async () => {
    try {
      const transaction = prepareContractCall({
        contract: usdtContract,
        method: 'function approve(address spender, uint256 amount) returns (bool)',
        params: [marketPlaceContract.address, approveAmount],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('usdtTokenApprove receipt:', receipt);
    } catch (error) {
      console.error('Error during usdtTokenApprove:', error.message);
      throw error;
    }
  };

  return {
    mobTokenApprove,
    polTokenApprove,
    usdcTokenApprove,
    usdtTokenApprove,
  };
};
