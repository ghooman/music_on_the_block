import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * NFTS 컬렉션 조회 API 호출
 * param {number} page - 페이지 번호
 * param {string} sortBy - 정렬 기준
 * param {string} searchKeyword - 검색어
 * params {string} wallet_address - 지갑 주소 // 좋아요 확인용
 * returns {Promise} axios GET 요청 반환
 */
export const getNftCollections = async ({ page, search_keyword, sort_by, wallet_address }) => {
  try {
    const response = await axios.get(`${serverApi}/api/nfts/collections/list`, {
      params: {
        page: page,
        search_keyword,
        sort_by,
        wallet_address,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('NFTS 컬렉션 조회 실패');
  }
};
