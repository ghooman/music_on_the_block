import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 앨범 생성 API 호출 함수
 * param {FormData} formData - 앨범 정보(payload 및 파일)
 * param {string} token - 인증 토큰
 * returns {Promise} axios POST 요청 반환
 */
export const createAlbumsList = async (formData, token) => {
  // FormData 내용 로깅
  for (let [key, value] of formData.entries()) {
  }

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('인증 토큰이 없습니다!');
  }

  const url = `${serverApi}/api/music/album/bundle`;

  try {
    const response = await axios.post(url, formData, {
      headers,
    });
    // getAlbumsList(token, 1, "", "");
    return response;
  } catch (error) {
    console.error('API 호출 실패:', error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    throw error;
  }
};
/**
 * 앨범 목록 조회 API 호출 함수
 * param {string} token - 인증 토큰
 * param {number} page - 페이지 번호
 * param {string} searchKeyword - 검색어
 * returns {Promise} axios GET 요청 반환
 */
export const getAlbumsList = async (token, page = 1, searchKeyword = '', albumSort = '') => {
  const params = new URLSearchParams({});
  if (page) params.append('page', page);
  if (searchKeyword) params.append('search_keyword', searchKeyword);
  if (albumSort) params.append('sort_by', albumSort);

  return axios.get(`${serverApi}/api/music/my/album/bundle/list?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * 앨범 정보 수정 API 호출 함수
 * param {string} albumId - 앨범 ID
 * param {FormData} formData - 수정할 앨범 정보
 * param {string} token - 인증 토큰
 * returns {Promise} axios PUT 요청 반환
 */
export const updateAlbumsList = async (albumId, formData, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  for (let [key, value] of formData.entries()) {
  }

  try {
    const response = await axios.post(`${serverApi}/api/music/album/bundle/${albumId}`, formData, {
      headers,
    });
    return response;
  } catch (error) {
    console.error('API 호출 실패:', error);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    throw error;
  }
};

/**
 * 앨범 삭제 API 호출 함수
 * param {string} albumId - 삭제할 앨범 ID
 * param {string} token - 인증 토큰
 * returns {Promise} axios DELETE 요청 반환
 */
export const deleteAlbumsList = async (albumId, token) => {
  return axios.delete(`${serverApi}/api/music/album/bundle/${albumId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
