import axios from 'axios';

import { useCallback, useContext, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import SubCategories from '../../unit/SubCategories';
import Pagination from '../../unit/Pagination';
import UnFollowModal from '../../UnFollowModal';
import UserTable from '../../table/UserTable';
import Loading from '../../../components/IntroLogo2';

const categories = [
  { name: 'Following', preparing: false },
  { name: 'Followers', preparing: false },
];

const serverApi = process.env.REACT_APP_SERVER_API;

const Connections = () => {
  const [searchParamas, setSearchParams] = useSearchParams();
  const [unFollowUserId, setUnFollowUserId] = useState(null);

  const { token } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const page = searchParamas.get('page') || 1;
  const search = searchParamas.get('search') || '';
  const connectionsType = searchParamas.get('connections_type') || 'Following';

  const gradeFilter = searchParamas.get('grade_filter');
  const userSort = searchParamas.get('user_sort');

  const {
    data: connectionsData,
    isLoading,
    isFetching,
  } = useQuery(
    ['follow_list', token, page, search, userSort, connectionsType, gradeFilter],
    async () => {
      const path = connectionsType === 'Following' ? 'following' : 'follower';
      const res = await axios.get(`${serverApi}/api/user/my/${path}/list`, {
        params: {
          page,
          search_keyword: search,
          sort_by: userSort,
          user_rating: gradeFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, enabled: !!token }
  );

  //====================
  // 낙관적 업데이트 함수
  //====================
  const queryUpdate = id => {
    queryClient.setQueryData(
      ['follow_list', token, page, search, userSort, connectionsType, gradeFilter],
      prev => {
        if (!prev?.data_list) return prev;

        const newDataList = prev.data_list.map(user => {
          if (user.user_id === id) {
            return { ...user, is_follow: !user.is_follow };
          }
          return user;
        });

        return {
          ...prev,
          data_list: [...newDataList],
        };
      }
    );
  };

  //====================
  // 핸들 팔로잉
  //====================

  const handleFollowing = useCallback(
    async id => {
      try {
        const res = await axios.post(`${serverApi}/api/user/${id}/follow`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        queryUpdate(id);
      } catch (e) {
        console.error(e);
      }
    },
    [queryUpdate]
  );

  //=====================
  // 핸들 언팔로잉
  //=====================

  const handleUnfollowing = useCallback(async () => {
    try {
      const res = await axios.post(`${serverApi}/api/user/${unFollowUserId}/follow/cancel`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      queryUpdate(unFollowUserId);
    } catch (e) {
      console.error(e);
    }
  }, [unFollowUserId]);

  return (
    <div className="connections">
      <ContentWrap title="Connections">
        <SubCategories
          categories={categories}
          handler={value =>
            setSearchParams(prev => {
              const { collection_sort, search, ...rest } = Object.fromEntries(prev);
              return { ...rest, connections_type: value, page: 1 };
            })
          }
          value={connectionsType}
        />
        <ContentWrap.SubWrap gap={8}>
          <Filter userSort={true} gradeFilter={true} />
          <Search placeholder="Search by Artist name..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <UserTable
          userList={connectionsData?.data_list}
          followOption={connectionsType === 'Followers'}
          unFollowOption={connectionsType === 'Following'}
          handleFollowing={id => handleFollowing(id)}
          handleUnFollowing={id => setUnFollowUserId(id)}
        />
        <Pagination totalCount={connectionsData?.total_cnt} viewCount={10} page={page} />
      </ContentWrap>
      {unFollowUserId && (
        <UnFollowModal
          setUnFollowModal={setUnFollowUserId}
          profileData={unFollowUserId}
          handleClick={handleUnfollowing}
        />
      )}
      {(isFetching || isLoading) && <Loading />}
    </div>
  );
};

export default Connections;
