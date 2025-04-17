import axios from 'axios';
const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 각 분야별 top(좋아요, 코멘트, 플레이) 앨범 리스트를 받는 API 호출 함수
 * @param  token - 인증 토큰
 * @returns {Promise} axios GET 요청 반환
 */
export const getReleaseAndUnReleaseSongData = async ({ token, page, sort_by, search_keyword, type }) => {
    if (type === 'Unreleased songs' || type === 'Released songs') {
        const path = type === 'Unreleased songs' ? 'unrelease' : 'release';
        return axios.get(`${serverApi}/api/music/my/${path}/list`, {
            params: {
                page,
                sort_by,
                search_keyword,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } else {
        console.warn('올바른 type을 작성해주세요 (unrelease, release)');
    }
};
