import React, { createContext, useContext, useState, useRef } from 'react';
import { incrementPlayCount } from '../api/incrementPlayCount';

const GlobalMusicContext = createContext();

export const GlobalMusicProvider = ({ children }) => {
  // 음악 재생 관련 상태
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  // console.log('selectedMusic', selectedMusic);
  // console.log('selectedList', selectedList);
  // console.log('selectedId', selectedId);
  // console.log('isPlaying', isPlaying);
  // console.log('currentTime', currentTime);
  // console.log('isPlayerVisible', isPlayerVisible);

  // 오디오 제어용 ref
  const audioRef = useRef(null);
  const hasCountedRef = useRef(false);
  const prevTimeRef = useRef(0);

  const serverApi = process.env.REACT_APP_SERVER_API;

  // 음악 재생 함수
  const playMusic = ({ list, id, track }) => {
    console.log('🎵 playMusic 호출됨:', { list, id, track });
    console.log('🎵 현재 selectedMusic:', selectedMusic);

    // 같은 트랙이면 무시
    if (selectedMusic?.id === track?.id) {
      console.log('🎵 같은 트랙이므로 무시됨');
      return;
    }

    console.log('🎵 새로운 트랙 재생 시작');
    setSelectedList(list);
    setSelectedId(id);
    setSelectedMusic(track);
    setIsPlayerVisible(true);
    setIsPlaying(true);
    setUserPaused(false); // 새 트랙 재생 시 userPaused 리셋
    setCurrentTime(0);
    hasCountedRef.current = false;
    prevTimeRef.current = 0;
  };

  // 다음 곡 재생
  const handleNext = () => {
    if (!selectedList || !selectedMusic || !selectedId) return;

    const index = selectedList.indexOf(selectedMusic);
    const nextTrack = selectedList[(index + 1) % selectedList.length];

    setSelectedMusic(nextTrack);
    setCurrentTime(0);
    hasCountedRef.current = false;
    prevTimeRef.current = 0;
    setIsPlaying(true);
  };

  // 이전 곡 재생
  const handlePrev = () => {
    if (!selectedList || !selectedMusic || !selectedId) return;

    const index = selectedList.indexOf(selectedMusic);
    const prevIndex = (index - 1 + selectedList.length) % selectedList.length;
    const prevTrack = selectedList[prevIndex];

    setSelectedMusic(prevTrack);
    setCurrentTime(0);
    hasCountedRef.current = false;
    prevTimeRef.current = 0;
    setIsPlaying(true);
  };

  // 시간 업데이트 및 재생 카운트 처리
  const handleTimeUpdate = async time => {
    setCurrentTime(time);

    // 현재 재생 시간이 이전 재생 시간보다 작으면 hasCountedRef를 false로 설정
    if (time < prevTimeRef.current) {
      hasCountedRef.current = false;
    }
    prevTimeRef.current = time;

    // 아직 POST 요청을 보내지 않았고, 현재 재생 시간이 90초 이상이면 POST 요청 실행
    if (!hasCountedRef.current && time >= 90 && selectedMusic?.id && serverApi) {
      try {
        await incrementPlayCount(selectedMusic.id, serverApi);
        hasCountedRef.current = true;
      } catch (error) {
        console.error('재생 카운트 증가 에러:', error);
      }
    }
  };

  // 재생/일시정지 토글
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // 플레이어 숨기기
  const hidePlayer = () => {
    setIsPlayerVisible(false);
    setSelectedMusic(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const value = {
    // 상태
    selectedMusic,
    selectedList,
    selectedId,
    isPlaying,
    userPaused,
    currentTime,
    isPlayerVisible,
    audioRef,

    // 함수
    playMusic,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    togglePlayPause,
    hidePlayer,
    setIsPlaying,
    setSelectedMusic,
    setUserPaused,
  };

  return <GlobalMusicContext.Provider value={value}>{children}</GlobalMusicContext.Provider>;
};

export const useGlobalMusic = () => {
  const context = useContext(GlobalMusicContext);
  if (!context) {
    throw new Error('useGlobalMusic must be used within a GlobalMusicProvider');
  }
  return context;
};
