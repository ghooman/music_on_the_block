/**
 * @param {string} search_keyword : 검색어
 * @param {string} sort_by : 정렬
 * @param {string | number} page : 페이징
 * @param {Promise} param0
 */

import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

export const getNftsList = async ({
  page,
  sort_by,
  search_keyword,
  now_sales_status,
  ai_service,
  nft_rating,
  sales_token,
  user_name,
}) => {
  try {
    const response = await axios.get(`${serverApi}/api/nfts/list`, {
      params: {
        page,
        now_sales_status,
        ai_service,
        nft_rating,
        sales_token,
        sort_by,
        search_keyword,
        user_name,
      },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw new Error('getNftsList Error', e);
  }
};
