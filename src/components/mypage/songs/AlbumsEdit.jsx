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
import ErrorModal from '../../modal/ErrorModal';

import lyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import coverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

import './AlbumsEdit.scss';
import { useTranslation } from 'react-i18next';

const subCategoryList = [
  { name: 'AI Lyrics & Songwriting', image: lyricSongwritingIcon, preparing: false },
  { name: 'AI Singing Evaluation', image: coverCreationIcon, preparing: true },
];

const dataCategoryList = ['My Songs', 'Liked Songs', 'Following'];

const serverApi = process.env.REACT_APP_SERVER_API;

const AlbumsEdit = () => {
  const { t } = useTranslation('album_collection');

  const [availableList, setAvailableList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [albumName, setAlbumName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
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
      alert(e?.response?.data?.detail || e.message);
      navigate('/');
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
        url = '/api/music/my/like/list/no/paging';
        break;
      case 'Following':
        url = '/api/music/my/following/list/no/paging';
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
      setErrorMessage(e?.response?.data?.detail || e?.message);
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
      setErrorMessage(e?.response?.data?.detail || e?.message);
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
    <>
      <div className="albums-edit">
        <ContentWrap ontentWrap border={false} style={{ padding: 0 }}>
          <ContentWrap.SubWrap gap={40}>
            <h1 className="albums-edit__title">{t('Edit Album Songs')}</h1>
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
                {t(category)}
              </button>
            ))}
          </div>
          <SubCategories
            categories={subCategoryList}
            value={subCategoryList?.[0]?.name}
            translateFn={t}
          />
          <ContentWrap.SubWrap gap={8}>
            <Filter songsSort={true} />
            <Search placeholder="Search by artist name or song name" />
          </ContentWrap.SubWrap>
          <AlbumCollectionEditList
            availableList={availableList}
            setAvailableList={setAvailableList}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            target="Album"
          />
          <button className="albums-edit__edit-button" onClick={() => update()}>
            {t('Edit')}
          </button>
        </ContentWrap>
      </div>
      {errorMessage && (
        <ErrorModal setShowErrorModal={setErrorMessage} message={errorMessage} button />
      )}
    </>
  );
};

export default AlbumsEdit;
