import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 *
 * @param {string | number} page : 페이지
 * @param {"Latest" | "Oldest" | "Highest Price" | "Lowest Price"} : 정렬
 * @param {string} search_keyword : "검색어"
 * @param {"Listed" | "Unlisted"} now_sales_status : 판매중, 등록되지 않음
 * @param {"Song" | "BGM"} ai_service : 노래냐 BGM이냐
 * @param {"New" | "Indie" | "Rising" | "Star" | "Legend"} nft_rating : nft 등급
 * @param {"MOB" | "POL" | "USDT" | "USDC"} sales_token : 토큰
 * @param {string} user_name : 유저네임
 * @returns
 */
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

/**
 *
 * @param {string | number} page : 페이지
 * @param {string} user_name : 유저네임
 * @param {string} nft_rating : 등급
 * @param {string} sales_token : 토큰 종류
 * @param {string} sort_by : 정렬
 * @param {string} search_keyword : 검색어
 * @returns
 */
export const getNftTransactionHistory = async ({
  page,
  user_name,
  nft_rating,
  ai_service,
  sales_token,
  sort_by,
  search_keyword,
  buy_sell_status,
}) => {
  try {
    const res = await axios.get(`${serverApi}/api/nfts/transaction/history`, {
      params: {
        page,
        user_name,
        nft_rating,
        ai_service,
        sales_token,
        sort_by,
        search_keyword,
        buy_sell_status,
      },
    });
    return res.data;
  } catch (e) {
    throw new Error('getNftTransactionHistory', e);
  }
};
