import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Pagination from '../../unit/Pagination';
import Search from '../../unit/Search';
import SubBanner from '../../../components/create/SubBanner';
import AlbumCollectionItems from '../albumsAndCollectionsComponents/AlbumCollectionItems';
import AlbumsCreateModal from './../albums/AlbumsCreateModal';
import AlbumsDetailsModal from './../albums/AlbumsDetailsModal';
import NoneContent from '../../../components/unit/NoneContent';
import Loading from '../../../components/IntroLogo2';

import NoDataImage from '../../../assets/images/mypage/albums-no-data.svg';
import subBannerImage4 from '../../../assets/images/create/subbanner-bg4.png';

import './Albums.scss';
import AlbumCollectionCreateEditModal from '../albumsAndCollectionsComponents/AlbumCollectionCreateEditModal';
import { createAlbumsList } from '../../../api/AlbumsListApi';

const serverApi = process.env.REACT_APP_SERVER_API;

const Albums = ({ username, isMyProfile }) => {
  const { token, walletAddress } = useContext(AuthContext);
  const { address } = walletAddress || {};

  const [searchParams] = useSearchParams();

  const [details, setDetails] = useState(null);
  const [edit, setEdit] = useState(null);
  const [create, setCreate] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const albumSort = searchParams.get('album_sort');
  const page = searchParams.get('page');
  const search = searchParams.get('search') || '';

  const navigate = useNavigate();

  const {
    data: albumsList,
    isLoading: albumsListLoading,
    refetch,
  } = useQuery(
    ['albums_data_by_username', { page, search, username, albumSort, address }],
    async () => {
      const res = await axios.get(`${serverApi}/api/music/user/album/bundle/list`, {
        params: {
          name: username,
          search_keyword: search,
          sort_by: albumSort,
          page: page,
          wallet_address: address,
        },
      });

      return res.data;
    }
  );

  //======================
  // 앨범 생성
  //======================
  const handleCreate = async ({ image, name }) => {
    const formData = new FormData();
    formData.append('cover_image', image);
    formData.append(
      'payload',
      JSON.stringify({
        album_name: name,
      })
    );
    try {
      setIsLoading(true);
      const res = await createAlbumsList(formData, token);
      if (res.status === 200) console.log('완료');
    } catch (e) {
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="albums">
      {isMyProfile && (
        <SubBanner>
          <SubBanner.LeftImages src={subBannerImage4} />
          <SubBanner.Title text="Create Your Own Album" />
          <SubBanner.Message text="Gather your favorite tracks and organise them into a single. You can showcase your musical world!" />
          <SubBanner.Button title="Create Album" handler={() => setCreate(true)} />
        </SubBanner>
      )}
      <ContentWrap title="Albums List">
        <ContentWrap.SubWrap gap={8}>
          <Filter albumSort={true} />
          <Search placeholder="Search by album name..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <AlbumCollectionItems>
          {albumsList?.data_list?.map((album, index) => (
            <React.Fragment key={album.id}>
              <AlbumCollectionItems.Item
                name={album?.album_name}
                artist={album?.name}
                count={album?.song_cnt}
                isOwner={album?.is_owner}
                coverImage={album?.cover_image}
                handleNavigate={() => navigate(`/albums-detail/${album?.id}`)}
                handleDetail={() => {
                  setDetails(album);
                }}
              />
            </React.Fragment>
          ))}
        </AlbumCollectionItems>
        {(!albumsList?.data_list || albumsList?.data_list.length === 0) && (
          <NoneContent
            message={'There are no albums created yet.'}
            image={NoDataImage}
            height={300}
          />
        )}
        <Pagination totalCount={albumsList?.total_cnt} viewCount={12} page={page} />
      </ContentWrap>
      {/* {showCreateModal && (
        <AlbumsCreateModal
          setShowCreateModal={setShowCreateModal}
          onAlbumCreated={refetch}
          status={editMode ? 'edit' : 'create'}
          albumData={editMode ? selectedAlbum : null}
        />
      )} */}
      {create && (
        <AlbumCollectionCreateEditModal
          handleClose={() => setCreate(false)}
          handleCreate={({ image, name }) => handleCreate({ image, name })}
          loading={isLoading}
        />
      )}
      {edit && (
        <AlbumCollectionCreateEditModal handleClose={() => setEdit(null)} loading={isLoading} />
      )}

      {details && (
        <AlbumsDetailsModal
          setShowDetailModal={setDetails}
          album={details}
          token={token}
          onAlbumCreated={refetch}
          onEditClick={() => {
            const copy = { ...details };
            setDetails(null);
            setEdit(copy);
          }}
        />
      )}
      {albumsListLoading && <Loading />}
    </div>
  );
};

export default Albums;
