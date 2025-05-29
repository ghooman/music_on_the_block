import AudioPlayer from 'react-modern-audio-player';
import 'react-modern-audio-player/dist/index.css'; // ⑤: 스타일이 없으면 직접 import
import './MusicPlayer.scss';

import { useContext, useEffect, useState } from 'react';
import { AudioPlayContext } from '../contexts/AudioPlayContext';

export default function MusicPlayer() {
  const { playData } = useContext(AudioPlayContext);

  const [playList, setPlayList] = useState(null);
  const [currentId, setCurrentId] = useState();

  useEffect(() => {
    if (!playData) return;
    const playArr = playData?.list?.map((item, index) => ({
      id: index + 1,
      song_id: item.id,
      src: item.music_url,
      name: item.title,
      writer: item.name,
      img: item.image,
    }));

    setPlayList(playArr);
  }, [playData]);

  useEffect(() => {
    if (!playList || playList?.length <= 0) return;
    const findCurId = playList?.find(item => item.song_id === playData?.currentId);
    setCurrentId(findCurId?.id);
  }, [playList]);

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
