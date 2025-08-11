// import axios, useQuery, useContext, useQueryClient, UnFollowModal, Loading 전부 ❌

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import SubCategories from '../../unit/SubCategories';
import Pagination from '../../unit/Pagination';
import UserTable from '../../table/UserTable';

const categories = [
  { name: 'Following', preparing: false },
  { name: 'Followers', preparing: false },
];

const OtherConnections = ({ ownerName = 'Username' }) => {
  const { t } = useTranslation('my_page');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const connectionsType = searchParams.get('connections_type') || 'Following';

  // --- mock data ---
  const mockList = Array.from({ length: 23 }, (_, i) => ({
    user_id: 1000 + i,
    name: `Demo User ${i + 1}`,
    profile: '',
    user_rating: ['Bronze','Silver','Gold','Platinum'][i % 4],
    is_follow: i % 3 === 0,
  }));
  const viewCount = 10;
  const totalCount = mockList.length;
  const paged = mockList.slice((page - 1) * viewCount, page * viewCount);

  const noop = () => {};

  return (
    <div className="connections">
      <ContentWrap title={`${ownerName}'s ${t('Connections')}`}>
        <SubCategories
          categories={categories}
          translateFn={t}
          handler={(value) =>
            setSearchParams(prev => {
              const obj = Object.fromEntries(prev);
              return { ...obj, connections_type: value, page: 1 };
            })
          }
          value={connectionsType}
        />

        <ContentWrap.SubWrap gap={8}>
          <Filter userSort gradeFilter />
          <Search placeholder={'Search by artist name'} reset={{ page: 1 }} />
        </ContentWrap.SubWrap>

        <UserTable
          userList={paged}
          followOption={connectionsType === 'Followers'}
          unFollowOption={connectionsType === 'Following'}
          handleFollowing={noop}
          handleUnFollowing={noop}
        />

        <Pagination
          totalCount={totalCount}
          viewCount={viewCount}
          page={page}
          setPage={(p) =>
            setSearchParams(prev => {
              const obj = Object.fromEntries(prev);
              return { ...obj, page: p };
            })
          }
        />
      </ContentWrap>
    </div>
  );
};

export default OtherConnections;
