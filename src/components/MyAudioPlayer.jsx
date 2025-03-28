import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MyAudioPlayer = ({ track, onTimeUpdate, onClickPrevious, onClickNext }) => {
    const handleListen = (e) => {
        onTimeUpdate(e.target.currentTime);
    };

    return (
        <AudioPlayer
            key={track?.id}
            src={track?.music_url}
            autoPlay={true}
            loop={true}
            showSkipControls={true}
            onPlay={() => console.log(`${track?.title} 재생 시작`)}
            onListen={handleListen}
            listenInterval={1000}
            onClickPrevious={onClickPrevious}
            onClickNext={onClickNext}
        />
    );
};

export default MyAudioPlayer;
