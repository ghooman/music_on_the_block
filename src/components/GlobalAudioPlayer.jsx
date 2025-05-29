import React, { useMemo, useCallback } from 'react';
import AudioPlayer from 'react-modern-audio-player';
import 'react-modern-audio-player/dist/index.css';
import { useGlobalMusic } from '../contexts/GlobalMusicContext';
import defaultCoverImg from '../assets/images/header/logo-png.png';
import './MusicPlayer.scss';

const GlobalAudioPlayer = () => {
  const {
    selectedMusic,
    selectedList,
    isPlayerVisible,
    isPlaying,
    handleTimeUpdate,
    setIsPlaying,
    hidePlayer,
  } = useGlobalMusic();

  // 현재 선택된 음악을 플레이리스트 형태로 변환
  const playList = useMemo(() => {
    if (!selectedMusic || !selectedList) return [];

    return selectedList.map((track, index) => ({
      id: track.id,
      src: track.music_url,
      img:
        track.cover_image === 'string'
          ? defaultCoverImg
          : track.cover_image?.replace('public', '140to140') || defaultCoverImg,
      name: track.title || 'Unknown Title',
      writer: track.name || track.artist || 'Unknown Artist',
      description: track.ai_service == 1 ? 'Song' : 'BGM',
    }));
  }, [selectedMusic, selectedList]);

  // 현재 재생 중인 트랙의 인덱스 찾기
  const currentTrackIndex = useMemo(() => {
    if (!selectedMusic || !selectedList) return 0;
    const index = selectedList.findIndex(track => track.id === selectedMusic.id);
    return index >= 0 ? index : 0;
  }, [selectedMusic, selectedList]);

  // 오디오 이벤트 핸들러들
  const handleAudioPlay = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handleAudioPause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleAudioTimeUpdate = useCallback(
    time => {
      if (typeof time === 'number' && !isNaN(time)) {
        handleTimeUpdate(time);
      }
    },
    [handleTimeUpdate]
  );

  if (!isPlayerVisible || !selectedMusic || playList.length === 0) {
    return null;
  }

  return (
    <div className="global-audio-player-wrapper">
      <AudioPlayer
        key={selectedMusic.id} // 트랙 변경 시 새로 렌더링
        playList={playList}
        activeUI={{ all: true, progress: 'bar' }}
        placement={{ player: 'bottom' }}
        rootContainerProps={{
          position: 'fixed',
          width: '100%',
          zIndex: 10,
        }}
        audioInitialState={{
          isPlaying: isPlaying, // 현재 재생 상태 반영
          curPlayId: selectedMusic.id,
          currentTrackIndex: currentTrackIndex,
        }}
        onAudioPlay={handleAudioPlay}
        onAudioPause={handleAudioPause}
        onAudioEnded={handleAudioEnded}
        onAudioTimeUpdate={handleAudioTimeUpdate}
      />
      {/* 플레이어 닫기 버튼 */}✕
    </div>
  );
};

export default GlobalAudioPlayer;
