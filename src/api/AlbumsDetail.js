import axios from "axios";

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 앨범 번들 정보 조회 API 호출 함수
 * @param {number} bundle_id - 앨범 번들 ID
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */
export const getMyAlbumBundleInfo = async (bundle_id, token) => {
  console.log("bundle_id", bundle_id);
  try {
    const response = await axios.get(
      `${serverApi}/api/music/my/album/bundle/${bundle_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
