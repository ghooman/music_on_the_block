import React, { createRef, Component } from "react";
import ReactWaves from "@dschoon/react-waves";
import track1 from "../assets/music/song01.mp3";
import track2 from "../assets/music/nisoft_song.mp3";
import track3 from "../assets/music/MusicOnTheBlock_v1.mp3";

class MusicList extends Component {
  initialTracks = {
    tracks: [
      { source: track3, title: "Zimt" },
      { source: track2, title: "Ingwer" },
    ],
  };

  constructor(props) {
    super(props);
    this.audioRef = createRef();
    this.state = {
      playing: props.initialState?.playing || false,
      mediaElt: null,
      tracks: [
        { source: track3, title: "Zimt" },
        { source: track2, title: "Ingwer" },
      ],
      track: this.initialTracks.tracks[0],
      currentTime: props.initialState?.currentTime || "0:00",
      duration: props.initialState?.duration || "0:00",
      isLoaded: props.initialState?.isLoaded || false
    };
  }

  componentDidMount() {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.addEventListener("timeupdate", this.updateTime);
      mediaElement.addEventListener("loadedmetadata", this.updateDuration);
      mediaElement.addEventListener("canplaythrough", () => {
        this.setState({ mediaElt: mediaElement, isLoaded: true }, () => {
          this.props.onStateChange?.({ isLoaded: true });
          // 페이지가 열리면 2초 뒤에 자동으로 재생
          // setTimeout(() => {
          //   this.togglePlay(); // 2초 뒤에 play() 호출
          // }, 2000);
        });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // mediaElt가 이전 상태에서 null이었다가 현재 상태에서 존재하는 경우
    if (!prevState.mediaElt && this.state.mediaElt) {
      const mediaElement = this.audioRef.current;
      if (mediaElement) {
        // 이전 재생 시간 복원
        if (this.state.currentTime !== "0:00") {
          const [mins, secs] = this.state.currentTime.split(":").map(Number);
          mediaElement.currentTime = mins * 60 + secs;
        }
        // 이전 재생 상태 복원
        if (this.state.playing) {
          mediaElement.play();
        }
      }
    }
  }

  componentWillUnmount() {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.removeEventListener("timeupdate", this.updateTime);
      mediaElement.removeEventListener("loadedmetadata", this.updateDuration);
      mediaElement.removeEventListener("canplaythrough", () => {});
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

  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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

  handlePositionChange = (time) => {
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
        <div
          className="play-btn"
          onClick={this.togglePlay}
        >
          {!playing ? "▶" : "■"}
        </div>
        {isLoaded && mediaElt && (
          <div style={{ width: "100%" }}>
            <ReactWaves
              audioFile={track.source}
              className={"react-waves"}
              options={{
                barWidth: 2,
                barHeight: 0,
                barGap: 3,
                backend: "MediaElement",
                normalize: true,
                cursorWidth: 3,
                mediaType: "audio",
                hideScrollbar: true,
                responsive: true,
                progressColor: "#CF0",
                waveColor: "#E9EFF4",
              }}
              zoom={1}
              playing={playing}
              mediaElt={mediaElt} 
              onPositionChange={this.handlePositionChange} 
            />
          </div>
        )}
        <audio
          ref={this.audioRef}
          src={track.source}
          preload="metadata"
          style={{ display: "none" }}
        />
        <div className="time-text">
          <span>{currentTime}</span> / <span>{duration}</span>
        </div>
      </>
    );
  }
}

export default MusicList;
