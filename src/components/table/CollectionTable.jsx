import React from 'react';
import { Table, TableBody, TableHeader, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import { useNavigate } from 'react-router-dom';

const CollectionTable = ({ collectionList = [] }) => {
  const navigate = useNavigate();

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Col>#</TableHeader.Col>
          <TableHeader.Col>Collection</TableHeader.Col>
          <TableHeader.Col>Date</TableHeader.Col>
          <TableHeader.Col>NFTs</TableHeader.Col>
          <TableHeader.Col>Details</TableHeader.Col>
        </TableHeader>
        <TableBody>
          {collectionList.map((item, index) => (
            <React.Fragment key={item.id}>
              <TableItem>
                <TableItem.Indexs text={index + 1} />
                <TableItem.Text text={item.name} />
                <TableItem.Date date={item.create_dt} />
                <TableItem.Text text={item.nft_cnt?.toLocaleString() || '-'} />
                <TableItem.Button
                  title="Details"
                  type="details"
                  handleClick={() => navigate(`/nft/collection/detail/${item.id}`)}
                />
              </TableItem>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {collectionList.length <= 0 && <NoneContent height={300} message="There are no NFTs yet" />}
    </TableWrapper>
  );
};

export default CollectionTable;
