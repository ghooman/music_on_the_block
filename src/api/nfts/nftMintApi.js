import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * NFT 민팅 API 호출
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} - API 응답 데이터
 */
export const mintNft = async token => {
  try {
    const response = await axios.post(
      `${serverApi}/api/nft/mint`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw new Error('NFT 민팅 요청 실패');
  }
};
