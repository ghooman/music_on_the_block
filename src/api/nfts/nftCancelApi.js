import { api } from './api';

/**
 * 내가 등록한 NFT 판매를 취소하는 API
 * @param {number} listingId - 취소할 nft의 listing ID
 * @returns {Promise} - 서버 응답 데이터
 */
export const cancelMySellNft = async listingId => {
  try {
    const response = await api.post(`/api/nfts/my/sell/${listingId}/cancel`);

    return response.data;
  } catch (error) {
    console.error('failed cancelMySellNft:', error);
    throw new Error('failed cancelMySellNft');
  }
};
