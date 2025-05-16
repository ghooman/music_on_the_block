import { useState, useContext, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import Loading from '../../IntroLogo2';
import AlbumCollectionEditList from '../albumsAndCollectionsComponents/AlbumCollectionEditList';
import ErrorModal from '../../modal/ErrorModal';
import SubCategories from '../../unit/SubCategories';

import { AuthContext } from '../../../contexts/AuthContext';
import { useInfiniteQuery } from 'react-query';
import { getNftNoCollectionNftList } from '../../../api/nfts/nftCollectionsApi';

import lyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import coverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

import './CollectionsEdit.scss';

const subCategoryList = [
  { name: 'AI Lyrics & Songwriting', image: lyricSongwritingIcon, preparing: false },
  { name: 'AI Singing Evaluation', image: coverCreationIcon, preparing: true },
];

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
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
      navigate('/');
    }
  };

  //================
  // 나의 NFT 리스트
  //================
  const getNftList = async () => {
    try {
      setIsLoading(true);
      const res = await getNftNoCollectionNftList({
        token,
        search_keyword: search,
        nft_rating: gradeFilter,
        now_sales_status: salesFilter,
      });
      setAvailableList(res.data?.data_list);
    } catch (e) {
      console.log(e);
      setErrorMessage(e?.response?.data?.detail || e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // //==================
  // // 업데이트
  // //==================
  // const update = async () => {
  //   const idArray = selectedList.map(item => item.id);
  //   try {
  //     const res = await axios.post(`${serverApi}/api/nfts/collection/${id}/nft`, idArray, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     navigate(`/nft/collection/detail/${id}`);
  //   } catch (e) {
  //     console.log(e);
  //     setErrorMessage(e?.response?.data?.detail || e?.message);
  //   }
  // };

  const customHandleAdd = async () => {
    const availableCheckedIdList = availableList?.filter(item => item.check).map(item => item.id);
    const selectedListIdArray = selectedList.map(item => item.id);
    const set = new Set([...availableCheckedIdList, ...selectedListIdArray]);
    if (availableCheckedIdList.length <= 0) return;
    await update(Array.from(set));
  };

  const customHandleDelete = async () => {
    const selectedNoneCheckedIdList = selectedList
      ?.filter(item => !item.check)
      .map(item => item.id);
    const selectedCheckedIdList = selectedList?.filter(item => item.check);
    if (selectedCheckedIdList.length <= 0) return;
    await update(selectedNoneCheckedIdList);
  };

  const update = async data => {
    try {
      await axios.post(`${serverApi}/api/nfts/collection/${id}/nft`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getNftList();
      getCollectionDetail();
    } catch (e) {
      console.log(e);
      setErrorMessage(e?.response?.data?.detail || e?.message);
    }
  };

  useEffect(() => {
    getCollectionDetail();
  }, []);

  useEffect(() => {
    getNftList();
  }, [search, gradeFilter, salesFilter]);

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
          <SubCategories categories={subCategoryList} value={subCategoryList?.[0]?.name} />
          <ContentWrap.SubWrap gap={8}>
            <Filter gradeFilter={true} salesFilter={true} />
            <Search placeholder="Search" />
          </ContentWrap.SubWrap>
          <AlbumCollectionEditList
            availableList={availableList}
            setAvailableList={setAvailableList}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            customHandleAdd={customHandleAdd}
            customHandleDelete={customHandleDelete}
            target="Collection"
          />
          <button
            className="collection-edit__edit-btn"
            // onClick={update}
            onClick={() => navigate(`/nft/collection/detail/${id}`)}
          >
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
