import { prepareContractCall } from 'thirdweb';
import { useSendAndConfirmTransaction } from 'thirdweb/react';
import { marketPlaceContract } from '../contract/contracts';

export const useSellNFT = () => {
  const { mutateAsync: sendAndConfirmTransaction } = useSendAndConfirmTransaction();

  // nft 판매(마켓플레이스에 등록)
  const createListing = async () => {
    try {
      console.log('createListing 실행');
      const transaction = prepareContractCall({
        contract: marketPlaceContract,
        method:
          'function createListing((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params) returns (uint256 listingId)',
        params: ['_params'],

        // params 예시
        // {"assetContract": "음악 nft 컨트랙트 주소 고정", "tokenId": "mint된 해당 nft의 id값", "quantity": "1로 항상 고정", "currency": "선택 토큰 컨트랙트 주소", "pricePerToken": "토큰 수량", "startTimestamp": "현재시간 타임스탬프", "endTimestamp": "현재시간기준으로 10년뒤 타임스탬프", "reserved": false로 항상 고정}
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log('createListing receipt:', receipt);
    } catch (error) {
      console.error('Error during createListing:', error.message);
      throw error;
    }
  };

  return createListing;
};
