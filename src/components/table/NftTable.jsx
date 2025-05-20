import { useState } from 'react';
import { Table, TableHeader, TableBody, TableItem, TableWrapper } from './TableCompositions';
import NoneContent from '../unit/NoneContent';
import songTypeIcon from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
import { useNavigate } from 'react-router-dom';
import NftConfirmModal from '../NftConfirmModal';
import SuccessModal from '../modal/SuccessModal';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NftTable = ({
  nftList = [],
  collectionOption = true,
  saleOption,
  dateOption = true,
  priceOption = true,
  playsOption,
  listedDateOption,
  mintedDateOption,
  handleSell,
  saleStatusOption,
  buyerOption,
  sellerOption,
  onCancelSuccess,
}) => {
  dateOption = dateOption && !listedDateOption && !mintedDateOption;

  const { t } = useTranslation('module');
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
          <TableHeader.Indexs>#</TableHeader.Indexs>
          <TableHeader.Col>{t('Type')}</TableHeader.Col>
          <TableHeader.Col>{t('Grade')}</TableHeader.Col>
          <TableHeader.Col>{t('Item')}</TableHeader.Col>
          {/* {collectionOption && <TableHeader.Col>Collection</TableHeader.Col>} */}
          {buyerOption && <TableHeader.Col>{t('Buyer')}</TableHeader.Col>}
          {sellerOption && <TableHeader.Col>{t('Seller')}</TableHeader.Col>}
          {priceOption && <TableHeader.Col>{t('Price')}</TableHeader.Col>}
          {playsOption && <TableHeader.Col>{t('Plays')}</TableHeader.Col>}
          {dateOption && <TableHeader.Col>{t('Date')}</TableHeader.Col>}
          {listedDateOption && <TableHeader.Col>{t('Listed Date')}</TableHeader.Col>}
          {mintedDateOption && <TableHeader.Col>{t('Minted Date')}</TableHeader.Col>}
          <TableHeader.Col>{t('Details')}</TableHeader.Col>
          {saleOption && <TableHeader.Col>{t('Sale Action')}</TableHeader.Col>}
          {saleStatusOption && <TableHeader.Col>{t('Sale Action')}</TableHeader.Col>}
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
                {priceOption && (
                  <TableItem.Text text={(item.price || 0) + ' ' + (item.sales_token || '')} />
                )}
                {playsOption && <TableItem.Text text={item.play_cnt?.toLocaleString()} />}
                {dateOption && <TableItem.Date date={item.create_dt} />}
                {listedDateOption && <TableItem.Date date={item.listing_date} />}
                {mintedDateOption && <TableItem.Date date={item.create_dt} />}

                <TableItem.Button
                  title={t('Details')}
                  type="details"
                  handleClick={() => {
                    navigate(`/nft/detail/${item?.id}`);
                  }}
                />

                {saleOption && item.status === 'sold' && (
                  <TableItem.Button title={t('Sold')} type="sold" />
                )}
                {saleOption && item.now_sales_status === 'Unlisted' && (
                  <TableItem.Button
                    title={t('Sell')}
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
                    title={t('Cancel')}
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
                    title={t('Sold')}
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
                    title={t('Purchased')}
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
        <SuccessModal
          setShowSuccessModal={setShowSuccessModal}
          title="Your NFT sale has been cancelled successfully!"
          noRedirect={true}
        />
      )}
    </TableWrapper>
  );
};

export default NftTable;
