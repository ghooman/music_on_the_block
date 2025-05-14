import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';

import ErrorModal from '../../modal/ErrorModal';
import SuccessModal from '../../modal/SuccessModal';
import AlbumCollectionDetails from '../albumsAndCollectionsComponents/AlbumCollectionDetails';
import AlbumCollectionCreateEditModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionCreateEditModal';
import Loading from '../../IntroLogo2';

import './AlbumsDetail.scss';

import { getAlbumBundleDetail } from '../../../api/AlbumsDetail';
import { AuthContext } from '../../../contexts/AuthContext';
import { deleteAlbumsList, updateAlbumsList } from '../../../api/AlbumsListApi';
import AlbumCollectionDeleteConfirmModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionDeleteConfirmModal';

const AlbumsDetail = () => {
  const [modalMode, setModalMode] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const { token, walletAddress } = useContext(AuthContext);
  const { address } = walletAddress || '';
  const navigate = useNavigate();

  //====================
  // Fetch
  //====================
  const {
    data: albumBundleInfo,

    isFetching,
    refetch,
  } = useQuery(['album_bundle_detail', { id, address }], async () => {
    return await getAlbumBundleDetail({ bundle_id: id, address: address });
  });

  //====================
  // 앨범 수정
  //====================
  const handeAlbumEdit = async ({ image, name }) => {
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
      await updateAlbumsList(id, formData, token);
      setSuccessMessage('Album update success!');
    } catch (e) {
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //====================
  // 앨범 삭제
  //====================
  const handleAlbumDelete = async () => {
    try {
      setIsLoading(true);
      await deleteAlbumsList(id, token);
      setSuccessMessage('Album delete success!');
    } catch (e) {
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loading />;
  return (
    <>
      {errorMessage && (
        <ErrorModal
          setShowErrorModal={setErrorMessage}
          message={errorMessage}
          button
          //
        />
      )}
      {successMessage && (
        <SuccessModal
          setShowSuccessModal={setSuccessMessage}
          content={successMessage}
          onSuccess={() => {
            if (modalMode === 'edit') {
              setModalMode('');
              refetch();
            } else if (modalMode === 'delete') {
              navigate(`/my-page?category=Songs&page=1&tab=Albums`);
            }
          }}
          //
        />
      )}

      {!errorMessage && !successMessage && (
        <>
          {modalMode === 'delete' && (
            <AlbumCollectionDeleteConfirmModal
              name={albumBundleInfo?.album_name}
              loading={isLoading}
              handleDelete={() => handleAlbumDelete()}
              handleClose={() => {
                setModalMode('edit');
              }}
            />
          )}

          {modalMode === 'edit' && (
            <AlbumCollectionCreateEditModal
              target="Album"
              editData={{ image: albumBundleInfo?.cover_image, name: albumBundleInfo?.album_name }}
              handleEdit={({ image, name }) => handeAlbumEdit({ image, name })}
              handleDelete={() => {
                setModalMode('delete');
              }}
              handleClose={() => setModalMode(null)}
              loading={isLoading}
            />
          )}
        </>
      )}
      <AlbumCollectionDetails
        userImage={albumBundleInfo?.user_profile}
        userName={albumBundleInfo?.name}
        coverImage={albumBundleInfo?.cover_image}
        name={albumBundleInfo?.album_name}
        isOwner={albumBundleInfo?.is_owner}
        count={albumBundleInfo?.song_cnt}
        dataList={albumBundleInfo?.song_list}
        id={id}
        target="Album"
        handleEdit={() => setModalMode('edit')}
      />
    </>
  );
};

export default AlbumsDetail;
