import { useSearchParams } from 'react-router-dom';
import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Pagination from '../unit/Pagination';
import Search from '../unit/Search';
import SubBanner from '../../components/create/SubBanner';

import SubCategories from '../unit/SubCategories';

import subBannerImage4 from '../../assets/images/create/subbanner-bg4.png';
import songImg from '../../assets/images/intro/intro-demo-img2.png';
import playIcon from '../../assets/images/play-icon2.svg';
import editIcon from '../../assets/images/edit.svg';

// 이미지
import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

import './AlbumsDetail.scss';
import { useState } from 'react';

const AlbumsDetail = () => {

    const subCategoryList = [
        { name: 'AI Lyrics & Songwriting', image: LyricsAndSongwritingIcon, preparing: false },
        { name: 'AI Singing Evaluation', image: LyricsIcon, preparing: true },
        { name: 'AI Cover Creation', image: SongwritingIcon, preparing: true },
    ];
    const [selected, setSelected] = useState(subCategoryList[0].name);
    

    return (
        <>
            <div className='my-album-details'>
                <p className='my-album-details__title'>Album Details</p>
                <div className='my-album-details__box'>
                    <section className='my-album-details__box__header'>
                        <article className='my-album-details__box__header__left'>
                            <div className='my-album-details__box__header__left__img-box'>
                                <img src={songImg} alt='cover-img'/>
                            </div>
                        </article>
                        <article className='my-album-details__box__header__right'>
                            <div className='my-album-details__box__header__right__box'>
                                <p className='my-album-details__box__header__right__box__title'>
                                    <span>title texttitle texttitle texttitle texttitle text</span>
                                    <button className='my-album-details__box__header__right__box__title__edit-btn'>
                                        Edit Album
                                        <img src={editIcon} alt='edit-icon'/>
                                    </button>
                                </p>
                                <div className='my-album-details__box__header__right__box__list'>
                                    <div className='my-album-details__box__header__right__box__list__item'>
                                        <p className='my-album-details__box__header__right__box__list__item__title'>
                                            Artist
                                        </p>
                                        <p className='my-album-details__box__header__right__box__list__item__title-value'>
                                            <img src={songImg} alt='user-img' className='user-img'/>
                                            user name
                                        </p>
                                    </div>
                                    <div className='my-album-details__box__header__right__box__list__item'>
                                        <p className='my-album-details__box__header__right__box__list__item__title'>
                                        Songs
                                        </p>
                                        <p className='my-album-details__box__header__right__box__list__item__title-value'>
                                            12
                                        </p>
                                    </div>
                                </div>
                                <button className='my-album-details__box__header__right__play-btn'>
                                    <img src={playIcon} alt='play-icon'/>Play
                                </button>
                            </div>
                        </article>
                    </section>
                    <section className='my-album-details__box__body'>
                    <ContentWrap title="Favorites" border={false}>
                        <SubCategories categories={subCategoryList} handler={() => null} value={selected} />
                        
                    </ContentWrap>

                    </section>
                </div>
            </div>
        </>
    );
};

export default AlbumsDetail;
