import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';

import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import SubCategories from '../../unit/SubCategories';
import ContentWrap from '../../unit/ContentWrap';
import Loading from '../../IntroLogo2';
import AlbumCollectionEditList from '../albumsAndCollectionsComponents/AlbumCollectionEditList';

import lyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import coverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

import './AlbumsEdit.scss';

const subCategoryList = [
  { name: 'AI Lyrics & Songwriting', image: lyricSongwritingIcon, preparing: false },
  { name: 'AI Singing Evaluation', image: coverCreationIcon, preparing: true },
];

const dataCategoryList = ['My Songs', 'Liked Songs', 'Following'];

const serverApi = process.env.REACT_APP_SERVER_API;

// 데이터를 가져오기
// 가져온 데이터는 왼쪽 테이블에 뿌림
// Add 핸들러를 통해 오른쪽 테이블로 옮김
// 왼쪽 테이블에 있는 걸로다가 수정 완료!

const AlbumsEdit = () => {
  const [availableList, setAvailableList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [albumName, setAlbumName] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, walletAddress } = useContext(AuthContext);

  const search = searchParams.get('search');
  const songsFilter = searchParams.get('songs_filter') || 'My Songs';
  const songsSort = searchParams.get('songs_sort');

  //===============
  // 디테일 데이터 Fetch
  //===============
  const getDetails = async () => {
    try {
      const res = await axios.get(`${serverApi}/api/music/user/album/bundle/${id}/detail`, {
        params: {
          wallet_address: walletAddress?.address,
        },
      });

      if (res.data.is_owner === false) {
        alert('Invalid access');
        navigate('/');
        return;
      }
      setAlbumName(res.data.album_name);
      setSelectedList(res.data.song_list);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };

  //===============
  // 곡 리스트 Fetch
  //===============
  const getList = async () => {
    setIsLoading(true);
    let url;
    switch (songsFilter) {
      case 'My Songs':
        url = '/api/music/my/list/no/paging';
        break;
      case 'Liked Songs':
        url = '/api/music/my/following/list/no/paging';
        break;
      case 'Following':
        url = '/api/music/my/like/list/no/paging';
        break;
      default:
        url = '';
    }
    try {
      const res = await axios.get(`${serverApi + url}`, {
        params: {
          search_keyword: search,
          sort_by: songsSort,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  //==================
  // update Album
  //==================
  const update = async () => {
    const songIdArray = selectedList.map(item => item.id);
    try {
      const res = await axios.post(`${serverApi}/api/music/album/bundle/${id}/song`, songIdArray, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/albums-detail/${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    getList();
  }, [search, songsFilter, songsSort]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="albums-edit">
      <ContentWrap ontentWrap border={false} style={{ padding: 0 }}>
        <ContentWrap.SubWrap gap={40}>
          <h1 className="albums-edit__title">Edit Album Songs</h1>
          <h3 className="albums-edit__album-name">{albumName}</h3>
        </ContentWrap.SubWrap>
        <div className="albums-edit__category">
          {dataCategoryList.map((category, index) => (
            <button
              key={category + index}
              className={`albums-edit__category-btn ${songsFilter === category ? 'active' : ''}`}
              onClick={() => {
                setSearchParams(prev => {
                  return { songs_filter: category };
                });
              }}
            >
              {category}
            </button>
          ))}
        </div>
        <SubCategories categories={subCategoryList} value={subCategoryList?.[0]?.name} />
        <ContentWrap.SubWrap gap={8}>
          <Filter songsSort={true} />
          <Search placeholder="Search" />
        </ContentWrap.SubWrap>
        <AlbumCollectionEditList
          availableList={availableList}
          setAvailableList={setAvailableList}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          target="Album"
        />
        <button className="albums-edit__edit-button" onClick={() => update()}>
          Edit
        </button>
      </ContentWrap>
    </div>
  );
};

export default AlbumsEdit;
