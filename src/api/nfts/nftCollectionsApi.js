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
export const getNftCollections = async ({
  page,
  search_keyword,
  sort_by,
  wallet_address,
  user_name,
}) => {
  try {
    const response = await axios.get(`${serverApi}/api/nfts/collections/list`, {
      params: {
        page: page,
        search_keyword,
        sort_by,
        wallet_address,
        user_name,
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
    throw new Error('API 호출 실패: NFTS 컬렉션 생성 실패' + error);
  }
};

/**
 * NFTS 컬렉션 수정 API 호출
 * param {string} token - 인증 토큰
 * param {FormData} formData - 컬렉션 수정 정보
 * param {string | number} collectionsId - 수정할 컬렉션의 ID
 * returns {Promise} axios POST 요청 반환
 */

export const updateNftCollection = async (token, formData, collectionsId) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/nfts/collections/${collectionsId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('API 호출 실패: NFTS 컬렉션 수정 실패' + error);
  }
};

/**
 * NFTS 컬렉션 삭제 API 호출
 * param {string} token - 인증 토큰
 * param {string | number} collectionsId - 수정할 컬렉션의 ID
 * returns {Promise} axios POST 요청 반환
 */

export const deleteNftCollection = async (token, collectionsId) => {
  try {
    const response = await axios.delete(`${serverApi}/api/nfts/collections/${collectionsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('API 호출 실패 : NFTS 컬렉션 삭제 실패' + error);
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
  return response.data;
};
/**
 * 컬렉션 상세 NFT LIST 조회 API 호출
 * param {number} id - 컬렉션 ID
 * param {number} page - 페이지 번호
 * param {string} ai_service - 서비스 타입
 * param {string} nft_rating - 평점
 * param {string} salse_token - 판매 토큰
 * param {string} sort_by - 정렬 기준
 * param {string} search_keyword - 검색어
 * returns {Promise} axios GET 요청 반환
 */

export const getNftCollectionNftList = async ({
  id,
  page,
  sort_by,
  search_keyword,
  ai_service,
  nft_rating,
  sales_token,
  now_sales_status,
}) => {
  const response = await axios.get(`${serverApi}/api/nfts/collections/${id}/nfts`, {
    params: {
      page,
      sort_by,
      search_keyword,
      ai_service,
      nft_rating,
      sales_token,
      now_sales_status,
    },
  });

  return response.data;
};

/**
 * 컬렉션 상세 활동 기록(history) 조회 API 호출
 * param {number} id - 컬렉션 ID
 * param {number} page - 페이지 번호
 * param {string} ai_service - 서비스 타입
 * param {string} nft_rating - 평점
 * param {string} salse_token - 판매 토큰
 * param {string} sort_by - 정렬 기준
 * param {string} search_keyword - 검색어
 * returns {Promise} axios GET 요청 반환
 */

export const getNftCollectionHistory = async ({
  id,
  page,
  sort_by,
  search_keyword,
  ai_service,
  nft_rating,
  salse_token,
}) => {
  const response = await axios.get(`${serverApi}/api/nfts/collections/${id}/activities`, {
    params: {
      page,
      sort_by,
      search_keyword,
      ai_service,
      nft_rating,
      salse_token,
    },
  });

  return response.data;
};
/**
 * 컬렉션 좋아요 기능 API 호출
 * param {number} id - 컬렉션 ID
 * parma {string} wallet_address - 지갑 주소
 * parma {string} token - 인증 토큰
 * returns {Promise} axios POST 요청 반환
 */

export const likeNftCollection = async ({ id, wallet_address, token }) => {
  const response = await axios.post(
    `${serverApi}/api/nfts/collections/${id}/like?wallet_address=${wallet_address}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('좋아요', response.data);
  return response.data;
};

/**
 * 컬렉션 좋아요 취소 기능 API 호출
 * param {number} id - 컬렉션 ID
 * parma {string} wallet_address - 지갑 주소
 * parma {string} token - 인증 토큰
 * returns {Promise} axios POST 요청 반환
 */

export const likeNftCollectionCancel = async ({ id, wallet_address, token }) => {
  const response = await axios.post(
    `${serverApi}/api/nfts/collections/${id}/like/cancel?wallet_address=${wallet_address}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('캔슬', response.data);
  return response.data;
};
