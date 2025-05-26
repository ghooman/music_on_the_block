import axios from 'axios';
const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 좋아요 누른 음악 리스트
 * @param {string} token
 * @param {string | number} page
 * @param {string} search_keyword : 검색어
 * @param {string} sort_by : 정렬 기준
 * @param {"Song" | "BGM"} ai_service : Song & BGM
 * @param {"Minted" | "Unminted"} : 민트가 됐는지 안 됐는지
 * @returns
 */
export const getLikeList = async ({
  token,
  page,
  search_keyword,
  sort_by,
  ai_service,
  rating,
  is_minted,
}) => {
  return await axios.get(`${serverApi}/api/music/my/like/list`, {
    params: {
      page,
      search_keyword,
      sort_by,
      ai_service,
      rating,
      is_minted,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUnLikeList = () => {};
