import { api } from './api';

/**
 * NFT 구매 요청 함수
 * @param {number} collectionId - 컬렉션 ID
 * @param {number} listingId - 구매하려는 NFT의 listing ID
 * @param {string} txId - 블록체인 트랜잭션 해시
 * @returns {Promise} - 응답 데이터
 */
export const purchaseNft = async (collectionId, listingId, txId) => {
  try {
    const response = await api.post(
      `/api/nfts/${collectionId}/${listingId}/purchase`,
      {},
      {
        params: {
          tx_id: txId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('failed purchaseNft:', error);
    throw new Error('failed purchaseNft');
  }
};
