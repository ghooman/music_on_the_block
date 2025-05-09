import { useState } from 'react';
import { Table, TableHeader, TableBody, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import songTypeIcon from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import { useNavigate } from 'react-router-dom';
import NftConfirmModal from '../NftConfirmModal';
import NftConfirmSuccessModal from '../NftConfirmSuccessModal';
import React from 'react';

const NftTable = ({
  nftList = [],
  collectionOption = true,
  saleOption,
  handleSell,
  saleStatusOption,
  buyerOption,
  sellerOption,
  onCancelSuccess,
}) => {
  const navigate = useNavigate();
  const [showNftConfirmModal, setShowNftConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nftId, setNftId] = useState(null);
  const [nftName, setNftName] = useState(null);
  const [listingId, setListingId] = useState(null);
  console.log(nftList, 'nftList');

  const handleCancelSuccess = () => {
    if (onCancelSuccess) onCancelSuccess();
    setShowSuccessModal(true);
  };

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Col>#</TableHeader.Col>
          <TableHeader.Col>Type</TableHeader.Col>
          <TableHeader.Col>Grade</TableHeader.Col>
          <TableHeader.Col>Item</TableHeader.Col>
          {/* {collectionOption && <TableHeader.Col>Collection</TableHeader.Col>} */}
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
            <React.Fragment key={item.id}>
              <TableItem>
                <TableItem.Indexs text={index + 1} />
                <TableItem.Type image={songTypeIcon} />
                <TableItem.Grade grade={item.nft_rating} />
                <TableItem.Text text={item.nft_name} />
                {/* {collectionOption && <TableItem.Text text={item.connect_collection_name || '-'} />} */}
                {buyerOption && (
                  <TableItem.UserInfo image={item?.buy_user_profile} name={item?.buy_user_name} />
                )}
                {sellerOption && (
                  <TableItem.UserInfo
                    image={item?.seller_user_profile}
                    name={item?.seller_user_name}
                  />
                )}
                <TableItem.Text text={(item.price || 0) + ' ' + (item.sales_token || '')} />
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
                      if (handleSell) {
                        handleSell();
                        return;
                      }
                      navigate(`/nft/sell/detail/${item.song_id}/${item.id}`);
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
                      setListingId(item?.listing_id);
                      setShowNftConfirmModal(true);
                    }}
                  />
                )}
                {/* 마이페이지 - NFT - History 페이지 에서 사용됨 */}
                {saleStatusOption && item.status === 'Sell' && (
                  <TableItem.Button
                    title="Sold"
                    type="sold"
                    // handleClick={() => {
                    //   if (handleSell) {
                    //     handleSell();
                    //     return;
                    //   }
                    //   navigate(`/nft/sell/detail/${item.song_id}/${item.id}`);
                    // }}
                  />
                )}
                {saleStatusOption && item.status === 'Buy' && (
                  <TableItem.Button
                    title="Purchased"
                    type="purchased"
                    // handleClick={() => {
                    //   if (handleSell) {
                    //     handleSell();
                    //     return;
                    //   }
                    //   navigate(`/nft/sell/detail/${item.song_id}/${item.id}`);
                    // }}
                  />
                )}
                {saleStatusOption && <TableItem.Text text="" />}
              </TableItem>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {nftList.length <= 0 && <NoneContent height={300} message="There are no NFTs yet" />}
      {showNftConfirmModal && (
        <NftConfirmModal
          setShowModal={setShowNftConfirmModal}
          setShowSuccessModal={handleCancelSuccess}
          title="Confirm"
          confirmSellTxt={false}
          confirmMintTxt={false}
          confirmCancelTxt={true}
          nftId={nftId}
          nftName={nftName}
          listingId={listingId}
          onSuccess={onCancelSuccess}
        />
      )}
      {showSuccessModal && (
        <NftConfirmSuccessModal
          setShowSuccessModal={setShowSuccessModal}
          title="Your NFT sale has been cancelled successfully!"
          noRedirect={true}
        />
      )}
    </TableWrapper>
  );
};

export default NftTable;
