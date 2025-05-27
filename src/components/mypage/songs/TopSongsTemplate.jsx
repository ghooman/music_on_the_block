import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

// 🧩 유닛 컴포넌트
import AlbumItem from '../../unit/AlbumItem';

// 🖼️ 이미지/에셋

import './TopSongsTemplate.scss';
import { useTranslation } from 'react-i18next';

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

  const { data: topSongsData } = useQuery(
    ['top_songs_data_by_username', { username }],
    async () => {
      const res = await axios.get(`${serverApi}/api/music/user/top/list?name=${username}`);
      return res.data;
    }
  );

  return (
    <div className="top-songs-template">
      <div className="top-songs-template__item">
        <p className="top-songs-template__item--title">{t('Top Plays')}</p>
        <AlbumItem track={topSongsData?.top_plays} />
      </div>
      <div className="top-songs-template__item">
        <p className="top-songs-template__item--title">{t('Top Likes')}</p>
        <AlbumItem track={topSongsData?.top_like} />
      </div>
      <div className="top-songs-template__item">
        <p className="top-songs-template__item--title">{t('Top Comments')}</p>
        <AlbumItem track={topSongsData?.top_comments} />
      </div>
    </div>
  );
};

const SingingEvaluation = ({ username }) => {
  return <div className="top-songs-template"></div>;
};
