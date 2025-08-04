import React, { useState, useEffect } from 'react';
import './Footer.scss';
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  // useNavigate,
} from 'react-router-dom';
// import LogoHansung from "../assets/images/";
import Album from '../pages/Album';

//이미지
import logo from '../assets/images/full-logo-png.png';
import sns01 from '../assets/images/footer/sns-x.svg';
import sns02 from '../assets/images/footer/sns-discode.svg';
import sns03 from '../assets/images/footer/sns-you.svg';
import sns04 from '../assets/images/footer/sns04.svg';
import sns05 from '../assets/images/footer/mideum-icon.svg';
import naverIcon from '../assets/images/footer/Naver-Blog.svg';
import threadsIcon from '../assets/images/footer/Threads.svg';
// import sns05 from "../assets/images/footer/sns05.svg";
import sns06 from '../assets/images/footer/sns06.svg';
import musicTokenIcon from '../assets/images/icon/mob-icon01.svg';
import baseCoin from '../assets/images/coin/base-coin-icon.svg';
import polygonCoin from '../assets/images/coin/polygon-coin-icon.svg';
import opBNBCoin from '../assets/images/coin/opBNB-coin-icon.svg';

import Menu from './Menu';
import MyPage from '../pages/MyPage';

//스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination, Autoplay } from 'swiper/modules';
import PreparingModal from './PreparingModal';

import { useTranslation } from 'react-i18next';
import { disableEvaluation } from '../data/service';

