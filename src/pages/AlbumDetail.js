import "../styles/AlbumDetail.scss";
import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from 'react-router-dom';
import MyAudioPlayer from '../components/MyAudioPlayer';
import coverImg from '../assets/images/intro/intro-demo-img.png';
import coverImg2 from '../assets/images/intro/intro-demo-img2.png';
import coverImg3 from '../assets/images/intro/intro-demo-img3.png';
import coverImg4 from '../assets/images/demo/album01.svg';
import coverImg5 from '../assets/images/demo/album02.svg';
import coverImg6 from '../assets/images/demo/album03.svg';
import coverImg7 from '../assets/images/demo/album04.svg';
import coverImg8 from '../assets/images/demo/album05.svg';
import coverImg9 from '../assets/images/demo/album06.svg';
import loveIcon from '../assets/images/album/love-icon.svg';
import playIcon from '../assets/images/album/play-icon.svg';
import commentIcon from '../assets/images/album/chat-icon.svg';
import shareIcon from '../assets/images/album/share-icon.svg';
import track1 from "../assets/music/song01.mp3";
import track2 from "../assets/music/nisoft_song.mp3";


//스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';


function AlbumDetail() {
  
  return (
    <>
      <div className="album-detail">
        <dl className="album-detail__title">
          <dt>AI Lyric & Songwriting</dt>
          <dd>lyric+Songwriting</dd>
        </dl>
        <section className="album-detail__song-detail">
          <p className="album-detail__song-detail__title">Song Detail</p>
          <div className="album-detail__song-detail__bot">
            <div className="album-detail__song-detail__left">
              <p className="album-detail__song-detail__left__img">
                <img src={coverImg}/>
              </p>
              <div className="album-detail__song-detail__left__info">
                <div className="album-detail__song-detail__left__info__number">
                  <button className="love"><img src={loveIcon}/>145</button>
                  <button className="play"><img src={playIcon}/>125K</button>
                  <button className="play"><img src={commentIcon}/>125K</button>
                </div>
                <button className="album-detail__song-detail__left__info__share-btn">
                  <img src={shareIcon}/>
                </button>
              </div>
            </div>
            <div className="album-detail__song-detail__right">
              <p className="album-detail__song-detail__right__title">
                he dances through his masks like breathing - Yolkhead
              </p>
              <div className="album-detail__song-detail__right__type">
                <div className="album-detail__song-detail__right__type__item">
                  Moon
                </div>
                <div className="album-detail__song-detail__right__type__item">
                  Lover
                </div>
                <div className="album-detail__song-detail__right__type__item">
                  Mystery
                </div>
                <div className="album-detail__song-detail__right__type__item">
                  Serenity
                </div>
              </div>
              <div className="album-detail__song-detail__right__info-box">
                <dl>
                  <dt>Story</dt>
                  <dd>A love story about two people overcoming challenges</dd>
                </dl>
                <dl>
                  <dt>Genre</dt>
                  <dd>POP</dd>
                </dl>
                <dl>
                  <dt>Style</dt>
                  <dd>Passion</dd>
                </dl>
                <dl>
                  <dt>Stylistic</dt>
                  <dd>emotioal stylistic</dd>
                </dl>
                <dl>
                  <dt>Creation Data</dt>
                  <dd>
                    Sat, 04 Nov 2023 14:40:00 UTC+0
                    <span>Sat, 04 Nov 2023 14:40:00 UTC+0</span>
                  </dd>
                </dl>
                <dl className="artist">
                  <dt>Artist</dt>
                  <dd>
                    <p className="user">
                      <img src={coverImg2}/>Yolkhead
                    </p>
                    <Link 
                      className="see-more-btn"
                      to='/'
                    >See More</Link>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </section>
        
        <section className="album-detail__rank-table">
          <dl className="album-detail__rank-table__title">
            <dt>
              Albums Leaderboard Rank
            </dt>
            <dd>
              Most Likes
            </dd>
          </dl>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Artist</th>
                  <th>Song Title</th>
                  <th>Date</th>
                  <th>Like</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>30</td>
                  <td>User name</td>
                  <td>he dances through his masks<br />like breathing - Yolkhead</td>
                  <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
                  <td><span className="heart liked"></span></td>
                  <td><button className="details-btn">Details</button></td>
                </tr>
                <tr>
                  <td>31</td>
                  <td>User name</td>
                  <td>he dances through his masks<br />like breathing - Yolkhead</td>
                  <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
                  <td><span className="heart"></span></td>
                  <td><button className="details-btn active">Details</button></td>
                </tr>
                <tr>
                  <td>32</td>
                  <td>User name</td>
                  <td>he dances through his masks</td>
                  <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
                  <td><span className="heart"></span></td>
                  <td><button className="details-btn disabled">Details</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default AlbumDetail;
