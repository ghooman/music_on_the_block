import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

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
    throw new Error(e);
  }
};
