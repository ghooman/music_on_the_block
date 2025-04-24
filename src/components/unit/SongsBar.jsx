// components/AlbumItem.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './SongsBar.scss';

import loveIcon from '../../assets/images/album/love-icon.svg';
import halfHeartIcon from '../../assets/images/icon/half-heart.svg';
import playIcon from '../../assets/images/album/play-icon.svg';
import playIcon2 from '../../assets/images/play-icon2.svg';
import stopIcon from '../../assets/images/stop-icon.svg';
import defaultCoverImg from '../../assets/images/header/logo-png.png';
import demoImg from '../../assets/images/intro/intro-demo-img4.png';
import loverIcon        from '../../assets/images/icon/heart.svg';
import grade01Icon        from '../../assets/images/icon/grade-icon/Grade01-icon.svg';
import typeIcon        from '../../assets/images/icon/Lyrics-Song-Writing-icon.svg';
const SongsBar = ({}) => {

    const [barActive, setBarActive] = useState(false);


    return (
        <>
            <section
                className={`songs-bar ${barActive ? 'active' : ''}`}
                onClick={() => setBarActive((prev) => !prev)}
            >
                <article className='songs-bar__play-box'>
                    <p className='songs-bar__play-box__img'>
                        <img src={demoImg}/>
                        <div className="loading-wave">
                            <div className="loading-bar"></div>
                            <div className="loading-bar"></div>
                            <div className="loading-bar"></div>
                            <div className="loading-bar"></div>
                        </div>
                    </p>
                    <p className='songs-bar__play-box__title'>
                        he dances through his masks like breathing - Yolkhead
                    </p>
                </article>
                <article className='songs-bar__value-box'>
                    <div className='songs-bar__value-box__item'>
                        <p>Grade<img src={grade01Icon} alt='grade-icon'/></p>
                        <p>Type<img src={typeIcon} alt='type-icon'/></p>
                    </div>
                    <div className='songs-bar__value-box__item'>
                        <p><img src={playIcon} alt='play-icon' className='play-icon'/>125K</p>
                        <p><img src={loverIcon} alt='love-icon'/>145</p>
                    </div>
                    <Link 
                        className='songs-bar__details-btn'
                        to=''
                    >
                        Details
                    </Link>
                </article>
            </section>
        </>
    );
};

export default SongsBar;
