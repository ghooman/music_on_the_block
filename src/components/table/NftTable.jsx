import { Table, TableHeader, TableBody, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';

const NftTable = ({
  nftList = [],
  collectionOption = true,
  saleOption,
  handleSell,
  handleCancel,
  saleStatusOption,
  buyerOption,
  sellerOption,
}) => {
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Col>#</TableHeader.Col>
          <TableHeader.Col>Type</TableHeader.Col>
          <TableHeader.Col>Grade</TableHeader.Col>
          <TableHeader.Col>Item</TableHeader.Col>
          {collectionOption && <TableHeader.Col>Collection</TableHeader.Col>}
          {buyerOption && <TableHeader.Col>Buyer</TableHeader.Col>}
          {sellerOption && <TableHeader.Col>Seller</TableHeader.Col>}
          <TableHeader.Col>Price</TableHeader.Col>
          <TableHeader.Col>Date</TableHeader.Col>
          <TableHeader.Col>Details</TableHeader.Col>
          {saleOption && <TableHeader.Col>Sale Action</TableHeader.Col>}
          {saleStatusOption && <TableHeader.Col>Sale Action</TableHeader.Col>}
        </TableHeader>
        <TableBody>
          {nftList.map((item, index) => (
            <TableItem>
              <TableItem.Indexs text={index + 1} />
              <TableItem.Type image={songTypeIcon} />
              <TableItem.Grade grade={item.nft_rating} />
              <TableItem.Text text={item.nft_name} />
              {collectionOption && <TableItem.Text text={item.connect_collection_name} />}
              {buyerOption && (
                <TableItem.UserInfo
                  image={item?.seller_user_profile}
                  name={item?.seller_user_name}
                />
              )}
              {sellerOption && (
                <TableItem.UserInfo image={item?.buy_user_profile} name={item?.buy_user_name} />
              )}
              <TableItem.Text text={item.price + ' ' + (item.sales_token || '')} />
              <TableItem.Date date={item.create_dt} />
              <TableItem.Button title="Details" type="details" />

              {saleOption && item.status === 'sold' && (
                <TableItem.Button title="Sold" type="sold" />
              )}

              {saleOption && item.status !== 'sold' && item.status !== 'cancel' && (
                <TableItem.Button
                  title="Sell"
                  type="sell"
                  handleClick={() => {
                    if (handleSell) handleSell();
                  }}
                />
              )}

              {saleOption && item.status === 'cancel' && (
                <TableItem.Button
                  title="Cancel"
                  type="cancel"
                  handleClick={() => {
                    if (handleCancel) handleCancel();
                  }}
                />
              )}
              {saleStatusOption && <TableItem.Text text="" />}
            </TableItem>
          ))}
        </TableBody>
      </Table>
      {nftList.length <= 0 && <NoneContent height={300} message="There are no NFTs yet" />}
    </TableWrapper>
  );
};

export default NftTable;
