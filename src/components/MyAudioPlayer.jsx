// components/MyAudioPlayer.js
import React, { useContext, useRef, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AuthContext } from '../contexts/AuthContext';
import { incrementPlayCount } from '../api/incrementPlayCount';

const MyAudioPlayer = ({
    track,
    onTimeUpdate,
    onClickPrevious,
    onClickNext,
    getTracks,
    handleGetMusicList,
    setIsPlaying,
    audioRef,
}) => {
    const { token } = useContext(AuthContext);
    const serverApi = process.env.REACT_APP_SERVER_API;
    // hasCounted를 useRef로 관리하여 즉시 업데이트할 수 있도록 합니다.
    const hasCountedRef = useRef(false);
    const [prevTime, setPrevTime] = useState(0);

    const handleListen = async (e) => {
        const currentTime = e.target.currentTime;

        // 현재 재생 시간이 이전 재생 시간보다 작으면 hasCountedRef를 false로 설정
        if (currentTime < prevTime) {
            hasCountedRef.current = false;
        }
        setPrevTime(currentTime);

        // 아직 POST 요청을 보내지 않았고, 현재 재생 시간이 90초 이상이면 POST 요청 실행
        if (!hasCountedRef.current && currentTime >= 90) {
            const success = await incrementPlayCount(track?.id, serverApi);
            if (success) {
                // 재생 시간 업데이트 후 getTracks 호출
                if (getTracks) {
                    getTracks();
                }
                // 재생 목록을 가져오는 함수 호출
                if (handleGetMusicList) {
                    handleGetMusicList();
                }
            }
            hasCountedRef.current = true;
        }

        // 부모 컴포넌트로 재생 시간 업데이트 전달
        if (onTimeUpdate) {
            onTimeUpdate(currentTime);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true); // 재생 시작 시 playing 상태를 true로 설정
    };

    // Pause 상태 변경
    const handlePause = () => {
        setIsPlaying(false); // 재생 멈추면 playing 상태를 false로 설정
    };

    useEffect(() => {
        // 트랙이 변경될 때마다 playing 상태를 false로 설정
        setIsPlaying(false);
    }, [track, setIsPlaying]);


    const handleEnded = () => {
        setIsPlaying(false);
        if (onClickNext) {
          onClickNext(); // 다음 트랙으로 넘기기
        }
    };

    return (
        <AudioPlayer
            ref={audioRef} 
            key={track?.id}
            src={track?.music_url}
            autoPlay={true}
            loop={false}
            showSkipControls={true}
            onPlay={handlePlay} // 재생 시작 시 handlePlay 호출
            onPause={handlePause} // 일시정지 시 handlePause 호출
            // onListen={onTimeUpdate} // 부모 컴포넌트로 시간 업데이트 전달
            onListen={handleListen}
            onEnded={handleEnded}
            // onPlay={() => console.log(`${track?.title} 재생 시작`)}
            listenInterval={1000}
            onClickPrevious={onClickPrevious}
            onClickNext={onClickNext}
        />
    );
};

export default MyAudioPlayer;
