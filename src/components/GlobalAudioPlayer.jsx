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
    setSelectedMusic,
  } = useGlobalMusic();

  // 직접 오디오 요소를 추적하기 위한 ref
  const audioElementRef = useRef(null);
  const intervalRef = useRef(null);

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

  // 오디오 요소를 찾아서 시간 업데이트를 직접 처리
  useEffect(() => {
    if (!isPlayerVisible) return;

    let findAudioInterval;
    let syncInterval;
    let audioElement = null;

    const handleTimeUpdateEvent = () => {
      if (audioElement) {
        const currentTime = audioElement.currentTime;
        handleTimeUpdate(currentTime);
      }
    };

    // 플레이어 상태 동기화 함수
    const syncPlayerState = () => {
      const playerContainer = document.querySelector('#rm-audio-player');
      if (playerContainer && selectedList) {
        // 현재 재생 중인 트랙 정보 찾기
        const trackNameElement = playerContainer.querySelector(
          '.track-info .name, .rm-track-info .name, .track-name, [class*="track"][class*="name"]'
        );

        if (trackNameElement) {
          const currentTrackName = trackNameElement.textContent.trim();

          // 현재 표시된 트랙과 선택된 트랙이 다른 경우
          const currentTrack = selectedList.find(
            track => track.title === currentTrackName || track.name === currentTrackName
          );

          if (currentTrack && currentTrack.id !== selectedMusic?.id) {
            console.log('플레이어 상태 동기화:', currentTrack.title);
            setSelectedMusic(currentTrack);
          }
        }
      }
    };

    const findAudioElement = () => {
      audioElement = document.querySelector('#rm-audio-player audio');
      if (audioElement) {
        audioElementRef.current = audioElement;
        audioElement.addEventListener('timeupdate', handleTimeUpdateEvent);

        // 주기적으로 플레이어 상태 동기화
        syncInterval = setInterval(syncPlayerState, 1000);

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
      if (syncInterval) {
        clearInterval(syncInterval);
      }
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdateEvent);
      }
    };
  }, [isPlayerVisible, selectedMusic?.id, handleTimeUpdate, selectedList, setSelectedMusic]);

  // 오디오 이벤트 핸들러들
  const handleAudioPlay = useCallback(() => {
    console.log('재생 시작됨'); // 디버깅 로그
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handleAudioPause = useCallback(() => {
    console.log('재생 일시정지됨'); // 디버깅 로그
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleAudioEnded = useCallback(() => {
    console.log('재생 종료됨'); // 디버깅 로그
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
          isPlaying: false, // 자동 재생 방지
          curPlayId: selectedMusic.id,
          currentTrackIndex: currentTrackIndex,
        }}
        onAudioPlay={handleAudioPlay}
        onAudioPause={handleAudioPause}
        onAudioEnded={handleAudioEnded}
      />
      {/* 플레이어 닫기 버튼 */}✕
    </div>
  );
};

export default GlobalAudioPlayer;
