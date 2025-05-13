// React & Routing
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

// Context
import { AuthContext } from '../../../contexts/AuthContext';

// Components - Layout & UI
import SubCategories from '../../unit/SubCategories';
import NftItems from './NftItems';
import History from './History';
import Collections from './Collections';

// Assets & Styles
import './NFTs.scss';

const subCategoryList = [
  { name: 'NFT items', preparing: false },
  { name: 'Collections', preparing: false },
  { name: 'History', preparing: false },
];

/**
 *
 * @param {string} username : 유저네임
 * @param {boolean} isMyProfile : 나의 프로필인지 남의 프로필인지 확인하는 프롭스
 * @returns
 */
const NftMarketPlace = ({ username, isMyProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { token } = useContext(AuthContext);
  const usernameQuery = searchParams.get('username');
  const tab = searchParams.get('tab') || subCategoryList?.[0].name;

  return (
    <div className="mypage__nfts">
      <SubCategories
        categories={subCategoryList}
        handler={category => {
          if (category === tab) return;
          setSearchParams({
            category: 'NFTs',
            tab: category,
            ...(usernameQuery ? { username: usernameQuery } : null),
          });
        }}
        value={tab}
      />
      {tab === 'NFT items' && (
        <NftItems token={token} username={username} isMyProfile={isMyProfile} />
      )}
      {tab === 'Collections' && (
        <Collections token={token} username={username} isMyProfile={isMyProfile} />
      )}
      {tab === 'History' && <History username={username} isMyProfile={isMyProfile} />}
    </div>
  );
};

export default NftMarketPlace;
