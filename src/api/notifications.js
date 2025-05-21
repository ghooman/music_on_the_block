// api/notifications.js
import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 알림 목록 조회
 * @param {string} token - 사용자 인증 토큰
 * @returns {Promise} - API 응답 데이터
 */
export const getNotifications = async token => {
  const response = await axios.get(`${serverApi}/api/music/user/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('getNotifications response', response.data);
  return response.data;
};
