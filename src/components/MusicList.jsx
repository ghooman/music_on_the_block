import React, { useState, useEffect, useRef } from 'react';
import ReactWaves from '@dschoon/react-waves';
import track1 from '../assets/music/song01.mp3';
import track2 from '../assets/music/nisoft_song.mp3';
import track3 from '../assets/music/MusicOnTheBlock_v1.mp3';

// 초기 트랙 리스트
const initialTracks = [
  { source: track3, title: 'Zimt' },
  // { source: track2, title: 'Ingwer' },
];

const MusicList = ({ initialState = {}, onStateChange }) => {
  const audioRef = useRef(null);

  const [tracks] = useState(initialTracks);
  const [track] = useState(initialTracks[0]); // 트랙 변경 기능이 필요하다면 setTrack 추가
  const [playing, setPlaying] = useState(initialState.playing || false);
  const [currentTime, setCurrentTime] = useState(initialState.currentTime || '0:00');
  const [duration, setDuration] = useState(initialState.duration || '0:00');
  const [isLoaded, setIsLoaded] = useState(initialState.isLoaded || false);

  // 트랙이 바뀔 때마다 audio 로드 및 자동 재생 시도
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = async () => {
      setIsLoaded(true);
      onStateChange?.({ isLoaded: true });

      try {
        await audio.play();
        setPlaying(true);
        onStateChange?.({ playing: true });
      } catch (e) {
        console.warn('자동재생 실패:', e);
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.load();

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [track, onStateChange]);

  // 메타데이터 로드 시 duration 업데이트, 재생 중 시간 갱신
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const formatted = formatTime(audio.duration);
      setDuration(formatted);
      onStateChange?.({ duration: formatted });
    };
    const handleTimeUpdate = () => {
      const formatted = formatTime(audio.currentTime);
      setCurrentTime(formatted);
      onStateChange?.({ currentTime: formatted });
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onStateChange]);

  // 로드 완료 후 이전 재생 위치 복원
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isLoaded && currentTime !== '0:00') {
      const [mins, secs] = currentTime.split(':').map(Number);
      audio.currentTime = mins * 60 + secs;
    }
  }, [isLoaded, currentTime]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
    onStateChange?.({ playing: !playing });
  };

  const handlePositionChange = time => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    const formatted = formatTime(time);
    setCurrentTime(formatted);
    onStateChange?.({ currentTime: formatted });
  };

  return (
    <>
      <div className="play-btn" onClick={togglePlay}>
        {!playing ? '▶' : '■'}
      </div>

      {isLoaded && audioRef.current && (
        <div style={{ width: '100%' }}>
          <ReactWaves
            audioFile={track.source}
            className="react-waves"
            options={{
              barWidth: 2,
              barHeight: 0,
              barGap: 3,
              backend: 'MediaElement',
              normalize: true,
              cursorWidth: 3,
              mediaType: 'audio',
              hideScrollbar: true,
              responsive: true,
              progressColor: '#CF0',
              waveColor: '#E9EFF4',
            }}
            zoom={1}
            playing={playing}
            mediaElt={audioRef.current}
            onPositionChange={handlePositionChange}
            autoPlay={true}
          />
        </div>
      )}

      <audio ref={audioRef} src={track.source} preload="auto" style={{ display: 'none' }} />

      <div className="time-text">
        <span>{currentTime}</span> / <span>{duration}</span>
      </div>
    </>
  );
};

export default MusicList;
