import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {string} token
 * @returns
 */
export const getPossibleCount = async ({ token, song_id, critic }) => {
  if (!song_id || !critic) return;

  try {
    const res = await axios.get(
      `${serverApi}/api/music/${song_id}/evaluation/critic/possible/cnt?critic=${critic}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};
