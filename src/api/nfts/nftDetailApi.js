import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

export const getNftDetail = async ({ nft_id, wallet_address }) => {
  try {
    const res = await axios.get(
      `${serverApi}/api/nfts/${nft_id}/detail?wallet_address=${wallet_address}`
    );
    console.log('getNftDetail', res);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getNftTransactions = async song_id => {
  try {
    const res = await axios.get(`${serverApi}/api/music/${song_id}/all/transactions`);
    console.log('getNftTransactions', getNftTransactions);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getNftOverview = async ({ nft_id }) => {
  try {
    const res = await axios.get(`${serverApi}/api/nfts/${nft_id}/overview`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getNftStatistics = async ({ nft_id }) => {
  try {
    const res = await axios.get(`${serverApi}/api/nfts/${nft_id}/statistics?page=1`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getNftsHistory = async ({ nft_id, page, sort_by, search_keyword, sales_token }) => {
  try {
    const res = await axios.get(`${serverApi}/api/nfts/${nft_id}/activities`, {
      params: {
        page: page,
        sort_by: sort_by,
        search_keyword: search_keyword,
        sales_token: sales_token,
      },
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};
