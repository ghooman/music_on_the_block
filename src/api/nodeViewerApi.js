// api/nodeViewerApi.js
import axios from 'axios';
import { useState } from 'react';
const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 유저의 지갑주소 정보 등록
 * @param  token - 인증 토큰
 * @param  walletAddress - 지갑주소
 * @param walletName - 지갑이름
 * @returns {Promise} axios POST 요청 반환
 */
export const postNodeViewer = async (token, walletAddress, walletName) => {
  const res = await axios.post(
    `${serverApi}/api/user/wallet/address`,
    {
      wallet_address: walletAddress,
      wallet_name: walletName,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

/**
 * 유저의 지갑주소 정보 삭제
 * @param  token - 인증 토큰
 * @param id - 지갑주소 아이디
 * @returns {Promise} axios GET 요청 반환
 */
export const deleteNodeViewer = async (token, id) => {
  const res = await axios.delete(`${serverApi}/api/user/wallet/address/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

/**
 * 유저의 지갑주소 정보 조회
 * @param  token - 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */

export const getNodeViewer = async token => {
  const res = await axios.get(`${serverApi}/api/user/wallet/address`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
