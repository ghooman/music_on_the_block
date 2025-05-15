import { useState, useContext, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import Loading from '../../IntroLogo2';
import AlbumCollectionEditList from '../albumsAndCollectionsComponents/AlbumCollectionEditList';
import ErrorModal from '../../modal/ErrorModal';

import { AuthContext } from '../../../contexts/AuthContext';

import './CollectionsEdit.scss';
import { useInfiniteQuery } from 'react-query';
import { getNftNoCollectionNftList } from '../../../api/nfts/nftCollectionsApi';

const serverApi = process.env.REACT_APP_SERVER_API;

const CollectionsEdit = () => {
  const [availableList, setAvailableList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [collectionName, setCollectionName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { token, walletAddress } = useContext(AuthContext);
  const navigate = useNavigate();

  const search = searchParams.get('search');
  const gradeFilter = searchParams.get('grade_filter');
  const salesFilter = searchParams.get('sales_filter');

  //================
  // 컬렉션 디테일 Fetch
  //================
  const getCollectionDetail = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${serverApi}/api/nfts/collections/${id}`, {
        params: {
          wallet_address: walletAddress?.address,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data.data.is_owner) {
        alert('Invalid access!');
        navigate('/');
      }
      setSelectedList(res?.data?.data?.nft_list);
      setCollectionName(res?.data?.data?.name);
      setIsLoading(false);
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
      navigate('/');
    }
  };

  //================
  // 나의 NFT 리스트
  //================
  const {
    data: nftList,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    ['collection_nft_list', id, gradeFilter, salesFilter, search],
    async ({ pageParam = 1 }) => {
      const res = await getNftNoCollectionNftList({
        token,
        page: pageParam,
        search_keyword: search,
        nft_rating: gradeFilter,
        now_sales_status: salesFilter,
      });
      return res.data;
    },
    {
      enabled: !!id,
      getNextPageParam: (lastPage, allPages) => {
        const totalLoaded = allPages.reduce((sum, page) => sum + page.data_list?.length, 0);
        return totalLoaded < lastPage.total_cnt ? allPages?.length + 1 : undefined;
      },
    }
  );

  const infiniteScroll = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  //==================
  // 업데이트
  //==================
  const update = async () => {
    const idArray = selectedList.map(item => item.id);
    try {
      const res = await axios.post(`${serverApi}/api/nfts/collection/${id}/nft`, idArray, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/nft/collection/detail/${id}`);
    } catch (e) {
      console.log(e);
      setErrorMessage(e?.response?.data?.detail || e?.message);
    }
  };

  useEffect(() => {
    getCollectionDetail();
  }, []);

  useEffect(() => {
    const allItems = nftList?.pages?.flatMap(page => page.data_list) || [];
    setAvailableList(allItems);
  }, [nftList]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="collection-edit">
        <ContentWrap border={false} style={{ padding: 0 }}>
          <ContentWrap.SubWrap gap={40}>
            <h1 className="collection-edit__title">Edit Collection NFT Items</h1>
            <h3 className="collection-edit__collection-name">{collectionName}</h3>
          </ContentWrap.SubWrap>
          <ContentWrap.SubWrap gap={8}>
            <Filter gradeFilter={true} salesFilter={true} />
            <Search placeholder="Search" />
          </ContentWrap.SubWrap>
          <AlbumCollectionEditList
            availableList={availableList}
            setAvailableList={setAvailableList}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            infiniteScorollEvent={infiniteScroll}
            target="Collection"
          />
          <button className="collection-edit__edit-btn" onClick={update}>
            Edit
          </button>
        </ContentWrap>
      </div>
      {errorMessage && (
        <ErrorModal setShowErrorModal={setErrorMessage} message={errorMessage} button />
      )}
    </>
  );
};

export default CollectionsEdit;
