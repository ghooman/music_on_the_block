
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PlayerHeader from '../components/PlayerHeader';
import AlarmModal from '../components/AlarmModal';
// 이미지
import BannerTxtImg from '../assets/images/vote/vote-banner-txt.png';
import BannerIcon01 from '../assets/images/vote/vote-icon-01.png';
import BannerIcon02 from '../assets/images/vote/vote-icon-02.png';
import BannerIcon03 from '../assets/images/vote/vote-icon-03.png';
import BannerIcon04 from '../assets/images/vote/vote-icon-04.png';

// 스타일
import '../styles/VoteEvent.scss';

function VoteEvent() {
    const topMusicList = [
        {
            id: 1,
            title: 'Music name',
            artist: 'Yolkhead',
            votes: 2115,
            image: 'cover1.jpg',
        },
        {
            id: 2,
            title: 'Another music',
            artist: 'Yolkhead',
            votes: 1544,
            image: 'cover2.jpg',
        },
    ];
  return (
    <>
      <div className="header-flex">
        <Header /> 
        <div className='vote-wrapper'>
            <div className="banner-section">
                <div className="banner-section__bg">
                    <img src={BannerTxtImg} alt="나만의 노래 만들고 상금받자" />
                    <img src={BannerIcon01} alt="" />
                    <img src={BannerIcon02} alt="" />
                    <img src={BannerIcon03} alt="" />
                    <img src={BannerIcon04} alt="" />
                </div>
                <dl className='banner-section__txt'>
                    <dt>AI로 만든 나만의 음악, 히트곡에 도전해볼까?</dt>
                    <dd>음악을 만들고 이벤트에 참여해 보세요. 유저투표를 통해 인기곡 TOP 10에 선정되면 
                        <span>최대 300만원의 상금</span>
                        을 받을 수 있어요!
                    </dd>
                </dl>
            </div>
            <div className='info-section'>
                <div className="info-section__countdown-centent">
                    <h2 className='info-section__tit'>참여 및 투표 마감까지</h2>
                    
                    {/* <div className='countdown-content__btn'>
                        <button>인기곡 투표하러 가기</button>
                        <span>* 계정 단 3회씩 투표할 수 있고, 같은 곡 중복 투표는 불가능해요.</span>
                    </div> */}
                </div>
                <div className="info-section__apply-content">
                    <h2 className="info-section__tit">신청방법</h2>
                    <ul>
                        <li>
                            <strong>STEP 01</strong>
                            <p>
                                뮤직온더블록에서 나만의 음악 생성 후 참가 신청할 음악의
                                <b>곡 정보 페이지 전체 화면을 캡쳐해 주세요.</b>
                            </p>
                        </li>
                        <li>
                            <strong>STEP 02</strong>
                            <p>
                                캡쳐한 이미지를 카카오톡 채널에 전송하면, 뮤직온더블록에서
                                <b>신청 내용 및 음악 적합성을 확인해요.</b>
                            </p>
                        </li>
                        <li>
                            <strong>STEP 03</strong>
                            <p>
                                적합성에 문제가 없다면,
                                <b>이벤트 페이지에 신청한 곡이 업로드 됩니다.</b>
                            </p>
                        </li>
                        <li>
                            <strong>STEP 04</strong>
                            <p>
                                Youtube / TikTok / Instagram에
                                <b>#뮤직온더블록 #인기곡챌린지 태그를 달아 홍보하고, 표를 확보래 보세요!</b>
                            </p>
                        </li>
                    </ul>
                     
                </div>
                {/* 출품곡이 10개 미만일 때는 해당 영역 미 노출, 10개 이상부터 노출됨 */}
                <div className="info-section__popular-content">
                    <h2 className="info-section__tit">실시간 인기곡 TOP 10</h2>
                    <ol className="popular-list">
                        {topMusicList.map((music, index) => (
                            <li key={music.id} className='popular-item'>
                                <div className='popular-item__left'>
                                    <span className='rank-numb'>{index + 1}</span>
                                    <div className='thumb-name'>
                                        <img src={music.image} alt={music.title} />
                                        <strong>{music.title}</strong>
                                    </div>
                                </div>
                                <div className='popular-item__right'>
                                    <div>
                                        <img src="" alt="" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="info-section__price-content">
                    <h2 className="info-section__tit">상금 안내</h2>
                </div>
                <div className="info-section__info-content">
                    <h2 className="info-section__tit">안내사항</h2>
                    <ul>
                        <li>
                            해당 이벤트로 제공되는 상금은 전액 USDT 토큰으로 제공되며, 그에 따라 메타마스크 지갑 주소를 요청할 수 있습니다.
                        </li>
                        <li>
                            TOP 10 인기곡 제작 아티스트에게는 상금 수령을 위해 최초 메세지를 남겨주셨던 &#91;인스타그램 DM 혹은 카카오톡 채널&#93;로 상금 수령 관련 안내를 전송해드릴 예정입니다.
                        </li>
                        <li>
                            1계정 당 1개의 음악만 신청할 수 있으며, 재신청의 경우 기존에 등록되었던 음악이 삭제되며, 투표 횟수도 초기화됩니다.
                        </li>
                        <li>
                            부정행위 적발 등의 문제 발견 시 예고없이 등록된 음악이 삭제될 수 있습니다.
                        </li>
                        <li>
                            2025년 9월 1일 이벤트가 종료되고, 순위 발표는 카카오톡 채널 및 홈페이지에서 확인 가능합니다.
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
  )
}

export default VoteEvent