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

//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
//=============================
// 변경 이전

// import { useState, useContext } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import { useQuery } from 'react-query';

// // 컴포넌트 임포트
// import Categories from '../components/nft/Categories';
// import ContentWrap from '../components/unit/ContentWrap';
// import { NftItemList } from '../components/nft/NftItem';
// import { NftGraph } from '../components/nft/NftGraph';
// import { NftOverview, NftOverviewItem } from '../components/nft/NftOverview';
// import Pagination from '../components/unit/Pagination';
// import Filter from '../components/unit/Filter';
// import Search from '../components/unit/Search';
// import SubCategories from '../components/unit/SubCategories';
// import CollectionHistoryTable from '../components/table/CollectionHistoryTable';
// import Loading from '../components/IntroLogo2';

// // API 임포트
// import {
//   getNftCollectionDetail,
//   getNftCollectionOverview,
//   getNftCollectionNftList,
//   getNftCollectionHistory,
//   likeNftCollection,
//   likeNftCollectionCancel,
// } from '../api/nfts/nftCollectionsApi';

// // 컨텍스트 임포트
// import { AuthContext } from '../contexts/AuthContext';

// // 에셋 임포트
// import likeImage from '../assets/images/like-icon/like-icon-on.svg';
// import unLikeImage from '../assets/images/like-icon/like-icon.svg';
// import defaultCoverImg from '../assets/images/header/logo-png.png';

// // 유틸 함수 임포트
// import { formatLocalTime } from '../utils/getFormattedTime';

// // 스타일 임포트
// import '../styles/CollectionDetail.scss';

// /**
//  * 컬렉션 상세 정보 컴포넌트
//  */
// const CollectionDetail = () => {
//   // 상태 관리
//   const [selectCategory, setSelectCategory] = useState('Overview');

//   // URL 파라미터
//   const { id } = useParams();
//   const [searchParams, setSearchParams] = useSearchParams();

//   // 컨텍스트 사용
//   const { token, walletAddress } = useContext(AuthContext);

//   // 컬렉션 상세 정보 조회
//   const { data: collectionDetail, refetch: refetchCollectionDetail } = useQuery(
//     ['collectionDetail', id, walletAddress?.address],
//     async () => {
//       const response = await getNftCollectionDetail({ id, wallet_address: walletAddress?.address });
//       return response.data;
//     }
//   );

//   // 컬렉션 좋아요, 싫어요 기능
//   const toggleLike = async () => {
//     if (!token || !walletAddress) return;
//     try {
//       if (collectionDetail?.is_like) {
//         await likeNftCollectionCancel({ id, wallet_address: walletAddress.address, token });
//       } else {
//         await likeNftCollection({ id, wallet_address: walletAddress.address, token });
//       }
//       // 좋아요 상태 갱신
//       refetchCollectionDetail();
//     } catch (err) {
//       console.error('like toggle failed', err);
//     }
//   };

//   /**
//    * 카테고리 변경 핸들러 - 탭 변경 시 파라미터 초기화
//    */
//   const handleCategoryChange = category => {
//     setSelectCategory(category);
//     // 탭 변경 시 검색 파라미터 초기화 (id는 유지)
//     setSearchParams({}, { replace: true });
//   };

//   return (
//     <div className="collection-detail">
//       <CollectionInfo collectionDetail={collectionDetail} onLikeToggle={toggleLike} />
//       <Categories
//         categories={['Overview', 'NFT Items', 'History']}
//         value={selectCategory}
//         onClick={handleCategoryChange}
//       />
//       {selectCategory === 'Overview' && <Overview id={id} />}
//       {selectCategory === 'NFT Items' && <NFTItems id={id} />}
//       {selectCategory === 'History' && <History id={id} />}
//     </div>
//   );
// };

