import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * NFTS 컬렉션 리스트 조회 API 호출
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
    throw new Error('API 호출 실패: NFTS 컬렉션 조회 실패');
  }
};

/**
 * NFTS 컬렉션 생성 API 호출
 * param {string} token - 인증 토큰
 * param {FormData} formData - 생성할 컬렉션 정보
 * returns {Promise} axios POST 요청 반환
 */

export const createNftCollection = async (token, formData) => {
  try {
    const response = await axios.post(`${serverApi}/api/nfts/collections`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('API 호출 실패: NFTS 컬렉션 생성 실패');
  }
};

/**
 * 나의 NFTS 컬렉션 조회 API 호출
 * param {string} token - 인증 토큰
 * param {number} page - 페이지 번호
 * param {string} sortBy - 정렬 기준
 * param {string} searchKeyword - 검색어
 * returns {Promise} axios GET 요청 반환
 */

export const getMyNftCollections = async (token, page = 1, sortBy = '', searchKeyword = '') => {
  try {
    // params 객체를 조건부로 구성
    const params = {};
    if (page) params.page = page;
    if (sortBy) params.sort_by = sortBy;
    if (searchKeyword) params.search_keyword = searchKeyword;

    const response = await axios.get(`${serverApi}/api/nfts/my/collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data.data;
  } catch (error) {
    throw new Error('API 호출 실패: 나의 NFTS 컬렉션 조회 실패');
  }
};

/**
 * NFTS 컬렉션 상세 조회 API 호출
 * param {number} id - 컬렉션 ID
 * returns {Promise} axios GET 요청 반환
 */

export const getNftCollectionDetail = async ({ id, wallet_address }) => {
  try {
    const params = {};
    if (wallet_address) params.wallet_address = wallet_address;

    const response = await axios.get(`${serverApi}/api/nfts/collections/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error('API 호출 실패: NFTS 컬렉션 상세 조회 실패');
  }
};
/**
 * 컬렉션 오버뷰 조회 API 호출
 * param {number} id - 컬렉션 ID
 * returns {Promise} axios GET 요청 반환
 */

export const getNftCollectionOverview = async ({ id }) => {
  const response = await axios.get(`${serverApi}/api/nfts/collections/${id}/overview`, {});
  console.log(response.data, '컬렉션 오버뷰 조회 데이터');
  return response.data;
};
