import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableHeader,
  TableItem,
  TableWrapper,
  TabelGrade,
} from './TableCompositions';
import NoneContent from '../unit/NoneContent';

const CollectionHistoryTable = ({ data = [] }) => {
  const { t } = useTranslation('module');
  const navigate = useNavigate();
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Indexs>#</TableHeader.Indexs>
          <TableHeader.Col>{t('Type')}</TableHeader.Col>
          <TableHeader.Col>{t('Grade')}</TableHeader.Col>
          <TableHeader.Col>{t('Artistname')}</TableHeader.Col>
          <TableHeader.Col>{t('Item')}</TableHeader.Col>
          <TableHeader.Col>{t('Price')}</TableHeader.Col>
          <TableHeader.Col>{t('Details')}</TableHeader.Col>
        </TableHeader>
        <TableBody>
          {data?.map(item => (
            <React.Fragment key={item.id}>
              <TableItem>
                <TableItem.Indexs text={1} />
                <TableItem.AiServiceType service={item?.ai_service} />
                <TableItem.Grade grade={item.rating} />
                <TableItem.UserInfo
                  image={item.buy_user_profile}
                  name={item.buy_user_name || 'unKnown'}
                />
                <TableItem.Text text={item.nft_name} />
                <TableItem.Text text={item.price?.toLocaleString() + ' ' + item.sales_token} />
                <TableItem.Button
                  title={t('Details')}
                  type="details"
                  handleClick={() => {
                    navigate(`/song-detail/${item?.song_id}`);
                  }}
                />
              </TableItem>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {data?.length <= 0 && <NoneContent message="There is no history" height={300} />}
    </TableWrapper>
  );
};

export default CollectionHistoryTable;
