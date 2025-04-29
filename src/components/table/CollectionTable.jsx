import React from 'react';
import { Table, TableBody, TableHeader, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';

const dummy = [
  {
    id: 0,
    name: 'Collections',
    create_dt: '2005-05-05',
    amount: 100,
  },
  {
    id: 1,
    name: 'Collections',
    create_dt: '2005-05-05',
    amount: 100,
  },
];

const CollectionTable = () => {
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
          {dummy.map((item, index) => (
            <React.Fragment key={item.id}>
              <TableItem>
                <TableItem.Text text={index + 1} />
                <TableItem.Text text={item.name} />
                <TableItem.Date date={item.create_dt} />
                <TableItem.Text text={item.amount} />
                <TableItem.Button title="Details" type="details" />
              </TableItem>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {dummy.length <= 0 && <NoneContent height={300} message="There are no NFTs yet" />}
    </TableWrapper>
  );
};

export default CollectionTable;