const Footer = ({ setIsLoggedIn }) => {
  const { t } = useTranslation('main');

  const [transactions, setTransactions] = useState([]);
  const [isPreparingModal, setPreparingModal] = useState(false);

  useEffect(() => {
    // 더미 데이터 설정
    const dummyData = [
      // { id: 1, coin: "baseCoin", hash: "0xeC9123456789b354", method: "Transfer", block: "#57,773,712", coinLogo: baseCoin,},
      // { id: 2, coin: "polygonCoin", hash: "0xaB1234567890cdef", method: "Transfer", block: "#57,773,713", coinLogo: polygonCoin, },
      // { id: 3, coin: "opBNBCoin", hash: "0xcdE987654321abcd", method: "Transfer", block: "#57,773,714", coinLogo: opBNBCoin, },
      // { id: 4, coin: "baseCoin", hash: "0xffA567890123bcde", method: "Transfer", block: "#57,773,715", coinLogo: baseCoin, },
      // { id: 5, coin: "polygonCoin", hash: "0x123abcdef9876543", method: "Transfer", block: "#57,773,716", coinLogo: polygonCoin, },
      // { id: 6, coin: "opBNBCoin", hash: "0x7fA0123456bc789d", method: "Transfer", block: "#57,773,717", coinLogo: opBNBCoin, },
      {
        id: 1,
        coin: 'polygonCoin',
        hash: '0xeC9123456789b354',
        method: 'Transfer',
        block: '#57,773,712',
        coinLogo: polygonCoin,
      },
      {
        id: 2,
        coin: 'polygonCoin',
        hash: '0xaB1234567890cdef',
        method: 'Transfer',
        block: '#18,542,124',
        coinLogo: polygonCoin,
      },
      {
        id: 3,
        coin: 'polygonCoin',
        hash: '0xcdE987654321abcd',
        method: 'Transfer',
        block: '#65,845,542',
        coinLogo: polygonCoin,
      },
      {
        id: 4,
        coin: 'polygonCoin',
        hash: '0xffA567890123bcde',
        method: 'Transfer',
        block: '#48,383,545',
        coinLogo: polygonCoin,
      },
      {
        id: 5,
        coin: 'polygonCoin',
        hash: '0x123abcdef9876543',
        method: 'Transfer',
        block: '#65,124,356',
        coinLogo: polygonCoin,
      },
      {
        id: 6,
        coin: 'polygonCoin',
        hash: '0x7fA0123456bc789d',
        method: 'Transfer',
        block: '#17,125,458',
        coinLogo: polygonCoin,
      },
    ];
    setTransactions(dummyData);
  }, []);

  // 해시 값 포맷팅 함수 (앞 5자리 + ... + 끝 4자리)
  const formatHash = hash => {
    return `${hash.slice(0, 5)}...${hash.slice(-4)}`;
  };

  return (
    <>
      <div className="footer">
        <p className="footer__time-img"></p>
        <div className="footer__inner">
          <section className="footer__top">
            <article className="footer__top__left">
              <img className="footer__top__left__logo" src={logo} />
              <ul className="footer__top__left__sns">
                <li>
                  <Link to="https://x.com/musicaiblock" target="_blank">
                    <img src={sns01} alt="트위터&엑스" />
                  </Link>
                </li>
                <li>
                  <Link to="https://discord.com/invite/7zm6bcn76H" target="_blank">
                    <img src={sns02} />
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://medium.com/@musicontheblock"
                    target="_blank"
                    // onClick={() => setPreparingModal(true)}
                  >
                    <img src={sns05} />
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://www.threads.com/@musicaiblock?hl=ko"
                    target="_blank"
                    // onClick={() => setPreparingModal(true)}
                  >
                    <img src={threadsIcon} />
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://blog.naver.com/musicontheblock"
                    target="_blank"
                    // onClick={() => setPreparingModal(true)}
                  >
                    <img src={naverIcon} />
                  </Link>
                </li>

                {/* <li>
                  <Link>
                    <img src={sns06}/>
                  </Link>
                </li> */}
              </ul>
              <div className="footer__top__left__contact">
                <span className="footer__top__left__contact-text">Contact :&nbsp;</span>
                <a href="mailto:contact@musicontheblock.com">contact@musicontheblock.com</a>
              </div>
            </article>
            <article className="footer__top__right">
              <div className="footer__top__right__menu">
                <dl>
                  <dt>{t('Main')}</dt>
                  <dd>
                    <Link to="/">{t('Main')}</Link>
                  </dd>
                </dl>
                <dl>
                  <dt>{t('AI Services')}</dt>
                  <dd>
                    <Link to="/create">{t('AI Lyrics & Songwriting')}</Link>
                  </dd>
                  <dd>
                    <Link
                      onClick={e => {
                        if (disableEvaluation) {
                          e?.preventDefault();
                          setPreparingModal(true);
                        }
                      }}
                      to="/evaluation"
                    >
                      {t('AI Singing Evaluation')}
                    </Link>
                  </dd>
                  <dd>
                    <Link onClick={() => setPreparingModal(true)}>{t('AI Cover Creation')}</Link>
                  </dd>
                </dl>
                <dl>
                  <dt>{t('NFT MarketPlace')}</dt>
                  <dd>
                    <Link
                      to="/nft"
                      // onClick={() => setPreparingModal(true)}
                    >
                      {t('NFT MarketPlace')}
                    </Link>
                  </dd>
                </dl>
                <dl>
                  <dt>{t('Eco System')}</dt>
                  <dd>
                    <Link to="https://eco.musicontheblock.com/" target="_blank">
                      {t('Eco System')}
                    </Link>
                  </dd>
                </dl>
                <dl>
                  <dt>{t('My Page')}</dt>
                  <dd>
                    <Link to="/my-page?category=AI+Services">{t('AI Services')}</Link>
                  </dd>
                  <dd>
                    <Link to="/my-page?category=Songs">{t('Songs')}</Link>
                  </dd>
                  <dd>
                    <Link to="/my-page?category=Connections">{t('Connections')}</Link>
                  </dd>
                  <dd>
                    <Link to="/my-page?category=NFTs">{t('NFTs')}</Link>
                  </dd>
                </dl>
                <dl>
                  <dt>{t('Affiliate')}</dt>
                  <dd>
                    <Link
                      to="/affiliate/login"
                      // onClick={() => setPreparingModal(true)}
                    >
                      {t('Affiliate')}
                    </Link>
                  </dd>
                </dl>
              </div>
            </article>
          </section>
          <section className="footer__bottom">
            <article className="footer__bottom__left">
              <div className="footer__bottom__left__music-token">
                <div className="footer__bottom__left__music-token__txt">
                  <img src={musicTokenIcon} className="token-logo" />
                  <dl>
                    <dt>MOB</dt>
                    <dd>{t('Music on the block Token')}</dd>
                  </dl>
                </div>
                <dl className="footer__bottom__left__music-token__number">
                  <dt>$-</dt>
                  {/* <dd>+1.55%</dd> */}
                </dl>
              </div>
              <dl className="footer__bottom__left__token-value">
                <dt>{t('Transactions')}</dt>
                <dd>-</dd>
              </dl>
              <dl className="footer__bottom__left__token-value">
                <dt>{t('Circulating supply')}</dt>
                <dd>3,000,000,000</dd>
              </dl>
              <dl className="footer__bottom__left__token-value">
                <dt>{t('Market cap')}</dt>
                <dd>-</dd>
              </dl>
            </article>
            <article className="footer__bottom__right">
              <Swiper
                direction="vertical" //세로 옵션
                loop={true}
                slidesPerView={3}
                // centeredSlides={true}
                spaceBetween={8}
                initialSlide={2}
                grabCursor={true}
                // pagination={{
                //   clickable: true,
                // }}
                autoplay={{
                  delay: 1200,
                  disableOnInteraction: false, // 유저가 터치해도 자동 재생 유지
                }}
                navigation={false}
                modules={[Pagination, Navigation, Autoplay]}
                className="footer__bottom__slide"
              >
                {transactions.map(item => (
                  <SwiperSlide key={item.id} className="footer__bottom__slide__item">
                    <div className="footer__bottom__slide__item__left">
                      <div className="footer__bottom__slide__item__left__hash">
                        <img src={item.coinLogo} alt={item.coin} />
                        <dl>
                          <dt>
                            <p>{t('hash')} : </p>
                            <span>{formatHash(item.hash)}</span>
                          </dt>
                          <dd>
                            {t('Method')} : {item.method}
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="footer__bottom__slide__item__right">{item.block}</div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </article>
          </section>
        </div>
      </div>
      {isPreparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
    </>
  );
};

export default Footer;
