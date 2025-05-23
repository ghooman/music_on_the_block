
import AudioPlayer from "react-modern-audio-player";
import "react-modern-audio-player/dist/index.css";   // ⑤: 스타일이 없으면 직접 import
import './MusicPlayer.scss';

import demoImg from '../assets/images/demo-cover-img.png';
import track1 from '../assets/music/nisoft_song.mp3';



const playList = [
  {
    id: 1,
    src: track1,
    img: demoImg,
    name: "I Just Wanna Dance",     // 제목
    writer: "Kim Nac-il",           // 아티스트
    description: "MOTB Demo Track"  // 한 줄 설명(선택)
  },
  {
    id: 2,
    src: track1,
    img: demoImg,
    name: "Endless Loop",
    writer: "AI Composer",
    description: "Generated with MOTB v2"
  }
];

export default function MusicPlayer() {
  return (
    <>
      <AudioPlayer
        playList={playList}
        activeUI={{ all: true, progress: "bar" }}      // ⑥: 먼저 bar 모드로 확인
        placement={{ player: "bottom" }}
        rootContainerProps={{ position: "fixed", width: "100%" }}
      />

    </>


  );
}
