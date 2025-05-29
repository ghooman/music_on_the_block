import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

export const saveEvaluationData = async ({ token, song_id, evalution_data }) => {
  if (!token) throw new Error('token');

  const res = await axios.post(`${serverApi}/api/music/${song_id}/evaluation`, evalution_data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
