import AudioPlayer from 'react-modern-audio-player';
import 'react-modern-audio-player/dist/index.css'; // ⑤: 스타일이 없으면 직접 import
import './MusicPlayer.scss';

import { useContext, useEffect, useState } from 'react';

export default function MusicPlayer() {
  const [playList, setPlayList] = useState(null);
  const [currentId, setCurrentId] = useState();

  console.count('리랜더링');

  return (
    <>
      {playList && playList?.length > 0 && (
        <AudioPlayer
          playList={playList}
          activeUI={{ all: true, progress: 'bar' }} // ⑥: 먼저 bar 모드로 확인
          placement={{ player: 'bottom' }}
          audioInitialState={{
            curPlayId: currentId,
          }}
          rootContainerProps={{ position: 'fixed', width: '100%' }}
        />
      )}
    </>
  );
}
