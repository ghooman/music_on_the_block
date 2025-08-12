import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PlayerHeader from '../components/PlayerHeader';
import AlarmModal from '../components/AlarmModal';
// 이미지
import BannerTxtImg from '../assets/images/vote/vote-banner-txt.png';
import BannerIcon01 from '../assets/images/vote/vote-icon-01.svg';
import BannerIcon02 from '../assets/images/vote/vote-icon-02.svg';
import BannerIcon03 from '../assets/images/vote/vote-icon-03.svg';
import BannerIcon04 from '../assets/images/vote/vote-icon-04.svg';
import MedalIcon from '../assets/images/vote/vote-medal-icon.png';
import KakaoIcon from '../assets/images/icons/kakao-icon.svg';
import SampleAlbumImg from '../assets/images/vote/vote-sample-album.png';
import SampleArtistImg from '../assets/images/vote/vote-sample-artist.png';
import defaultCoverImg from '../assets/images/header/logo.svg';

// 스타일
import '../styles/VoteEvent.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';

function VoteEvent() {
  const serverApi = process.env.REACT_APP_SERVER_API;

  const [voteMusicList, setVoteMusicList] = useState([]);

  const getVoteMusicList = async () => {
    try {
      const res = await axios.get(`${serverApi}/api/music/real-time/popular/vote/song`);
      console.log('getVoteMusicList', res);
      setVoteMusicList(res.data);
    } catch (err) {
      console.error('getVoteMusicList err', err);
    }
  };

  useEffect(() => {
    getVoteMusicList();
  }, []);

  const topMusicList = [
    {
      id: 1,
      title: 'Music name',
      artist: 'Yolkhead',
      votes: 2115,
      coverImage: SampleAlbumImg,
      artistImage: SampleArtistImg,
    },
    {
      id: 2,
      title: 'Another music',
      artist: 'Yolkhead',
      votes: 1544,
      coverImage: SampleAlbumImg,
    },
  ];
  return (
    <>
      <div className="header-flex">
        <Header />
        <div className="vote-wrapper">
          <div className="banner-section">
            <div className="banner-section__bg">
              <img src={BannerTxtImg} alt="나만의 노래 만들고 상금받자" className="txt-img" />
              <img src={BannerIcon01} alt="" className="icon icon--01" />
              <img src={BannerIcon02} alt="" className="icon icon--02" />
              <img src={BannerIcon03} alt="" className="icon icon--03" />
              <img src={BannerIcon04} alt="" className="icon icon--04" />
            </div>
            <div className="banner-section__txt">
              <h3 className="txt-tit">AI로 만든 나만의 음악, 히트곡에 도전해볼까?</h3>
              <div className="txt-desc">
                <p>음악을 만들고 이벤트에 참여해 보세요.</p>
                <p>유저투표를 통해 인기곡 TOP 10에 선정되면</p>
                <p>
                  <span className="color-green"> 최대 200만원의 상금</span>을 받을 수 있어요!
                </p>
              </div>
            </div>
          </div>
          <div className="info-section">
            <div className="info-section__countdown-content">
              <h2 className="info-section__tit">참여 및 투표 마감까지</h2>
              <ul className="info-section__countdown-list">
                <li>
                  <div className="count count--days">14</div>
                  <span>DAYS</span>
                </li>
                <li>:</li>
                <li>
                  <div className="count count--hours">12</div>
                  <span>HOURS</span>
                </li>
                <li>:</li>
                <li>
                  <div className="count count--minutes">12</div>
                  <span>MINUTES</span>
                </li>
                <li>:</li>
                <li>
                  <div className="count count--seconds">12</div>
                  <span>SECONDS</span>
                </li>
              </ul>
              <Link to="/vote-list" className="info-section__countdown-btn">
                인기곡 투표하러 가기
              </Link>
              <span className="color-green">
                * 계정 단 3회씩 투표할 수 있고, 같은 곡 중복 투표는 불가능해요.
              </span>
            </div>

            <div className="info-section__apply-content">
              <h2 className="info-section__tit">신청방법</h2>
              <ul className="info-section__apply-list">
                <li>
                  <strong>STEP 01</strong>
                  <p>
                    뮤직온더블록에서 나만의 음악 생성 후 참가 신청할 음악의
                    <b> 곡 정보 페이지 전체 화면을 캡쳐해 주세요.</b>
                  </p>
                </li>
                <li>
                  <strong>STEP 02</strong>
                  <p>
                    캡쳐한 이미지를 카카오톡 채널에 전송하면, 뮤직온더블록에서
                    <b> 신청 내용 및 음악 적합성을 확인해요.</b>
                  </p>
                </li>
                <li>
                  <strong>STEP 03</strong>
                  <p>
                    적합성에 문제가 없다면,
                    <b> 이벤트 페이지에 신청한 곡이 업로드 됩니다.</b>
                  </p>
                </li>
                <li>
                  <strong>STEP 04</strong>
                  <p>
                    Youtube / TikTok / Instagram에
                    <b> #뮤직온더블록 #인기곡챌린지 태그를 달아 홍보하고, 표를 확보해 보세요!</b>
                  </p>
                </li>
              </ul>
              <a
                href="https://pf.kakao.com/_cBeJn"
                target="_blank"
                rel="noopener noreferrer"
                className="info-section__kakao-link"
              >
                <img src={KakaoIcon} alt="" />
                참가 신청 카카오 채널 바로가기
              </a>
              <a
                href="https://open.kakao.com/o/g9AylBHh"
                target="_blank"
                rel="noopener noreferrer"
                className="info-section__open-link"
              >
                뮤블 오픈카톡 커뮤니티
              </a>
            </div>

            {/* 출품곡이 10개 미만일 때는 해당 영역 미 노출, 10개 이상부터 노출됨 */}
            <div className="info-section__popular-content">
              <h2 className="info-section__tit">실시간 인기곡 TOP 10</h2>
              <ol className="info-section__popular-list">
                {voteMusicList?.map((music, index) => (
                  <li key={music.song_id} className="popular-item">
                    <div className="popular-item__left">
                      <div className="rank-thumb">
                        <span className="rank-numb">{index + 1}</span>
                        <img
                          src={music.cover_image}
                          alt={music.song_name}
                          className="rank-album-cover"
                        />
                        <div className="rank-music">
                          <h3 className="rank-music-tit">{music.song_name}</h3>
                          <div className="rank-music-artist">
                            <img
                              src={music.artist_profile_image || defaultCoverImg}
                              alt="profile"
                              className="rank-artist-cover"
                            />
                            <strong className="rank-artist-name">{music.artist_name}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="popular-item__right">
                      <small>현재 득표 수</small>
                      <strong>{music.vote_cnt}</strong>
                    </div>
                  </li>
                ))}
              </ol>
              <Link to="/vote-list" className="info-section__popular-btn">
                전체 음악 보러가기
              </Link>
            </div>

            <div className="info-section__price-content">
              <h2 className="info-section__tit">
                상금 안내
                <span className="subtit">
                  상금은 USDT로 제공되며, 각 등수 별 한화 기준 해당 금액 상당의 USDT를 전송해
                  드립니다.
                </span>
              </h2>
              <ul className="info-section__price-list">
                <li className="price-item--first">
                  <h3>1등</h3>
                  <p>
                    <strong>1,000,000원</strong> 상당
                  </p>
                  <img src={MedalIcon} alt="" />
                </li>
                <li className="price-item--second">
                  <h3>2등</h3>
                  <p>
                    <strong>500,000원</strong> 상당
                  </p>
                </li>
                <li className="price-item--third">
                  <h3>3등</h3>
                  <p>
                    <strong>150,000원</strong> 상당
                  </p>
                </li>
                <li className="price-item--rest">
                  <h3>4~10등</h3>
                  <p>
                    <strong>각 50,000원</strong> 상당
                  </p>
                </li>
              </ul>
            </div>

                <div className="info-section__info-content">
                    <h2 className="info-section__tit">안내사항</h2>
                    <ul className='info-section__info-list'>
                        <li>
                            해당 이벤트로 제공되는 상금은 전액 USDT 토큰으로 제공되며, 그에 따라 메타마스크 지갑 주소를 요청할 수 있습니다.
                        </li>
                        <li>
                            TOP 10 인기곡 제작 아티스트에게는 상금 수령을 위해 &#91;인스타그램 DM 혹은 카카오톡 채널&#93;로 상금 수령 관련 별도 안내를 드릴 예정입니다.
                        </li>
                        <li>
                            노래 참가자는 1계정 당 1개의 음악만 신청할 수 있으며, 투표자의 경우 1계정 당 3번의 투표가 가능합니다.
                        </li>
                        <li>
                            부정행위 적발 등의 문제 발견 시 예고없이 등록된 음악이 삭제될 수 있습니다.
                        </li>
                        <li>
                            2025년 9월 31일 이벤트가 종료되고, 순위 발표는 카카오톡 채널 및 홈페이지에서 확인 가능합니다.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
      <Footer />
      <PlayerHeader />
      <AlarmModal />
    </>
  );
}

export default VoteEvent;
