// 📦 외부 라이브러리

import { useSearchParams } from 'react-router-dom';

// 🧩 유닛 컴포넌트
import SubCategories from '../../unit/SubCategories';
import MySongsList from './MySongsList';
import UserSongsList from './UserSongsList';

// 🎨 스타일
import './Songs.scss';
import MyFavorites from './MyFavorites';

const myPageCategories = [{ name: 'Songs' }, { name: 'Favorites' }, { name: 'Albums' }];
const userPageCategories = [{ name: 'Songs' }, { name: 'Albums' }];

const Songs = ({ token, username, isMyProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'Songs';

  if (isMyProfile) {
    return (
      <div>
        <SubCategories
          categories={myPageCategories}
          value={tab}
          handler={value =>
            setSearchParams(prev => {
              return { category: 'Songs', page: 1, tab: value };
            })
          }
        />
        {tab === 'Songs' && <MySongsList token={token} />}
        {tab === 'Favorites' && <MyFavorites />}
      </div>
    );
  } else {
    return (
      <div>
        <SubCategories
          categories={userPageCategories}
          value={tab}
          handler={value =>
            setSearchParams(prev => {
              return { category: 'Songs', page: 1, tab: value, username: username };
            })
          }
        />
        {tab === 'Songs' && <UserSongsList username={username} />}
      </div>
    );
  }
};

export default Songs;
