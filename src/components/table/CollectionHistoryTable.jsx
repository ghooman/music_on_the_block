import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableItem,
  TableWrapper,
  TabelGrade,
} from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import { useNavigate } from 'react-router-dom';
const CollectionHistoryTable = ({ data = [] }) => {
  const navigate = useNavigate();
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Col>#</TableHeader.Col>
          <TableHeader.Col>Type</TableHeader.Col>
          <TableHeader.Col>Grade</TableHeader.Col>
          <TableHeader.Col>Artistname</TableHeader.Col>
          <TableHeader.Col>Item</TableHeader.Col>
          <TableHeader.Col>Price</TableHeader.Col>
          <TableHeader.Col>Details</TableHeader.Col>
        </TableHeader>
        <TableBody>
          {data?.map(item => (
            <React.Fragment key={item.id}>
              <TableItem>
                <TableItem.Indexs text={1} />
                <TableItem.Type image={songTypeIcon} />
                <TableItem.Grade grade={item.rating} />
                <TableItem.UserInfo
                  image={item.buy_user_profile}
                  name={item.buy_user_name || 'unKnown'}
                />
                <TableItem.Text text={item.nft_name} />
                <TableItem.Text text={item.price?.toLocaleString() + ' ' + item.sales_token} />
                <TableItem.Button
                  title="Details"
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
