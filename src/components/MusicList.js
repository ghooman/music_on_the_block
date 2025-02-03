import React, { createRef, Component } from "react";
import ReactWaves from "@dschoon/react-waves";
import track1 from "../assets/music/song01.mp3";
import track2 from "../assets/music/nisoft_song.mp3";

class MusicList extends Component {
  initialTracks = {
    tracks: [
      { source: track1, title: "Zimt" },
      { source: track2, title: "Ingwer" },
    ],
  };

  constructor(props) {
    super(props);
    this.audioRef = createRef();
    this.state = {
      playing: false,
      mediaElt: null,
      tracks: [
        { source: track1, title: "Zimt" },
        { source: track2, title: "Ingwer" },
      ],
      track: this.initialTracks.tracks[0],
      currentTime: "0:00",
      duration: "0:00",
    };
  }

  componentDidMount() {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.addEventListener("timeupdate", this.updateTime);
      mediaElement.addEventListener("loadedmetadata", this.updateDuration);
      this.setState({ mediaElt: mediaElement });
    }
  }

  componentWillUnmount() {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.removeEventListener("timeupdate", this.updateTime);
      mediaElement.removeEventListener("loadedmetadata", this.updateDuration);
    }
    this.setState({ mediaElt: null }); // Clean up mediaElt reference
  }

  updateTime = () => {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      const currentTime = this.formatTime(mediaElement.currentTime);
      this.setState({ currentTime });
    }
  };

  updateDuration = () => {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      const duration = this.formatTime(mediaElement.duration);
      this.setState({ duration });
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
      this.setState({ playing: !playing });
    }
  };

  handlePositionChange = (time) => {
    const mediaElement = this.audioRef.current;
    if (mediaElement) {
      mediaElement.currentTime = time; // Update the playback position
      const currentTime = this.formatTime(time);
      this.setState({ currentTime });
    }
  };

  render() {
    const { playing, currentTime, duration, track, mediaElt } = this.state;

    return (
      <>
        <div
          className="play-btn"
          onClick={this.togglePlay}
        >
          {!playing ? "▶" : "■"}
        </div>
        {mediaElt && (
          <ReactWaves
            audioFile={track.source}
            className={"react-waves"}
            options={{
              barWidth: 2,
              barHeight: 0,
              barGap: 5,
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
