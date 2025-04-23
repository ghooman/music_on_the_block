
import '../styles/MintNftSellDetail.scss';
import React, { useState, useRef } from 'react';
import { Link ,useLocation} from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ContentWrap from '../components/unit/ContentWrap';
import { NftItemList, CollectionItemList } from '../components/nft/NftItem';
import Search from '../components/unit/Search';
import FilterItems from '../components/unit/FilterItems';
// 이미지·아이콘 ------------------------------------------------------
import coverImg        from '../assets/images/black-img.jpg';
import demoImg         from '../assets/images/intro/intro-demo-img4.png';
import defaultCoverImg from '../assets/images/header/logo.svg';
import track1          from '../assets/music/song01.mp3';

import editIcon        from '../assets/images/edit.svg';
import micIcon        from '../assets/images/icon/mic-icon.svg';
import mobIcon        from '../assets/images/icon/mob-icon.svg';
import polygonIcon        from '../assets/images/icon/polygon-icon.svg';
import usdtIcon        from '../assets/images/icon/usdt-icon.svg';
import usdcIcon        from '../assets/images/icon/usdc-icon.svg';

import MintDetailSection from '../components/mint-nft-details/MintDetailSection';


// ──────────────── 더미 데이터 ────────────────
const album = {
    title:              'he dances through his masks like breathing - Yolkhead',
    music_url:          track1,
    cover_image:        coverImg,
    detail:             'This is a dummy song for UI layout only.',
    language:           'English',
    genre:              'Pop',
    gender:             'Any',
    musical_instrument: 'Guitar',
    tempo:              '120 BPM',
    create_dt:          '2025‑04‑22',
    name:               'Dummy Artist',
    user_profile:       defaultCoverImg,
    play_cnt:           123,
    like:               45,
    comment_cnt:        6,
    lyrics:             `# Verse 1
    This is **dummy** lyrics.
    [Chorus] Sing along!`,
};

const tagArray          = ['Pop', 'Bright', 'Happy'];
const albumDuration     = '3:02';


// Swiper 최소 옵션

// ────────────────────────────────
function MintNftSellDetail() {

    const location = useLocation();
    const [isSellNft, setIsSellNft] = useState(false);
    const [isActive, setIsActive] = useState(false); // track active state for the title
    const [selectedCoin, setSelectedCoin] = useState({ name: 'MOB', icon: mobIcon }); // default coin
    const handleTitleClick = () => {
      setIsActive((prev) => !prev); // toggle active class
    };
    const handleCoinClick = (coinName, coinIcon) => {
      setSelectedCoin({ name: coinName, icon: coinIcon }); // update title with selected coin
      setIsActive(false); // remove active class
    };

    return (
        <>
            <div className="mint-detail">
                <dl className="album-detail__title">
                    {!isSellNft && <dt>Mint Details</dt>}
                    {isSellNft && <dt>Sell NFT</dt>}
                    {/* <dd>Lyrics + Songwriting (Demo)</dd> */}
                </dl>
                <MintDetailSection
                    album={album}
                    tagArray={tagArray}
                    albumDuration={albumDuration}
                    track1={track1}
                />
                {!isSellNft &&
                    <ContentWrap title="Select Collection" >
                        <div className='filter-create'>
                            <FilterItems />
                            <button className='create-btn'>
                                Create New Collection
                                <img src={editIcon} alt='editIcon'/>
                            </button>
                        </div>
                        <Search />
                        <CollectionItemList data={[1, 2, 3,4,5,6]} />
                        <ContentWrap title="Selected Collection" >
                            <section className='selected-collection-bottom'>
                                <article className='selected-collection-bottom__left'>
                                    <img src={demoImg}/>
                                </article>
                                <article className='selected-collection-bottom__right'>
                                    <dl className='selected-collection-bottom__right__dl'>
                                        <dt>Collection Name</dt>
                                        <dd>Collection Name</dd>
                                    </dl>
                                    <div className='selected-collection-bottom__right__two-dl'>
                                        <dl className='selected-collection-bottom__right__dl'>
                                            <dt>Artist Name</dt>
                                            <dd><img src={defaultCoverImg} alt='user-img'/>User Name</dd>
                                        </dl>
                                        <dl className='selected-collection-bottom__right__dl'>
                                            <dt>Number of NFT Items</dt>
                                            <dd className='quantity'>12<p>quantity</p></dd>
                                        </dl>
                                    </div>
                                    <button className='selected-collection-bottom__right__mint-btn'>
                                        Mint
                                    </button>
                                </article>
                            </section>
                        </ContentWrap>
                    </ContentWrap>
                }

                {isSellNft &&
                    <ContentWrap title="Set NFT sell conditions" >
                        <div className='level-quantity-box'>
                            <dl className='level-quantity-box__dl'>
                                <dt>Level of NFT</dt>
                                <dd>1</dd>
                            </dl>
                            <dl className='level-quantity-box__dl'>
                                <dt>Quantity</dt>
                                <dd>1</dd>
                            </dl>
                        </div>
                        <div className='sell-nft-input-box'>
                            <p className='sell-nft-input-box__title'>Cumulative MIC earned</p>
                            <div className='sell-nft-input-box__value'>
                                <input placeholder='1,234 (=$1,000)' />
                                <button className='sell-nft-input-box__value__btn'><img src={micIcon} alt='mic-icon'/>MIC</button>
                            </div>
                        </div>
                        <div className='sell-nft-select-box'>
                            <p className='sell-nft-select-box__title'>Select token</p>
                            <div 
                                className={`sell-nft-select-box__value-box ${isActive ? 'active' : ''}`}
                            >
                            <p
                                className={`sell-nft-select-box__value-box__title `}
                                onClick={handleTitleClick}
                            >
                                <img src={selectedCoin.icon} alt={selectedCoin.name} />
                                {selectedCoin.name}
                            </p>
                            <ul className='sell-nft-select-box__value-box__list'>
                                <li onClick={() => handleCoinClick('MOB', mobIcon)}>
                                    <img src={mobIcon} alt='MOB' /> MOB
                                </li>
                                <li onClick={() => handleCoinClick('POL', polygonIcon)}>
                                    <img src={polygonIcon} alt='POL' /> POL
                                </li>
                                <li onClick={() => handleCoinClick('USDT', usdtIcon)}>
                                    <img src={usdtIcon} alt='USDT' /> USDT
                                </li>
                                <li onClick={() => handleCoinClick('USDC', usdcIcon)}>
                                    <img src={usdcIcon} alt='USDC' /> USDC
                                </li>
                            </ul>
                            </div>
                        </div>
                        <div className='sell-nft-input-box'>
                            <p className='sell-nft-input-box__title'>Cumulative MIC earned</p>
                            <div className='sell-nft-input-box__value'>
                                <input placeholder='How much will you sell each NFT for? (e.g. 0.05)' />
                                <button className='sell-nft-input-box__value__btn'><img src={mobIcon} alt='mic-icon'/>MOB</button>
                            </div>
                        </div>
                    </ContentWrap>
                }
            </div>

        </>
    );
}

export default MintNftSellDetail;
