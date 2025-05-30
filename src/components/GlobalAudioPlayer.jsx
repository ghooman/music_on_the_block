import React, { useMemo, useCallback, useEffect, useRef } from 'react';
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

  // 직접 오디오 요소를 추적하기 위한 ref
  const audioElementRef = useRef(null);

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

  // 시간 업데이트만 처리하는 단순한 로직
  useEffect(() => {
    if (!isPlayerVisible) return;

    let findAudioInterval;
    let audioElement = null;

    const handleTimeUpdateEvent = () => {
      if (audioElement) {
        const currentTime = audioElement.currentTime;
        handleTimeUpdate(currentTime);
      }
    };

    const findAudioElement = () => {
      audioElement = document.querySelector('#rm-audio-player audio');
      if (audioElement) {
        audioElementRef.current = audioElement;
        audioElement.addEventListener('timeupdate', handleTimeUpdateEvent);
        return true;
      }
      return false;
    };

    // 오디오 요소를 찾을 때까지 재시도
    findAudioInterval = setInterval(() => {
      if (findAudioElement()) {
        clearInterval(findAudioInterval);
      }
    }, 100);

    // cleanup 함수
    return () => {
      if (findAudioInterval) {
        clearInterval(findAudioInterval);
      }
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdateEvent);
      }
    };
  }, [isPlayerVisible, handleTimeUpdate]);

  // 오디오 이벤트 핸들러들 - 단순화
  const handleAudioPlay = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handleAudioPause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  if (!isPlayerVisible || !selectedMusic || playList.length === 0) {
    return null;
  }

  return (
    <div className="global-audio-player-wrapper">
      <AudioPlayer
        playList={playList}
        activeUI={{ all: true, progress: 'bar' }}
        placement={{ player: 'bottom' }}
        rootContainerProps={{
          position: 'fixed',
          width: '100%',
          zIndex: 10,
          id: 'rm-audio-player',
        }}
        audioInitialState={{
          isPlaying: isPlaying,
          curPlayId: selectedMusic.id,
          currentTrackIndex: currentTrackIndex,
        }}
        onAudioPlay={handleAudioPlay}
        onAudioPause={handleAudioPause}
        onAudioEnded={handleAudioEnded}
      />
    </div>
  );
};

export default GlobalAudioPlayer;
