// api/GetMyTopAlbumList.js
import axios from "axios";
const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 각 분야별 top(좋아요, 코멘트, 플레이) 앨범 리스트를 받는 API 호출 함수
 * @param  token - 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */
export const GetMyTopAlbumList = async (token) => {
  return axios.get(`${serverApi}/api/music/my/top/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
