import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {number | string} page : 페이지
 * @param {string} search_keyword : 검색어
 * @param {string} critic : 심사위원 이름
 * @param {string} sort_by : 정렬
 * @returns
 */
export const getEvaluationList = async ({ page, search_keyword, critic, sort_by }) => {
  critic = critic === 'All' ? null : critic;

  try {
    const res = await axios.get(`${serverApi}/api/music/evaluation/list`, {
      params: {
        page,
        search_keyword,
        critic,
        sort_by,
      },
    });
    return res.data;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

/**
 *
 * @param {string} critic : 심사위원 이름
 * @returns
 */
export const getCriticEvaluationList = async ({ critic }) => {
  try {
    const res = await axios.get(`${serverApi}/api/music/evaluation/critic/list?critic=${critic}`);
    return res.data;
  } catch (e) {
    if (e?.response?.data?.detail === 'No Song Evaluation') return;
    console.error(e);
  }
};
