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
  return response.data;
};

/**
 * 알림 읽었는지 post 보내는 api
 * @param {string} token - 사용자 인증 토큰
 */
export const postNotificationCheck = async token => {
  const response = await axios.post(
    `${serverApi}/api/music/user/alarm/check`,
    null, // POST 요청에서 body가 필요 없으면 null 또는 {}
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * 개별 알림 삭제
 * @param {string} token - 사용자 인증 토큰
 * @param {number} // path 알림 id
 * @query {string} // query notification_type (song,nft)
 */
export const deleteNotification = async (token, id, notification_type) => {
  console.log('token', token);

  const response = await axios.post(
    `${serverApi}/api/music/user/notification/${id}/check?notification_type=${notification_type}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * 알림 기록 전체 삭제
 * @param {string} token - 사용자 인증 토큰
 */
export const deleteAllNotifications = async token => {
  const response = await axios.post(`${serverApi}/api/user/alarm/delete`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('deleteAllNotifications', response);
  return response.data;
};
