// api/AlbumLike.js
import axios from "axios";

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 앨범 좋아요 API 호출
 * @param {string} albumId - 앨범 ID
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} - API 응답 데이터
 */
export const likeAlbum = async (albumId, token) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/music/${albumId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("likeAlbum response", response.data);
    return response.data;
  } catch (error) {
    throw new Error("앨범 좋아요 요청 실패");
  }
};

/**
 * 앨범 좋아요 취소 API 호출
 * @param {string} albumId - 앨범 ID
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} - API 응답 데이터
 */
export const cancelLikeAlbum = async (albumId, token) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/music/${albumId}/like/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("cancelLikeAlbum response", response.data);
    return response.data;
  } catch (error) {
    throw new Error("앨범 좋아요 취소 요청 실패");
  }
};
