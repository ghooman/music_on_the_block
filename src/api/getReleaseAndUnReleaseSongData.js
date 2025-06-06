import axios from 'axios';
const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 각 분야별 top(좋아요, 코멘트, 플레이) 앨범 리스트를 받는 API 호출 함수
 * @param  token - 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */
export const getReleaseAndUnReleaseSongData = async ({
  token,
  page,
  sort_by,
  search_keyword,
  type,
  rating,
  ai_service,
}) => {
  if (type === 'Unreleased' || type === 'Released') {
    const path = type === 'Unreleased' ? 'unrelease' : 'release';
    return axios.get(`${serverApi}/api/music/my/${path}/list`, {
      params: {
        page,
        sort_by,
        search_keyword,
        rating,
        ai_service,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    console.warn('올바른 type을 작성해주세요 (unrelease, release)');
  }
};
