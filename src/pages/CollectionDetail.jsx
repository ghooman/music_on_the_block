import { useInfiniteQuery, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';

import Loading from '../components/IntroLogo2';
import AlbumCollectionDetails from '../components/mypage/albumsAndCollectionsComponents/AlbumCollectionDetails';
import AlbumCollectionCreateEditModal from '../components/mypage/albumsAndCollectionsComponents/modals/AlbumCollectionCreateEditModal';
import AlbumCollectionDeleteConfirmModal from '../components/mypage/albumsAndCollectionsComponents/modals/AlbumCollectionDeleteConfirmModal';
import ErrorModal from '../components/modal/ErrorModal';
import SuccessModal from '../components/modal/SuccessModal';

import {
  deleteNftCollection,
  getNftCollectionDetail,
  updateNftCollection,
} from '../api/nfts/nftCollectionsApi';
import { AuthContext } from '../contexts/AuthContext';

const CollectionDetail = () => {
  const [modalMode, setModalMode] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { token, walletAddress } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  //==============
  // Fetch 컬렉션 디테일
  //==============
  const {
    data: detailData,
    refetch,
    isFetching: detailLoading,
  } = useQuery(
    ['collection_detail', id, walletAddress?.address],
    async () => {
      const res = await getNftCollectionDetail({ id, wallet_address: walletAddress?.address });
      console.log(res.data, '올 아이템');
      return res.data;
    },
    {
      enabled: !!id,
    }
  );

  //==============
  // 컬렉션 수정
  //==============
  const handleCollectionEdit = async ({ image, name }) => {
    const formData = new FormData();
    formData.append('payload', JSON.stringify({ name }));
    formData.append('image', image);
    try {
      setIsLoading(true);
      await updateNftCollection(token, formData, detailData.id);
      setSuccessMessage('Collections update success!');
      return;
    } catch (e) {
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //==============
  // 컬렉션 삭제
  //==============
  const handleCollectionDelete = async () => {
    try {
      setIsLoading(true);
      await deleteNftCollection(token, detailData?.id);
      setSuccessMessage('Collections delete success!');
    } catch (e) {
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (detailLoading) {
    return <Loading />;
  }

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
              navigate(`/my-page?category=NFTs&tab=Collections&page=1`);
            }
          }}
          //
        />
      )}
      {!errorMessage && !successMessage && (
        <>
          {modalMode === 'delete' && (
            <AlbumCollectionDeleteConfirmModal
              name={detailData?.name}
              loading={isLoading}
              handleDelete={() => handleCollectionDelete()}
              handleClose={() => {
                setModalMode('edit');
              }}
            />
          )}

          {modalMode === 'edit' && (
            <AlbumCollectionCreateEditModal
              target="Collection"
              editData={{ image: detailData?.image, name: detailData?.name }}
              handleEdit={({ image, name }) => handleCollectionEdit({ image, name })}
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
        userImage={detailData?.user_profile}
        userName={detailData?.user_name}
        coverImage={detailData?.image}
        name={detailData?.name}
        isOwner={detailData?.is_owner}
        count={detailData?.nft_cnt || 0}
        dataList={detailData?.nft_list}
        id={id}
        handleEdit={() => setModalMode('edit')}
        target="Collection"
      />
    </>
  );
};

export default CollectionDetail;
