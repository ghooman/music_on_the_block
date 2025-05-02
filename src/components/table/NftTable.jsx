import { useState } from 'react';
import { Table, TableHeader, TableBody, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import { useNavigate } from 'react-router-dom';
import NftConfirmModal from '../NftConfirmModal';

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
  const navigate = useNavigate();
  const [showNftConfirmModal, setShowNftConfirmModal] = useState(false);
  const [nftId, setNftId] = useState(null);
  const [nftName, setNftName] = useState(null);
  console.log(nftList, 'nftList');
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
              <TableItem.Button
                title="Details"
                type="details"
                handleClick={() => {
                  navigate(`/song-detail/${item?.song_id}`);
                }}
              />

              {saleOption && item.status === 'sold' && (
                <TableItem.Button title="Sold" type="sold" />
              )}

              {saleOption && item.now_sales_status === 'Unlisted' && (
                <TableItem.Button
                  title="Sell"
                  type="sell"
                  handleClick={() => {
                    navigate(`/nft/sell/detail/${item?.song_id}/${item?.id}`); // song_id, nft_id
                  }}
                />
              )}
              {saleOption && item.now_sales_status === 'Listed' && (
                <TableItem.Button
                  title="Cancel"
                  type="cancel"
                  handleClick={() => {
                    setNftId(item?.id);
                    setNftName(item?.nft_name);
                    setShowNftConfirmModal(true);
                  }}
                />
              )}
              {saleStatusOption && <TableItem.Text text="" />}
            </TableItem>
          ))}
        </TableBody>
      </Table>
      {nftList.length <= 0 && <NoneContent height={300} message="There are no NFTs yet" />}
      {showNftConfirmModal && (
        <NftConfirmModal
          setShowModal={setShowNftConfirmModal}
          setShowSuccessModal={setShowNftConfirmModal}
          title="Confirm cancel NFT sale"
          confirmSellTxt={false}
          confirmMintTxt={false}
          confirmCancelTxt={true}
          nftId={nftId}
          nftName={nftName}
        />
      )}
    </TableWrapper>
  );
};

export default NftTable;
