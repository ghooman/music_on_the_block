import { useState } from 'react';

// 🧩 유닛 컴포넌트
import ContentWrap from '../../unit/ContentWrap';
import SubCategories from '../../unit/SubCategories';
import AlbumItem from '../../unit/AlbumItem';

// 🖼️ 이미지/에셋
import generatedLyricSongwritingIcon from '../../../assets/images/icon/generated-lryric-songwriting.svg';
import generatedSigingEvaluationIcon from '../../../assets/images/icon/generated-singing-evaluation.svg';
import generatedCoverCreationIcon from '../../../assets/images/icon/generated-cover-creation.svg';

import './TopSongsTemplate.scss';

const TopSongsTemplates = ({ topSongsData }) => {
  const topAlbumsCategoryList = [
    {
      name: 'AI Lyrics & Songwriting',
      image: generatedLyricSongwritingIcon,
      preparing: false,
    },
    { name: 'AI Singing Evaluation', image: generatedSigingEvaluationIcon, preparing: true },
    { name: 'AI Cover Creation', image: generatedCoverCreationIcon, preparing: true },
  ];

  const [topAlbumsCategory, setTopAlbumsCategory] = useState(topAlbumsCategoryList?.[0].name);

  return (
    <ContentWrap title="Songs" border={true}>
      <SubCategories
        categories={topAlbumsCategoryList}
        handler={setTopAlbumsCategory}
        value={topAlbumsCategory}
      />
      <div className="top-songs-template">
        <div className="top-songs-template__item">
          <p className="top-songs-template__item--title">Top Plays</p>
          <AlbumItem track={topSongsData?.top_plays} />
        </div>
        <div className="top-songs-template__item">
          <p className="top-songs-template__item--title">Top Likes</p>
          <AlbumItem track={topSongsData?.top_like} />
        </div>
        <div className="top-songs-template__item">
          <p className="top-songs-template__item--title">Top Comments</p>
          <AlbumItem track={topSongsData?.top_comments} />
        </div>
      </div>
    </ContentWrap>
  );
};

export default TopSongsTemplates;
