import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getNftsList } from '../../../api/nfts/nftsListApi';

import ContentWrap from '../../unit/ContentWrap';
import Loading from '../../IntroLogo2';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import NftTable from '../../table/NftTable';
import Pagination from '../../unit/Pagination';
import { useTranslation } from 'react-i18next';

const nftFilterItemList = ['Listed', 'Unlisted'];

const NftItems = ({ username, isMyProfile }) => {
  const { t } = useTranslation('my_page');

  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const gradeFilter = searchParams.get('grade_filter');
  const tokenFilter = searchParams.get('token_filter');
  const nftSort = searchParams.get('nft_sort');
  const nftFilter = searchParams.get('nft_filter') || 'Listed';
  const aiServiceFilter = searchParams.get('ai_service_filter');

  const { data, isLoading, refetch } = useQuery(
    [
      'nfts_data',
      page,
      nftFilter,
      search,
      gradeFilter,
      tokenFilter,
      nftSort,
      username,
      aiServiceFilter,
    ],
    async () => {
      const res = await getNftsList({
        page: page,
        now_sales_status: nftFilter,
        ai_service: aiServiceFilter,
        search_keyword: search,
        nft_rating: gradeFilter,
        sales_token: tokenFilter,
        sort_by: nftSort,
        user_name: username,
      });
      return res.data;
    }
  );

  return (
    <>
      <ContentWrap title={t('NFTs')}>
        <div className="mypage__nfts__button-wrap">
          {nftFilterItemList.map(item => (
            <button
              key={item}
              className={`mypage__nfts__button-wrap--button ${
                nftFilter === item ? 'selected' : ''
              }`}
              onClick={() => {
                if (nftFilter === item) return;
                setSearchParams(prev => {
                  return { ...Object.fromEntries(prev), nft_filter: item };
                });
              }}
            >
              {t(item)}
            </button>
          ))}
        </div>
        <ContentWrap.SubWrap gap={8}>
          <Filter nftSort={true} gradeFilter={true} tokenFilter={true} aiServiceFilter={true} />
          <Search placeholder="Search by NFT name" reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <NftTable
          saleOption={isMyProfile}
          nftList={data?.data_list}
          onCancelSuccess={() => refetch()}
          listedDateOption={nftFilter === 'Listed'}
          mintedDateOption={nftFilter === 'Unlisted'}
          priceOption={nftFilter === 'Listed'}
          playsOption={nftFilter === 'Unlisted'}
        />
        <Pagination totalCount={data?.total_cnt} viewCount={12} page={page} />
        {isLoading && <Loading />}
      </ContentWrap>
    </>
  );
};

export default NftItems;
