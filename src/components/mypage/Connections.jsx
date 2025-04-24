import { useCallback, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import axios from 'axios';

import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';
import UnFollowModal from '../UnFollowModal';
import UserTable from '../table/UserTable';
import Loading from '../../components/IntroLogo2';

import './Connections.scss';

import { AuthContext } from '../../contexts/AuthContext';

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
  const connectionsSort = searchParamas.get('connections_sort') || 'Latest';
  const connectionsType = searchParamas.get('connections_type') || 'Following';

  const {
    data: connectionsData,
    isLoading,
    isFetching,
  } = useQuery(
    ['follow_list', { token, page, search, connectionsSort, connectionsType }],
    async () => {
      const path = connectionsType === 'Following' ? 'following' : 'follower';
      const res = await axios.get(`${serverApi}/api/user/my/${path}/list`, {
        params: {
          page,
          search_keyword: search,
          sort_by: connectionsSort,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, enabled: !!token }
  );

  console.log(connectionsData, '커넥션 데이터');

  //====================
  // 낙관적 업데이트 함수
  //====================
  const queryUpdate = id => {
    queryClient.setQueryData(
      ['follow_list', { token, page, search, connectionsSort, connectionsType }],
      prevData => {
        const { data_list } = prevData;
        console.log(data_list);
        const copy = [...data_list];
        copy.forEach(user => {
          if (user.user_id === id) {
            user.is_follow = !user.is_follow;
          }
        });
        prevData.data_list = copy;
        return prevData;
      }
    );
  };

  //====================
  // 핸들 팔로잉
  //====================

  const handleFollowing = useCallback(async id => {
    try {
      const res = await axios.post(`${serverApi}/api/user/${id}/follow`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      queryUpdate(id);
      console.log('성공');
    } catch (e) {
      console.error(e);
    }
  }, []);

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
      console.log('성공');
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
              const { connections_sort, search, ...rest } = Object.fromEntries(prev);
              return { ...rest, connections_type: value, page: 1 };
            })
          }
          value={connectionsType}
        />
        <ContentWrap.SubWrap gap={8}>
          <Filter connectionsSort={true} />
          <Search placeholder="Search by Artist name..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        {/* <AlbumsTable /> */}
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
