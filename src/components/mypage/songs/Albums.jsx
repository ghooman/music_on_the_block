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
import AlbumCollectionDetailsModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionDetailsModal';
import AlbumCollectionDeleteConfirmModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionDeleteConfirmModal';
import AlbumCollectionCreateEditModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionCreateEditModal';
import NoneContent from '../../../components/unit/NoneContent';
import Loading from '../../../components/IntroLogo2';

import { createAlbumsList, updateAlbumsList, deleteAlbumsList } from '../../../api/AlbumsListApi';

import NoDataImage from '../../../assets/images/mypage/albums-no-data.svg';
import subBannerImage4 from '../../../assets/images/create/subbanner-bg4.png';

import './Albums.scss';
import SuccessModal from '../../modal/SuccessModal';
import ErrorModal from '../../modal/ErrorModal';

const serverApi = process.env.REACT_APP_SERVER_API;

const Albums = ({ username, isMyProfile }) => {
  const { token, walletAddress } = useContext(AuthContext);
  const { address } = walletAddress || {};

  const [searchParams] = useSearchParams();

  const [details, setDetails] = useState(null);
  const [edit, setEdit] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [create, setCreate] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const albumSort = searchParams.get('album_sort');
  const page = searchParams.get('page');
  const search = searchParams.get('search') || '';

  const navigate = useNavigate();

  //======================
  // Fetch
  //======================
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
  // 앨범 생성 및 에딧
  //======================
  const handleCreateAndEdit = async ({ image, name, id }) => {
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

      if (edit) {
        await updateAlbumsList(edit.id, formData, token);
        setSuccessMessage('Album update success!');
      } else if (create) {
        await createAlbumsList(formData, token);
        setSuccessMessage('Album create success!');
      }
    } catch (e) {
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //======================
  // 앨범 삭제
  //======================
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteAlbumsList(deleteData.id, token);
      setSuccessMessage('Album delete success!');
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
                target="Album"
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
      {/**
       * ===============
       * 모달
       * ===============
       */}
      {successMessage && (
        <SuccessModal
          setShowSuccessModal={() => {
            setEdit(null);
            setCreate(false);
            setDeleteData(null);
            setSuccessMessage(false);
            refetch();
          }}
          content={successMessage}
          title="Success"
        />
      )}
      {errorMessage && (
        <ErrorModal
          setShowErrorModal={setErrorMessage}
          message={errorMessage}
          button={true}
          //
        />
      )}

      {!successMessage && !errorMessage && (
        <>
          {create && (
            <AlbumCollectionCreateEditModal
              target="Album"
              handleClose={() => setCreate(false)}
              handleCreate={({ image, name }) => handleCreateAndEdit({ image, name })}
              loading={isLoading}
            />
          )}
          {edit && (
            <AlbumCollectionCreateEditModal
              target="Album"
              handleClose={() => setEdit(null)}
              handleEdit={({ image, name }) => handleCreateAndEdit({ image, name, id: edit?.id })}
              editData={{ image: edit.cover_image, name: edit.album_name }}
              loading={isLoading}
            />
          )}
          {deleteData && (
            <AlbumCollectionDeleteConfirmModal
              name={deleteData?.album_name}
              handleClose={() => setDeleteData(null)}
              handleDelete={() => handleDelete()}
              loading={isLoading}
            />
          )}
          {details && (
            <AlbumCollectionDetailsModal
              handleClose={() => setDetails(null)}
              name={details?.album_name}
              artist={details?.name}
              count={details?.song_cnt}
              onEditClick={() => {
                const copy = { ...details };
                setDetails(null);
                setEdit(copy);
              }}
              onDeleteClick={() => {
                const copy = { ...details };
                setDetails(null);
                setDeleteData(copy);
              }}
              onNavigate={() => {}}
            />
          )}
        </>
      )}

      {albumsListLoading && <Loading />}
    </div>
  );
};

export default Albums;
