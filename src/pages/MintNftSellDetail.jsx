
import '../styles/MintNftSellDetail.scss';
import React, { useState, useRef } from 'react';
import { Link ,useLocation} from 'react-router-dom';
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

import NftConfirmModal from '../components/NftConfirmModal';
import NftConfirmSuccessModal from '../components/NftConfirmSuccessModal';
import SongsBar from '../components/unit/SongsBar';
import CreateCollectionModal from '../components/CreateCollectionModal';


// ────────────────────────────────
function MintNftSellDetail() {

    const [showModal, setShowModal] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); 

    return (
        <>
            <div className="mint-detail">
                <dl className="album-detail__title">
                    <dt>Mint Details</dt>
                </dl>
                <SongsBar/>
                <ContentWrap title="Select Collection" >
                    <div className='filter-create'>
                        <FilterItems />
                        <button className='create-btn'
                            onClick={()=>setShowCollectionModal(true)}
                        >
                            Create New Collection
                            <img src={editIcon} alt='editIcon'/>
                        </button>
                    </div>
                    <Search />
                    <CollectionItemList
                        data={[1, 2, 3,4,5,6]} 
                        linkMove={false}
                    />
                    <button className='mint-btn'
                        onClick={()=>setShowModal(true)}
                    >
                        Mint
                    </button>
                    {/* <ContentWrap title="Selected Collection" >
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

                            </article>
                        </section>
                    </ContentWrap> */}
                </ContentWrap>

            </div>
            {showModal && 
                <NftConfirmModal
                    setShowModal={setShowModal}
                    setShowSuccessModal={setShowSuccessModal}
                    title='Confirm Mint'
                    confirmSellTxt={false}
                    confirmMintTxt={true}
                />
            }
            {showSuccessModal &&
                <NftConfirmSuccessModal
                    setShowSuccessModal={setShowSuccessModal}
                    title='Your song has been minted as an NFT!'
                />
            }
            {showCollectionModal &&
                <CreateCollectionModal
                    setShowCollectionModal={setShowCollectionModal}
                />
            }
        </>
    );
}

export default MintNftSellDetail;
