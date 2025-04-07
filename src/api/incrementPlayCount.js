// api/musicApi.js
import axios from "axios";

/**
 * 트랙 재생 카운트를 증가시키는 함수입니다.
 * @param {string|number} trackId - 트랙의 ID
 * @param {string} serverApi - 서버 API URL
 * @returns {Promise<boolean>} 요청 성공 여부
 */
export const incrementPlayCount = async (trackId, serverApi) => {
  try {
    await axios.post(`${serverApi}/api/music/${trackId}/play`, {});
    console.log("POST 요청 성공");
    return true;
  } catch (error) {
    console.error("POST 요청 실패", error);
    return false;
  }
};
