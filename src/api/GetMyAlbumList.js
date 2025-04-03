import axios from "axios";

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 최다 좋아요 받은 API 호출 함수
 * @param {string} wallet_address - 좋아요 기능 확인용 지갑 주소
 * @param {string} page - 페이지 번호 현재는 1로 고정
 * @returns {Promise} axios GET 요청 반환
 */
export const getBigLikeMyAlbum = async (walletAddress) => {
  return axios.get(
    `${serverApi}/api/music/big/like/list?page=${1}&wallet_address=${
      walletAddress?.address
    }`,
    {}
  );
};
