import { Table, TableHeader, TableBody, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';

const dummy = [
  {
    id: 1,
    grade: 'Legend',
    nft_name: 'NFT NAME',
    collection: 'COLLECTION NAME',
    price: 12,
    adminssion_type: 'MOB',
    create_dt: '2005-05-05',
    status: 'sold',
  },
  {
    id: 2,
    grade: 'Legend',
    nft_name: 'NFT NAME',
    collection: 'COLLECTION NAME',
    price: 17,
    adminssion_type: 'MOB',
    create_dt: '2005-05-05',
    status: 'sell',
  },
  {
    id: 3,
    grade: 'Legend',
    nft_name: 'NFT NAME',
    collection: 'COLLECTION NAME',
    price: 210,
    adminssion_type: 'MOB',
    create_dt: '2005-05-05',
    status: 'cancel',
  },
];

const NftTable = ({ nftList = dummy, saleAction = true, handleSell, handleCancel }) => {
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Col>#</TableHeader.Col>
          <TableHeader.Col>Grade</TableHeader.Col>
          <TableHeader.Col>Item</TableHeader.Col>
          <TableHeader.Col>Collection</TableHeader.Col>
          <TableHeader.Col>Price</TableHeader.Col>
          <TableHeader.Col>Date</TableHeader.Col>
          <TableHeader.Col>Details</TableHeader.Col>
          {saleAction && <TableHeader.Col>Sale Action</TableHeader.Col>}
        </TableHeader>
        <TableBody>
          {nftList.map((item, index) => (
            <TableItem>
              <TableItem.Indexs text={index + 1} />
              <TableItem.Type image={songTypeIcon} />
              <TableItem.Text text={item.nft_name} />
              <TableItem.Text text={item.collection} />
              <TableItem.Text text={item.price} />
              <TableItem.Date date={item.create_dt} />
              <TableItem.Button title="Details" type="details" />

              {saleAction && item.status === 'sold' && (
                <TableItem.Button title="Sold" type="sold" />
              )}

              {saleAction && item.status === 'sell' && (
                <TableItem.Button title="Sell" type="sell" handleClick={() => handleSell()} />
              )}

              {saleAction && item.status === 'cancel' && (
                <TableItem.Button title="Cancel" type="cancel" handleClick={() => handleCancel()} />
              )}
            </TableItem>
          ))}
        </TableBody>
      </Table>
      <NoneContent height={300} message="테이블 데이터 없음" />
    </TableWrapper>
  );
};

export default NftTable;
