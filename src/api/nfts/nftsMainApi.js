import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * NFT 민팅 API 호출
 * @returns {Promise} - API 응답 데이터
 */
export const getNftsMain = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/nfts/main`);
    console.log('getNftsMain', response.data);
    return response.data;
  } catch (error) {
    throw new Error('NFT 민팅 요청 실패');
  }
};

/**
 * NFT statistics 호출
 * @returns {Promise} - API 응답 데이터
 */
export const getNftsStatistics = async () => {
  try {
    const response = await axios.get(`${serverApi}/api/nfts/statistics`);
    console.log('getNftsStatistics');
    return response.data;
  } catch (e) {
    throw new Error('NFT Statistics 실패');
  }
};
