/**
 * @param {string} search_keyword : 검색어
 * @param {string} sort_by : 정렬
 * @param {string | number} page : 페이징
 * @param {Promise} param0
 */

import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

export const getNftsList = async ({ page, sort_by, search_keyword }) => {
  try {
    const response = await axios.get(`${serverApi}/api/nfts/list`, {
      params: {
        page,
        sort_by,
        search_keyword,
      },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw new Error('getNftsList Error', e);
  }
};
