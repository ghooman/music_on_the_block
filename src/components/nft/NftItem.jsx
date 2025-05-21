import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import NoneContent from '../../components/unit/NoneContent';

import lyricIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import compositionIcon from '../../assets/images/icon/Composition-Icon.svg';
import songIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import defaultUserImage from '../../assets/images/header/logo-png.png';

import './NftItem.scss';

export const NftItemList = ({ data }) => {
  const { t } = useTranslation('module');

  return (
    <>
      <div className="nft-item-wrap">
        {data &&
          data?.map((item, index) => (
            <React.Fragment key={index}>
              <NftItem item={item} t={t} />
            </React.Fragment>
          ))}
      </div>
      {(!data || data?.length <= 0) && (
        <NoneContent height={300} message="There are no NFT items to show you." />
      )}
    </>
  );
};

export const CollectionItemList = ({
  data,
  linkMove = true,
  selectedCollection,
  setSelectedCollection,
}) => {
  const { t } = useTranslation('module');

  return (
    <>
      <div className="nft-item-collection-wrap">
        {data &&
          data.map((item, index) => (
            <React.Fragment key={index}>
              <CollectionItem
                item={item}
                linkMove={linkMove}
                setSelectedCollection={setSelectedCollection}
                selectedCollection={selectedCollection}
                t={t}
              />
            </React.Fragment>
          ))}
      </div>
      {(!data || data?.length <= 0) && (
        <NoneContent height={300} message="There are no collections." />
      )}
    </>
  );
};

const NftItem = ({ item, t }) => {
  const [duration, setDuration] = useState('');
  const formatTime = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  console.log(item, '음원 데이터');

  useEffect(() => {
    if (!item) return;
    const audio = new Audio(item.nft_music_url);
    const setting = () => {
      let time;
      time = audio.duration;
      setDuration(time);
    };
    audio.addEventListener('loadedmetadata', setting);
    return () => {
      audio.removeEventListener('loadedmetadata', setting);
    };
  }, [item]);

  return (
    <Link className="nft-item" to={`/nft/detail/${item.id}`}>
      <Images music image={item.nft_image} duration={formatTime(duration)} />
      <Title title={item.nft_name} />
      <User userProfile={item.user_profile} userName={item.user_name} />
      {/* <Title title={item.nft_name} /> */}
      {/* <SubTitle subTitle={item.connect_collection_name} /> */}
      <div className="nft-item__prices col">
        <PriceItems
          title={t('Price')}
          value={item.price ? `${item?.price} ${item.sales_token}` : '-'}
        />
        {/* <PriceItems title="NFT Quantity" value={item.quantity} /> */}
      </div>
    </Link>
  );
};

export const CollectionItem = ({
  item,
  linkMove = true,
  selectedCollection,
  setSelectedCollection,
  t,
}) => {
  console.log(item, '컬렉션 아이템');
  const Wrapper = linkMove ? Link : 'div';

  // selectedCollection을 기준으로 현재 아이템이 선택되었는지 확인
  const isActive = !linkMove && selectedCollection && selectedCollection.id === item.id;

  const handleClick = e => {
    if (!linkMove) {
      e.preventDefault();

      // 현재 아이템이 이미 선택된 상태인지 확인
      if (selectedCollection && selectedCollection.id === item.id) {
        // 현재 선택된 아이템이면 선택 해제
        setSelectedCollection(null);
      } else {
        // 새로운 아이템 선택
        setSelectedCollection(item);
      }
    }
  };

  return (
    <Link
      className={`nft-item${isActive ? ' active' : ''} collections`}
      {...(linkMove && { to: `/nft/collection/detail/${item?.id}` })}
      onClick={handleClick}
    >
      <Images image={item.image} />
      <Title title={item.name} />
      <User userName={item.user_name} userProfile={item?.user_profile} />
      <div className="nft-item__prices raw">
        <PriceItems
          title={t('Lowest Price')}
          value={`${item.min_price || 0} ${item.min_price_token || 'MOB'}`}
        />
        <PriceItems title={t('Total NFT Items')} value={item?.nft_cnt?.toLocaleString()} />
      </div>
    </Link>
  );
};

//===========
// Compositions
//===========

const Images = ({ music, image, duration }) => {
  return (
    <div className="nft-item__images">
      <img src={image?.replace('public', '280to280')} alt="images" />
      {music && (
        <>
          {/* <div className="nft-item__images--type">
            <img src={getTypeIcon(item.type)} alt={item.type} />
          </div> */}
          {/* <div className="nft-item__images--genre">{item.nft_name}</div> */}
          <div className="nft-item__images--running-time">{duration}</div>
        </>
      )}
    </div>
  );
};

const Title = ({ title }) => {
  return <p className="nft-item__title">{title}</p>;
};

const SubTitle = ({ subTitle }) => {
  return <p className="nft-item__sub-title">{subTitle}</p>;
};

const User = ({ userProfile, userName }) => {
  return (
    <div className="nft-item__user-data">
      <img
        className="nft-item__user-data--image"
        src={userProfile || defaultUserImage}
        alt="profile"
      />
      <p className="nft-item__user-data--name">{userName}</p>
    </div>
  );
};

const PriceItems = ({ title, value }) => {
  return (
    <div className="nft-item__prices--box">
      <p className="nft-item__prices--title">{title}</p>
      <p className="nft-item__prices--price-value">{value}</p>
    </div>
  );
};
