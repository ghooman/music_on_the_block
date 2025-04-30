import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * NFT 민팅 API 호출
 * @param {string} token - 사용자 인증 토큰
 * @param {string} song_id - 노래 ID
 * @param {string} collection_id - 컬렉션 ID
 * @returns {Promise} - API 응답 데이터
 */
export const mintNft = async (token, song_id, collection_id) => {
  try {
    const response = await axios.post(
      `${serverApi}/api/nfts/${song_id}/${collection_id}/mint`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('mintNft', response);
    return response.data;
  } catch (error) {
    console.error('민팅 에러', error);
    throw new Error(error?.response?.data?.detail || 'Error');
  }
};
