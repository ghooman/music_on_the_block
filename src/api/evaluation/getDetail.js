import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {string | number} evaluation_id : 평가 ID
 * @returns
 */
export const getEvaluationDetail = async ({ evaluation_id }) => {
  try {
    const res = await axios.get(`${serverApi}/api/music/evaluation/${evaluation_id}/detail`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

/**
 *
 * @param {string} critic : 심사위원 이름
 * @param {number | string} song_id : 노래ID
 * @returns
 */
export const getEvaluationDetailFromCriticSongId = async ({ critic, song_id }) => {
  if (!critic || !song_id) {
    alert('심사위원 및 노래 아이디는 필수입니다. getEvaluationDetailFromCriticSongId');
  }
  try {
    const res = await axios.get(`${serverApi}/api/music/${song_id}/evaluation/critic/detail`, {
      params: {
        critic,
      },
    });
    return res.data;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};
