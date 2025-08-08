import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * hit music list  받는 API 호출 함수
 * @param {string} wallet_address - 좋아요 기능 확인용 지갑 주소
 * @returns {Promise} axios GET 요청 반환
 */
export const getHitMusicList = async walletAddress => {
  console.log('getHitMusicList');
  return axios.get(`${serverApi}/api/music/hit/list`, {});
};
