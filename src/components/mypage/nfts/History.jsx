import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getNftTransactionHistory } from '../../../api/nfts/nftsListApi';

import ContentWrap from '../../unit/ContentWrap';
import Loading from '../../IntroLogo2';
import Filter from '../../unit/Filter';
import Search from '../../unit/Search';
import NftTable from '../../table/NftTable';
import Pagination from '../../unit/Pagination';
import { useTranslation } from 'react-i18next';

const History = ({ username }) => {
  const { t } = useTranslation('my_page');

  const [searchParams] = useSearchParams();

  const page = searchParams.get('page');
  const search = searchParams.get('search');
  const gradeFilter = searchParams.get('grade_filter');
  const tokenFilter = searchParams.get('token_filter');
  const nftSort = searchParams.get('nft_sort');

  const { data, isLoading, refetch } = useQuery(
    ['nft_transaction_history_data', page, search, gradeFilter, tokenFilter, username, nftSort],
    async () => {
      const response = await getNftTransactionHistory({
        page: page,
        search_keyword: search,
        nft_rating: gradeFilter,
        sales_token: tokenFilter,
        sort_by: nftSort,
        user_name: username,
      });
      return response.data;
    }
  );

  return (
    <ContentWrap title={t('History')}>
      {isLoading && <Loading />}
      <ContentWrap.SubWrap gap={8}>
        <Filter gradeFilter={true} tokenFilter={true} buySellFilter={true} nftSort={true} />
        <Search placeholder="Search" />
      </ContentWrap.SubWrap>
      <NftTable
        nftList={data?.data_list}
        collectionOption={false}
        buyerOption={true}
        sellerOption={true}
        saleStatusOption={true}
        onCancelSuccess={() => refetch()}
      />
      <Pagination totalCount={data?.total_cnt} viewCount={10} page={page} />
    </ContentWrap>
  );
};

export default History;
