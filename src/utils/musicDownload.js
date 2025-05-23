import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;
const { language } = navigator;

export const musicDownload = async ({ token, id, title }) => {
  try {
    const res = await axios.get(`${serverApi}/api/music/${id}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw error;
  }
};
