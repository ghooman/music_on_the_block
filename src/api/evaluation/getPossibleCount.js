import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {string} token
 * @returns
 */
export const getPossibleCount = async ({ token }) => {
  try {
    const res = await axios.get(`${serverApi}/api/music/evaluation/possible/cnt`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};
