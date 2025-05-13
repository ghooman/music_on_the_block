import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getNftCollections } from '../../../api/nfts/nftCollectionsApi';

import SubBanner from '../../create/SubBanner';
import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import { CollectionItemList } from '../../nft/NftItem';
import Pagination from '../../unit/Pagination';
import Loading from '../../IntroLogo2';

import subBannerImage4 from '../../../assets/images/create/subbanner-bg4.png';

const CollectionItems = ({ token, username, isMyProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const collectionSort = searchParams.get('collection_sort');

  const { data, isLoading } = useQuery(
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

  return (
    <>
      {isMyProfile && (
        <SubBanner>
          <SubBanner.LeftImages src={subBannerImage4} />
          <SubBanner.Title text="Create Your Own Collection" />
          <SubBanner.Message text="Bring your favofite NFT music together and curate a collection that's uniquely yours. Now's the time to show the world your taste in music!" />
          <SubBanner.Button title="Create Collection" />
        </SubBanner>
      )}
      <ContentWrap title="Collections">
        <ContentWrap.SubWrap gap={8}>
          <Filter collectionSort={['Latest', 'Oldest', 'Most NFT Items', 'Least NFT Items']} />
          <Search placeholder="Search by Item ..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <CollectionItemList data={data?.data_list} />
        <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
        {isLoading && <Loading />}
      </ContentWrap>
    </>
  );
};

export default CollectionItems;
