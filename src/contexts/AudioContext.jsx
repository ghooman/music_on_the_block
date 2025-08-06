import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { likeAlbum, cancelLikeAlbum } from '../api/AlbumLike';

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

  // 자동 재생 옵션
  const [isContinue, setIsContinue] = useState(true);

  // 음소거 상태 추가
  const [isMuted, setIsMuted] = useState(false);

  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1); // 음소거 해제 시 복원할 볼륨

  // 재생 키 (매번 새로운 재생을 위해)
  const [playKey, setPlayKey] = useState(0);

  // 오디오 관련 ref
  const audioRef = useRef(null);

  // 스크롤 상태 (PlayerHeader 표시용)
  const [isScrolled, setIsScrolled] = useState(false);

  // 전역 좋아요 처리 함수
  const handleGlobalLike = useCallback(
    async (trackId, token, onPageUpdate, currentPageLikeData = null) => {
      if (!token) return;

      try {
        let newLikeStatus;
        let newLikeCount;

        // currentTrack이 같은 트랙인 경우 현재 상태 사용, 아니면 페이지에서 전달받은 상태 사용
        let currentLikeStatus = false;
        let currentLikeCount = 0;

        // currentTrack에서 좋아요 상태 확인 (같은 트랙인 경우)
        if (currentTrack && currentTrack.id === trackId) {
          currentLikeStatus = currentTrack.is_like;
          currentLikeCount = currentTrack.like;
        } else if (currentPageLikeData) {
          // 페이지에서 전달받은 좋아요 상태 사용
          currentLikeStatus = currentPageLikeData.is_like;
          currentLikeCount = currentPageLikeData.like;
        }

        if (currentLikeStatus) {
          await cancelLikeAlbum(trackId, token);
          newLikeStatus = false;
          newLikeCount = Math.max(0, currentLikeCount - 1);
        } else {
          await likeAlbum(trackId, token);
          newLikeStatus = true;
          newLikeCount = currentLikeCount + 1;
        }

        // currentTrack 업데이트 (PlayerHeader 반영)
        if (currentTrack && currentTrack.id === trackId) {
          setCurrentTrack(prev => ({
            ...prev,
            like: newLikeCount,
            is_like: newLikeStatus,
          }));
        }

        // 페이지별 상태 업데이트 콜백 실행
        if (onPageUpdate) {
          onPageUpdate(newLikeCount, newLikeStatus);
        }

        return { like: newLikeCount, is_like: newLikeStatus };
      } catch (error) {
        console.error('좋아요 처리 에러:', error);
        throw error;
      }
    },
    [currentTrack]
  );

  // 음악 재생 함수
  const playTrack = useCallback(
    ({ track, playlist = [], playlistId = null, continuePlay = true }) => {
      console.log('🔊 playTrack called', {
        track,
        preventAutoPlay: sessionStorage.getItem('preventAutoPlay'),
      });

      setCurrentTrack(track);
      setCurrentPlaylist(playlist);
      setCurrentPlaylistId(playlistId);
      setIsContinue(continuePlay);
      setCurrentTime(0);
      setPlayKey(prev => prev + 1);

      const preventAutoPlay = sessionStorage.getItem('preventAutoPlay') === 'true';

      if (!preventAutoPlay) {
        console.log('⛔ Auto play prevented at playTrack');
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);

      setTimeout(() => {
        const audioElement = audioRef.current?.audio?.current;
        if (audioElement) {
          audioElement.currentTime = 0;
          audioElement.play().catch(console.error);
        }
      }, 100);
    },
    []
  );

  // 다음 곡 재생
  const playNext = useCallback(() => {
    if (!currentPlaylist.length || !currentTrack) return;

    // ✅ preventAutoPlay가 설정되지 않았으면 자동재생 하지 않음
    const preventAutoPlay = sessionStorage.getItem('preventAutoPlay') !== 'true';
    if (preventAutoPlay) {
      console.log('자동재생 방지됨 (playNext)');
      return; // B 재생하지 않음
    }

    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;

    if (currentIndex === currentPlaylist.length - 1 && !isContinue) {
      setIsPlaying(false);
      return;
    }

    const nextTrack = currentPlaylist[nextIndex];

    setCurrentTrack({
      ...nextTrack,
      music_url: nextTrack?.music_url || nextTrack?.nft_music_url,
    });

    setCurrentTime(0);

    setTimeout(() => {
      const audioElement = audioRef.current?.audio?.current;
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 100);
  }, [currentPlaylist, currentTrack, isContinue]);

  // 이전 곡 재생
  const playPrevious = useCallback(() => {
    if (!currentPlaylist.length || !currentTrack) return;

    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    const prevTrack = currentPlaylist[prevIndex];

    setCurrentTrack({
      ...prevTrack,
      music_url: prevTrack?.music_url || prevTrack?.nft_music_url,
    });
    setCurrentTime(0);
  }, [currentPlaylist, currentTrack]);

  // 재생/일시정지 토글
  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;

    const audioElement = audioRef.current?.audio?.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play().catch(console.error);
        setIsPlaying(true);
      }
    } else {
      // audioRef가 없는 경우 상태만 변경
      setIsPlaying(prev => !prev);
    }
  }, [currentTrack, isPlaying]);

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

  // 음소거 토글 함수 추가
  const toggleMute = useCallback(() => {
    const audioElement = audioRef.current?.audio?.current;
    if (audioElement) {
      if (isMuted) {
        // 음소거 해제: 이전 볼륨으로 복원
        const restoreVolume = previousVolume > 0 ? previousVolume : 0.5;
        audioElement.volume = restoreVolume;
        audioElement.muted = false;
        setVolume(restoreVolume);
        setIsMuted(false);
      } else {
        // 음소거 활성화: 현재 볼륨 저장하고 0으로 설정
        setPreviousVolume(volume);
        audioElement.volume = 0;
        audioElement.muted = true;
        setVolume(0);
        setIsMuted(true);
      }
    }
  }, [isMuted, volume, previousVolume]);

  // 볼륨 설정 함수 추가
  const handleVolumeChange = useCallback(
    newVolume => {
      const audioElement = audioRef.current?.audio?.current;
      if (audioElement) {
        audioElement.volume = newVolume;
        audioElement.muted = newVolume === 0;
        setVolume(newVolume);

        // 볼륨이 0이면 음소거 상태로, 0보다 크면 음소거 해제
        if (newVolume === 0) {
          setIsMuted(true);
        } else {
          if (isMuted) {
            setIsMuted(false);
          }
          // 볼륨이 0보다 크면 이전 볼륨으로 기록
          setPreviousVolume(newVolume);
        }
      }
    },
    [isMuted]
  );

  const value = {
    // 상태
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    currentPlaylist,
    currentPlaylistId,
    isContinue,
    isScrolled,
    audioRef,
    playKey,
    isMuted,
    volume,

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
    setIsContinue,
    toggleMute,
    handleVolumeChange,
    handleGlobalLike,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
