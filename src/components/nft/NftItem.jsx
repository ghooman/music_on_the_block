import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import NoneContent from '../../components/unit/NoneContent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination, Autoplay } from 'swiper/modules';
import graph1Img01 from '../../assets/images/nft/praph-img01.png';
import graph1Img02 from '../../assets/images/nft/graph02-img.png';

import lyricIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import compositionIcon from '../../assets/images/icon/Composition-Icon.svg';
import songIcon from '../../assets/images/icon/Songwriting-Icon.svg';

import './NftItem.scss';
import { useState } from 'react';

export const NftItemList = ({ data }) => {
  return (
    <>
      <div className="nft-item-wrap">
        {data &&
          data?.map((item, index) => (
            <React.Fragment key={index}>
              <NftItem item={item} />
            </React.Fragment>
          ))}
      </div>
      {data?.length <= 0 && (
        <NoneContent height={300} message="There are no NFT items to show you." />
      )}
    </>
  );
};

export const CollectionItemList = ({ data, linkMove = true }) => {
  return (
    <>
      <div className="nft-item-collection-wrap">
        {data &&
          data.map((item, index) => (
            <React.Fragment key={index}>
              <CollectionItem item={item} linkMove={linkMove} />
            </React.Fragment>
          ))}
      </div>
      {data?.length <= 0 && <NoneContent height={300} message="There are no collections." />}
    </>
  );
};

const NftItem = ({ item }) => {
  const [duration, setDuration] = useState('');
  const formatTime = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

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
    <Link className="nft-item" to="/nft/detail">
      <Images music image={item.nft_image} duration={formatTime(duration)} />
      <NftTitle desc={item.nft_name} />
      <Title title={item.connect_collection_name} />
      <div className="nft-item__prices col">
        <PriceItems title="Price" value={`${item.price} MOB`} />
        {/* <PriceItems title="NFT Quantity" value={item.quantity} /> */}
      </div>
    </Link>
  );
};

export const CollectionItem = ({ item, linkMove = true }) => {
  const Wrapper = linkMove ? Link : 'div';
  const [isActive, setIsActive] = useState(false);

  console.log(item, '컬렉션 아이템');

  const handleClick = e => {
    if (!linkMove) {
      e.preventDefault();

      if (!isActive) {
        // 모든 기존 active 제거
        document.querySelectorAll('.nft-item.active').forEach(el => el.classList.remove('active'));
      }

      // 내 상태 토글 & 클래스 토글
      setIsActive(prev => !prev);
    }
  };
  return (
    <Link
      // className="nft-item"
      // to="/nft/collection/detail"
      className={`nft-item${!linkMove && isActive ? ' active' : ''}`}
      {...(linkMove && { to: '/nft/collection/detail' })}
      onClick={handleClick}
    >
      <Images image={item.image} />
      <CollectionTitle title={item.name} />
      <Username username={item.user_name} />
      <div className="nft-item__prices raw">
        <PriceItems title="Lowest Price" value={`${item.min_price || 0} MOB`} />
        <PriceItems title="Total NFT Items" value={item?.nft_cnt?.toLocaleString()} />
      </div>
    </Link>
  );
};

//===========
// Compositions
//===========

const Images = ({ music, image, duration }) => {
  const getTypeIcon = type => {
    switch (type) {
      case 'Lyrics':
        return lyricIcon;
      case 'Composition':
        return compositionIcon;
      case 'Song':
        return songIcon;
      default:
        return null;
    }
  };

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

const NftTitle = ({ desc }) => {
  return <p className="nft-item__desc">{desc}</p>;
};

const Title = ({ title }) => {
  return <p className="nft-item__title">{title}</p>;
};

const CollectionTitle = ({ title }) => {
  return <p className="nft-collection-item__title">{title}</p>;
};

const Username = ({ username }) => {
  return <p className="nft-item__username">{username}</p>;
};

const PriceItems = ({ title, value }) => {
  return (
    <div className="nft-item__prices--box">
      <p className="nft-item__prices--title">{title}</p>
      <p className="nft-item__prices--price-value">{value}</p>
    </div>
  );
};
