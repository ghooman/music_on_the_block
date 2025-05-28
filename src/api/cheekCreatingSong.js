// api/cheekCreatingSong.js
import axios from 'axios';
const serverApi = process.env.REACT_APP_SERVER_API;

export const checkCreatingSong = async song_id => {
  const response = await axios.get(`${serverApi}/api/music/${song_id}/fail/check`);
  return response.data;
};
