import { useQuery } from 'react-query';
import axios from 'axios';

// 🧩 유닛 컴포넌트
import AlbumItem from '../../unit/AlbumItem';

//스와이프
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import './TopSongsTemplate.scss';
import { useTranslation } from 'react-i18next';
import { getEvaluationList } from '../../../api/evaluation/getList';
import NoneContent from '../../unit/NoneContent';
import { useAudio } from '../../../contexts/AudioContext';

const serverApi = process.env.REACT_APP_SERVER_API;

const TopSongsTemplates = ({ topSong, topScore, username }) => {
  if (topSong) {
    return <LyricsAndSongwriting username={username} />;
  } else if (topScore) {
    return <SingingEvaluation username={username} />;
  }
};

export default TopSongsTemplates;

//==============
// Top Plays, Top Likes, Top Comments를 포함하는 템플릿
//==============
const LyricsAndSongwriting = ({ username }) => {
  const { t } = useTranslation('my_page');
  const { playTrack, isTrackActive, currentTime, audioRef } = useAudio();

  const { data: topSongsData } = useQuery(
    ['top_songs_data_by_username', { username }],
    async () => {
      const res = await axios.get(`${serverApi}/api/music/user/top/list?name=${username}`);
      return res.data;
    }
  );

  const handlePlay = track => {
    // ✅ 자동재생 허용 플래그 세팅
    sessionStorage.setItem('preventAutoPlay', 'true');
    playTrack({
      track,
      playlist: [topSongsData.top_plays, topSongsData.top_like, topSongsData.top_comments].filter(
        Boolean
      ),
      playlistId: 'top-songs',
    });
  };

  return (
    <>
      {topSongsData ? (
        <div className="top-songs-template">
          <div className="top-songs-template__item">
            <p className="top-songs-template__item--title">{t('Top Plays')}</p>
            <AlbumItem
              track={topSongsData?.top_plays}
              isActive={isTrackActive(topSongsData.top_plays, 'top-songs')}
              currentTime={currentTime} // ✅ 추가
              audioRef={audioRef} // ✅ 필요한 경우 추가
              onClick={() => handlePlay(topSongsData?.top_plays)}
            />
          </div>
          <div className="top-songs-template__item">
            <p className="top-songs-template__item--title">{t('Top Likes')}</p>
            <AlbumItem
              track={topSongsData?.top_like}
              isActive={isTrackActive(topSongsData.top_like, 'top-songs')}
              currentTime={currentTime} // ✅ 추가
              audioRef={audioRef} // ✅ 필요한 경우 추가
              onClick={() => handlePlay(topSongsData?.top_like)}
            />
          </div>
          <div className="top-songs-template__item">
            <p className="top-songs-template__item--title">{t('Top Comments')}</p>
            <AlbumItem
              track={topSongsData?.top_comments}
              isActive={isTrackActive(topSongsData.top_comments, 'top-songs')}
              currentTime={currentTime} // ✅ 추가
              audioRef={audioRef} // ✅ 필요한 경우 추가
              onClick={() => handlePlay(topSongsData?.top_comments)}
            />
          </div>
        </div>
      ) : (
        <NoneContent height={200} message="There are no songs created yet." />
      )}
    </>
  );
};

const SingingEvaluation = ({ username }) => {
  const { playTrack, isTrackActive, currentTime, audioRef } = useAudio();

  const { data: topScoreData } = useQuery(['top_score_data_by_username', username], async () => {
    const res = await axios.get(`${serverApi}/api/music/evaluation/list`, {
      params: {
        page: 1,
        sort_by: 'Highest Score',
        name: username,
      },
    });
    return res.data.data.data_list;
  });

  const swiperOptions = {
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 16,
    grabCursor: true,
    pagination: {
      clickable: true,
    },
    FreeMode: true,
    navigation: true,
    modules: [FreeMode, Navigation],
  };

  return (
    <div className="top-songs-template">
      {topScoreData?.length > 0 && (
        <Swiper {...swiperOptions} className="top-songs-template-swiper-wrap">
          {topScoreData?.map(item => (
            <SwiperSlide key={item.id} className="top-songs-template-swiper-item">
              <AlbumItem
                track={item}
                type="evaluation"
                isActive={isTrackActive(item, 'top-songs')}
                currentTime={currentTime}
                audioRef={audioRef}
                onClick={() => {
                  // ✅ 자동재생 허용 플래그 세팅
                  sessionStorage.setItem('preventAutoPlay', 'true');
                  playTrack({
                    track: item,
                    playlist: topScoreData,
                    playlistId: 'top-songs',
                  });
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {(!topScoreData || topScoreData?.length <= 0) && (
        <NoneContent height={200} message="There are no songs evaluated yet." />
      )}
    </div>
  );
};
