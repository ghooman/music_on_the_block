import axios from 'axios';
const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {string} token
 * @param {number | string} page
 * @param {string} search
 * @returns
 */
export const getMyMusicList = async ({ token, page, search }) => {
    return axios.get(`${serverApi}/api/music/my/list`, {
        params: {
            page,
            search,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
