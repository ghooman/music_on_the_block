import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  // 현재 재생중인 음악 정보
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 현재 재생목록 정보
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);

  // 오디오 관련 ref
  const audioRef = useRef(null);

  // 스크롤 상태 (PlayerHeader 표시용)
  const [isScrolled, setIsScrolled] = useState(false);

  // 음악 재생 함수
  const playTrack = useCallback(({ track, playlist = [], playlistId = null }) => {
    setCurrentTrack(track);
    setCurrentPlaylist(playlist);
    setCurrentPlaylistId(playlistId);
    setIsPlaying(true);
    setCurrentTime(0);
  }, []);

  // 다음 곡 재생
  const playNext = useCallback(() => {
    if (!currentPlaylist.length || !currentTrack) return;

    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    const nextTrack = currentPlaylist[nextIndex];

    setCurrentTrack(nextTrack);
    setCurrentTime(0);
  }, [currentPlaylist, currentTrack]);

  // 이전 곡 재생
  const playPrevious = useCallback(() => {
    if (!currentPlaylist.length || !currentTrack) return;

    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    const prevTrack = currentPlaylist[prevIndex];

    setCurrentTrack(prevTrack);
    setCurrentTime(0);
  }, [currentPlaylist, currentTrack]);

  // 재생/일시정지 토글
  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying(prev => !prev);
  }, [currentTrack]);

  // 시간 업데이트 핸들러
  const handleTimeUpdate = useCallback(time => {
    setCurrentTime(time);
  }, []);

  // 지속시간 설정
  const handleDurationChange = useCallback(duration => {
    setDuration(duration);
  }, []);

  // 현재 트랙이 재생목록에 있는지 확인하고 활성화 상태 반환
  const isTrackActive = useCallback(
    (track, playlistId) => {
      return currentTrack?.id === track.id && currentPlaylistId === playlistId;
    },
    [currentTrack, currentPlaylistId]
  );

  const value = {
    // 상태
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    currentPlaylist,
    currentPlaylistId,
    isScrolled,
    audioRef,

    // 액션들
    playTrack,
    playNext,
    playPrevious,
    togglePlayPause,
    handleTimeUpdate,
    handleDurationChange,
    isTrackActive,
    setIsPlaying,
    setIsScrolled,
    setCurrentTrack,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