// /**
//  * 컬렉션 기본 정보 컴포넌트
//  */
// const CollectionInfo = ({ collectionDetail, onLikeToggle }) => {
//   return (
//     <div className="collection-detail-info-wrap">
//       <div className="collection-detail-info">
//         <div className="collection-detail-info__data">
//           <img
//             className="collection-detail-info__data--image"
//             src={collectionDetail?.image}
//             alt="images"
//           />
//           <div className="collection-detail-info__data--texts">
//             <h1 className="texts__title">{collectionDetail?.name}</h1>
//             <div className="texts__user">
//               <img
//                 className="texts__user--image"
//                 src={collectionDetail?.user_profile || defaultCoverImg}
//                 alt="images"
//               />
//               {collectionDetail?.user_name}
//             </div>

//             <div className="collection-detail-info__like">
//               <img
//                 src={collectionDetail?.is_like ? likeImage : unLikeImage}
//                 alt="like"
//                 onClick={onLikeToggle}
//               />
//               {collectionDetail?.like}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /**
//  * 통계 항목 컴포넌트
//  */
// CollectionInfo.StatsItem = ({ title, value, suffix }) => {
//   return (
//     <div className="stats__item">
//       <h3 className="stats__item--title">{title}</h3>
//       <div className="stats__item--value">
//         <p className="stats__item--value__text">{value}</p>
//         <p className="stats__item--value__suffix">{suffix}</p>
//       </div>
//     </div>
//   );
// };

// /**
//  * 개요 컴포넌트
//  */
// const Overview = ({ id }) => {
//   const { data: collectionOverview, isLoading } = useQuery(['collectionOverview', id], async () => {
//     const response = await getNftCollectionOverview({ id });
//     return response.data;
//   });

//   console.log(collectionOverview, '컬렉션 오버뷰');

//   return (
//     <>
//       <ContentWrap title="Overview">
//         <NftOverview title="Detail">
//           <NftOverviewItem
//             title="NFT Items"
//             value={collectionOverview?.nft_cnt?.toLocaleString() || '-'}
//           />
//           <NftOverviewItem
//             title="Number of Transactions"
//             value={collectionOverview?.transaction_cnt?.toLocaleString() || '-'}
//           />
//           <NftOverviewItem
//             title="Total Volume"
//             value={
//               collectionOverview?.total_transaction_price
//                 ? `${collectionOverview?.total_transaction_price?.toLocaleString()}`
//                 : '-'
//             }
//           />
//         </NftOverview>
//         <NftOverview title="Price Informations">
//           <NftOverviewItem
//             title="Lowest Price"
//             value={
//               collectionOverview?.min_price
//                 ? `${collectionOverview?.min_price?.toLocaleString()} ${
//                     collectionOverview?.min_price_token || ''
//                   }`
//                 : '-'
//             }
//             subValue={
//               collectionOverview?.min_price_dollar
//                 ? `$ ${collectionOverview?.min_price_dollar}`
//                 : ''
//             }
//           />
//           <NftOverviewItem
//             title="Highest Price"
//             value={
//               collectionOverview?.max_price
//                 ? `${collectionOverview?.max_price?.toLocaleString()} ${
//                     collectionOverview?.max_price_token
//                   }`
//                 : '-'
//             }
//             subValue={
//               collectionOverview?.max_price_dollar
//                 ? `$ ${collectionOverview?.max_price_dollar}`
//                 : ''
//             }
//           />
//           <NftOverviewItem
//             title="Average Price"
//             value={
//               collectionOverview?.avg_transaction_price
//                 ? `${collectionOverview?.avg_transaction_price?.toLocaleString()}`
//                 : '-'
//             }
//           />
//           <NftOverviewItem
//             title="Recent Transaction Date"
//             value={
//               collectionOverview?.last_transaction_date
//                 ? formatLocalTime(collectionOverview?.last_transaction_date)
//                 : '-'
//             }
//             isLong
//           />
//         </NftOverview>
//       </ContentWrap>
//       <ContentWrap title="Graph List">
//         <NftGraph
//           barTitle="Number of Transactions"
//           barGraphData={collectionOverview?.total_transaction_price_progress}
//           lineTitle="NFT Price Change Trend"
//           lineGraphData={collectionOverview?.avg_transaction_price_progress}
//         />
//       </ContentWrap>
//       <ContentWrap title="Top NFTs in this Collection">
//         <NftItemList data={collectionOverview?.popular_list} />
//       </ContentWrap>
//       {isLoading && <Loading />}
//     </>
//   );
// };

