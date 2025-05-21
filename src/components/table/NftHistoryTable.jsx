import React from 'react';
import { Table, TableBody, TableHeader, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import { useTranslation } from 'react-i18next';

const NftHistoryTable = ({ data }) => {
  const { t } = useTranslation('module');

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Indexs>#</TableHeader.Indexs>
          <TableHeader.Col>{t('Artistname')}</TableHeader.Col>
          <TableHeader.Col>{t('Price')}</TableHeader.Col>
          <TableHeader.Col>{t('Transaction Date')}</TableHeader.Col>
        </TableHeader>
        <TableBody>
          {data?.map(item => (
            <React.Fragment key={item.id}>
              <TableItem>
                <TableItem.Indexs text={1} />
                <TableItem.UserInfo image={item.buy_user_profile} name={item.buy_user_name} />
                <TableItem.Text text={item.price?.toLocaleString() + ' ' + item.sales_token} />
                <TableItem.Date date={item.create_dt} />
              </TableItem>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {data?.length <= 0 && <NoneContent message="No data" height={300} />}
    </TableWrapper>
  );
};

export default NftHistoryTable;
