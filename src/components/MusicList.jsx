import React, { createRef, Component } from 'react';
import ReactWaves from '@dschoon/react-waves';
import track1 from '../assets/music/song01.mp3';
import track2 from '../assets/music/nisoft_song.mp3';
import track3 from '../assets/music/MusicOnTheBlock_v1.mp3';

class MusicList extends Component {
  initialTracks = {
    tracks: [
      { source: track3, title: 'Zimt' },
      // { source: track2, title: "Ingwer" },
    ],
  };

  constructor(props) {
    super(props);
    this.audioRef = createRef();
    this.state = {
      playing: props.initialState?.playing || false,
      mediaElt: null,
      tracks: this.initialTracks.tracks,
      track: this.initialTracks.tracks[0],
      currentTime: props.initialState?.currentTime || '0:00',
      duration: props.initialState?.duration || '0:00',
      isLoaded: props.initialState?.isLoaded || false,
    };
  }

  canPlayHandler = () => {
    const mediaElement = this.audioRef.current;
    if (!mediaElement) return;

    this.setState({ mediaElt: mediaElement, isLoaded: true }, async () => {
      this.props.onStateChange?.({ isLoaded: true });

      try {
        await mediaElement.play();
        this.setState({ playing: true });
        this.props.onStateChange?.({ playing: true });
      } catch (e) {
        console.warn('자동재생 실패:', e);
      }
    });
  };

  componentDidMount() {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.addEventListener('timeupdate', this.updateTime);
      mediaElement.addEventListener('loadedmetadata', this.updateDuration);
      mediaElement.addEventListener('canplaythrough', this.canPlayHandler);

      mediaElement.load(); // 명시적 로드 트리거
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const mediaElement = this.audioRef.current;

    // 트랙이 바뀌면 새로 로드하고 자동재생 트리거
    if (prevState.track.source !== this.state.track.source) {
      if (mediaElement) {
        mediaElement.load(); // 새 트랙 로드
      }
    }

    // mediaElt 등록 이후 재생 상태 복원
    if (!prevState.mediaElt && this.state.mediaElt) {
      if (mediaElement) {
        if (this.state.currentTime !== '0:00') {
          const [mins, secs] = this.state.currentTime.split(':').map(Number);
          mediaElement.currentTime = mins * 60 + secs;
        }
      }
    }
  }

  componentWillUnmount() {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.removeEventListener('timeupdate', this.updateTime);
      mediaElement.removeEventListener('loadedmetadata', this.updateDuration);
      mediaElement.removeEventListener('canplaythrough', this.canPlayHandler);
    }
    this.setState({ mediaElt: null, isLoaded: false });
  }

  updateTime = () => {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      const currentTime = this.formatTime(mediaElement.currentTime);
      this.setState({ currentTime }, () => {
        this.props.onStateChange?.({ currentTime });
      });
    }
  };

  updateDuration = () => {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      const duration = this.formatTime(mediaElement.duration);
      this.setState({ duration }, () => {
        this.props.onStateChange?.({ duration });
      });
    }
  };

  formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  togglePlay = () => {
    const { playing, mediaElt } = this.state;
    if (mediaElt) {
      if (playing) {
        mediaElt.pause();
      } else {
        mediaElt.play();
      }
      this.setState({ playing: !playing }, () => {
        this.props.onStateChange?.({ playing: !playing });
      });
    }
  };

  handlePositionChange = time => {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.currentTime = time;
      const currentTime = this.formatTime(time);
      this.setState({ currentTime }, () => {
        this.props.onStateChange?.({ currentTime });
      });
    }
  };

  render() {
    const { playing, currentTime, duration, track, mediaElt, isLoaded } = this.state;

    return (
      <>
        <div className="play-btn" onClick={this.togglePlay}>
          {!playing ? '▶' : '■'}
        </div>
        {isLoaded && mediaElt && (
          <div style={{ width: '100%' }}>
            <ReactWaves
              autoPlay={true}
              audioFile={track.source}
              className={'react-waves'}
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
              mediaElt={mediaElt}
              onPositionChange={this.handlePositionChange}
            />
          </div>
        )}
        <audio ref={this.audioRef} src={track.source} preload="auto" style={{ display: 'none' }} />
        <div className="time-text">
          <span>{currentTime}</span> / <span>{duration}</span>
        </div>
      </>
    );
  }
}

export default MusicList;
