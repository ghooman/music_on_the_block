// src/api/Transaction.js
import axios from 'axios';

const serverApi = process.env.REACT_APP_CREATE_SERVER_API;

/**
 * 트랜잭션 받는 API 호출 함수
 * @param {string} token - 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */
export const getTransaction = async token => {
  return axios.get(`${serverApi}/api/user/transaction`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
