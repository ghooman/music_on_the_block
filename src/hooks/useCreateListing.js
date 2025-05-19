import { prepareContractCall } from 'thirdweb';
import { useSendAndConfirmTransaction } from 'thirdweb/react';
import { marketPlaceContract } from '../contract/contracts';
import { ethers } from 'ethers';

export const useSellNFT = () => {
  const { mutateAsync: sendAndConfirmTransaction } = useSendAndConfirmTransaction();

  const createListing = async params => {
    try {
      console.log('🟡 createListing 실행', params);

      const transaction = prepareContractCall({
        contract: marketPlaceContract,
        method:
          'function createListing((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params) returns (uint256 listingId)',
        params: [params],
      });

      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('createListing receipt:', receipt);

      // NewListing 이벤트 시그니처를 Keccak256 해시로 생성
      const eventSignature = ethers.id(
        'NewListing(address,uint256,address,(uint256,uint256,uint256,uint256,uint128,uint128,address,address,address,uint8,uint8,bool))'
      );

      const logs = receipt?.logs || [];

      // 로그에서 NewListing 이벤트 찾기
      const listingEvent = logs.find(log => log.topics[0] === eventSignature);

      if (listingEvent) {
        // bigint에러 임시 패스
        // eslint-disable-next-line no-undef
        const listingId = BigInt(listingEvent.topics[2]).toString(); // listingId는 topic[2] 위치에 있음 abi참고시 확인

        const transactionHash = receipt.transactionHash;
        console.log('listingId:', listingId);
        return { listingId, transactionHash };
      } else {
        console.warn('NewListing 이벤트를 찾지 못했습니다.');
        return null;
      }
    } catch (error) {
      console.error('Error during createListing:', error.message);
      throw error;
    }
  };

  return createListing;
};
