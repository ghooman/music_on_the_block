import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { createNftCollection, getNftCollections } from '../../../api/nfts/nftCollectionsApi';

import SubBanner from '../../create/SubBanner';
import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import Pagination from '../../unit/Pagination';
import Loading from '../../IntroLogo2';
import AlbumCollectionItems from '../albumsAndCollectionsComponents/AlbumCollectionItems';
import NoneContent from '../../unit/NoneContent';

import subBannerImage4 from '../../../assets/images/create/subbanner-bg4.png';
import NoDataImage from '../../../assets/images/mypage/albums-no-data.svg';
import AlbumCollectionCreateEditModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionCreateEditModal';
import AlbumCollectionDeleteConfirmModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionDeleteConfirmModal';
import AlbumCollectionDetailsModal from '../albumsAndCollectionsComponents/modals/AlbumCollectionDetailsModal';

const Collections = ({ token, username, isMyProfile }) => {
  const [searchParams] = useSearchParams();

  const [details, setDetails] = useState(null);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const collectionSort = searchParams.get('collection_sort');

  const navigate = useNavigate();

  //================
  // Fetch
  //================
  const {
    data,
    isLoading: fetchCollectionLoading,
    refetch,
  } = useQuery(
    ['collection_data', token, page, search, collectionSort, username],
    async () => {
      const res = await getNftCollections({
        page: page,
        search_keyword: search,
        sort_by: collectionSort,
        user_name: username,
      });
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  //================
  // 컬렉션 생성 및 수정 함수
  //================
  const handleCreateAndEdit = async ({ image, name }) => {
    const formData = new FormData();
    formData.append('payload', JSON.stringify({ name }));
    formData.append('image', image);

    try {
      setIsLoading(true);
      const res = await createNftCollection(token, formData);
      refetch();
    } catch (e) {
      console.log(e);
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //================
  // 컬렉션 삭제 함수
  //================
  const handleDelete = async () => {
    try {
      setIsLoading(true);
    } catch (e) {
      console.log(e);
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data, '아옳옳');

  return (
    <>
      {isMyProfile && (
        <SubBanner>
          <SubBanner.LeftImages src={subBannerImage4} />
          <SubBanner.Title text="Create Your Own Collection" />
          <SubBanner.Message text="Bring your favofite NFT music together and curate a collection that's uniquely yours. Now's the time to show the world your taste in music!" />
          <SubBanner.Button title="Create Collection" handler={() => setCreate(true)} />
        </SubBanner>
      )}
      <ContentWrap title="Collections">
        <ContentWrap.SubWrap gap={8}>
          <Filter collectionSort={['Latest', 'Oldest', 'Most NFT Items', 'Least NFT Items']} />
          <Search placeholder="Search by Item ..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <AlbumCollectionItems>
          {data?.data_list.map(collections => (
            <React.Fragment key={collections.id}>
              <AlbumCollectionItems.Item
                name={collections?.name}
                artist={collections.user_name}
                count={collections?.nft_cnt}
                coverImage={collections?.image}
                handleNavigate={() => null}
                handleDetail={() => setDetails()}
              />
            </React.Fragment>
          ))}
        </AlbumCollectionItems>
        {(!data?.data_list || data?.data_list.length === 0) && (
          <NoneContent
            message={'There are no albums created yet.'}
            image={NoDataImage}
            height={300}
          />
        )}
        <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
        {fetchCollectionLoading && <Loading />}
      </ContentWrap>
      {details && (
        <AlbumCollectionDetailsModal
          handleClose={() => setDetails(null)}
          name={details?.name}
          artist={details?.user_name}
          count={details?.nft_cnt}
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

      {create && (
        <AlbumCollectionCreateEditModal
          handleClose={() => setCreate(false)}
          handleCreate={({ image, name }) => handleCreateAndEdit({ image, name })}
          loading={isLoading}
        />
      )}
      {edit && (
        <AlbumCollectionCreateEditModal
          handleClose={() => setEdit(null)}
          handleEdit={({ image, name }) => handleCreateAndEdit({ image, name, id: edit?.id })}
          editData={{ image: edit?.image, name: edit?.name }}
          loading={isLoading}
        />
      )}
      {deleteData && (
        <AlbumCollectionDeleteConfirmModal
          name={deleteData?.name}
          handleClose={() => setDeleteData(null)}
          handleDelete={() => handleDelete()}
          loading={isLoading}
        />
      )}
    </>
  );
};

export default Collections;
