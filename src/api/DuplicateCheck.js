// src/api/duplicateCheck.js
import axios from "axios";

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 아티스트 이름 중복 검사 API 호출 함수
 * @param {string} artistName - 검사할 아티스트 이름
 * @param {string} token - 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */
export const checkArtistName = async (artistName, token) => {
  return axios.get(`${serverApi}/api/user/name/check?name=${artistName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * 이메일 중복 검사 API 호출 함수
 * @param {string} email - 검사할 이메일 주소
 * @param {string} token - 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */
export const checkEmail = async (email, token) => {
  return axios.get(`${serverApi}/api/user/email/check?email=${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
