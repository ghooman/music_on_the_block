// 📦 외부 라이브러리

import { useSearchParams } from 'react-router-dom';

// 🧩 유닛 컴포넌트
import SubCategories from '../../unit/SubCategories';
import MySongsList from './MySongsList';
import UserSongsList from './UserSongsList';
import Albums from './Albums';

// 🎨 스타일
import './Songs.scss';
import MyFavorites from './MyFavorites';

const myPageCategories = [{ name: 'Songs' }, { name: 'Favorites' }, { name: 'Albums' }];
const userPageCategories = [{ name: 'Songs' }, { name: 'Albums' }];

const Songs = ({ token, username, isMyProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'Songs';

  const categories = isMyProfile ? myPageCategories : userPageCategories;

  return (
    <div className="songs">
      <SubCategories
        categories={categories}
        value={tab}
        handler={value =>
          setSearchParams(prev => {
            return {
              category: 'Songs',
              page: 1,
              tab: value,
              ...(!isMyProfile ? { username: username } : null),
            };
          })
        }
      />

      {isMyProfile && (
        <>
          {tab === 'Songs' && <MySongsList token={token} />}
          {tab === 'Favorites' && <MyFavorites />}
          {tab === 'Albums' && <Albums username={username} isMyProfile />}
        </>
      )}
      {!isMyProfile && (
        <>
          {tab === 'Songs' && <UserSongsList username={username} />}
          {tab === 'Albums' && <Albums username={username} />}
        </>
      )}
    </div>
  );
};

export default Songs;
