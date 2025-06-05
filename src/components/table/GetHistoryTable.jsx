import React from 'react';
import { useTranslation } from 'react-i18next';
import { TableWrapper, Table, TableHeader, TableBody, TableItem } from './TableCompositions';

import { sliceWalletAddress } from '../../utils/sliceWalletAddress';

import NoneContent from '../unit/NoneContent';

const dummyDataList = new Array(10).fill(null).map(item => ({
  name: 'hh',
  profile: '',
  wallet_address: '0xe3Fd161776e32786CF320D725db612AF404a9273',
  burned_mic: 12440,
  contribution: 34.2,
  estimated_reward: 35234,
}));

const GetHistoryTable = ({ dataList = dummyDataList }) => {
  const { t } = useTranslation('module');

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Indexs>#</TableHeader.Indexs>
          <TableHeader.Col>{t('User')}</TableHeader.Col>
          <TableHeader.Col>{t('Wallet Address')}</TableHeader.Col>
          <TableHeader.Col>{t('Burned MIC')}</TableHeader.Col>
          <TableHeader.Col>{t('Contribution')}</TableHeader.Col>
          <TableHeader.Col>{t('Estimated Reward (MOB)')}</TableHeader.Col>
        </TableHeader>
        <TableBody>
          {dataList &&
            dataList?.map((item, index) => (
              <React.Fragment key={item.id}>
                <TableItem>
                  <TableItem.Indexs text={index + 1} />
                  <TableItem.UserInfo image={item.profile} name={item.name} />
                  <TableItem.Text text={sliceWalletAddress(item.wallet_address)} />
                  <TableItem.Text text={item.burned_mic?.toLocaleString()} />
                  <TableItem.Text text={item.contribution?.toLocaleString() + '%'} />
                  <TableItem.Text text={item.estimated_reward?.toLocaleString()} />
                </TableItem>
              </React.Fragment>
            ))}
        </TableBody>
      </Table>
      {(!dataList || dataList?.length <= 0) && <NoneContent height={300} message="No data" />}
    </TableWrapper>
  );
};

export default GetHistoryTable;
