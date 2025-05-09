// api/checkPolygonStatus.js
import axios from 'axios';
const serverApi = process.env.REACT_APP_SERVER_API;

export const checkPolygonStatus = async () => {
  const response = await axios.get(`${serverApi}/api/polygon/status`);
  return response.data;
};