// /**
//  * NFT 아이템 컴포넌트
//  */
// const NFTItems = ({ id }) => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const subCategoryList = [{ name: 'All' }, { name: 'Unlisted' }, { name: 'Listed' }];
//   // const [selected, setSelected] = useState(subCategoryList[0].name);

//   // URL 파라미터
//   const page = searchParams.get('page') || 1;
//   const search = searchParams.get('search');
//   const grade_filter = searchParams.get('grade_filter');
//   const token_filter = searchParams.get('token_filter');
//   const songs_sort = searchParams.get('songs_sort');
//   const now_sales_status = searchParams.get('now_sales_status') || 'All';

//   /**
//    * 서브 카테고리 선택 핸들러
//    */
//   const handleSubCategory = categoryName => {
//     setSearchParams(
//       prev => {
//         const { search, ...rest } = Object.fromEntries(prev);
//         return { ...rest, now_sales_status: categoryName, page: 1 };
//       },
//       { replace: true }
//     );
//   };

//   const { data, isLoading } = useQuery(
//     [
//       'collection_nft_list_data',
//       id,
//       page,
//       search,
//       grade_filter,
//       token_filter,
//       songs_sort,
//       now_sales_status,
//     ],
//     async () => {
//       const res = await getNftCollectionNftList({
//         id: id,
//         search_keyword: search,
//         nft_rating: grade_filter,
//         sales_token: token_filter,
//         sort_by: songs_sort,
//         now_sales_status: now_sales_status,
//       });
//       return res.data;
//     }
//   );

//   return (
//     <ContentWrap title="NFT Items">
//       {isLoading && <Loading />}
//       <ContentWrap.SubWrap gap={8}>
//         <SubCategories
//           categories={subCategoryList}
//           handler={handleSubCategory}
//           value={now_sales_status}
//         />
//         <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
//         <Search placeholder="Search" />
//       </ContentWrap.SubWrap>
//       <NftItemList data={data?.data_list || []} />
//       <Pagination totalCount={data?.total_cnt} viewCount={12} page={page} />
//     </ContentWrap>
//   );
// };

// /**
//  * 히스토리 컴포넌트
//  */
// const History = ({ id }) => {
//   const [searchParams] = useSearchParams();

//   // URL 파라미터
//   const page = searchParams.get('page') || 1;
//   const search = searchParams.get('search');
//   const grade_filter = searchParams.get('grade_filter');
//   const token_filter = searchParams.get('token_filter');
//   const songs_sort = searchParams.get('songs_sort');

//   /**
//    * 컬렉션 활동 기록 조회
//    */
//   const { data, isLoading } = useQuery(
//     ['collection_history_data', id, page, search, grade_filter, token_filter, songs_sort],
//     async () => {
//       const res = await getNftCollectionHistory({
//         id: id,
//         page: page,
//         search_keyword: search,
//         nft_rating: grade_filter,
//         sort_by: songs_sort,
//         sales_token: token_filter,
//       });
//       return res.data;
//     }
//   );

//   return (
//     <ContentWrap title="History">
//       {isLoading && <Loading />}
//       <ContentWrap.SubWrap gap={8}>
//         <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
//         <Search placeholder="Search" />
//         <CollectionHistoryTable data={data?.data_list} />
//       </ContentWrap.SubWrap>
//       <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
//     </ContentWrap>
//   );
// };

// export default CollectionDetail;
