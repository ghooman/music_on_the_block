// import React, { useState, useRef, useEffect } from 'react';
// import { VisualizeAudio } from 'react-audio-visualize';

// const VisualizeAudio = () => {
//   const [blob, setBlob] = useState(null);
//   const audioRef = useRef(null);
//   const visualizerRef = useRef(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       console.log('Selected File:', file);
//       const blobUrl = URL.createObjectURL(file);
//       setBlob(file);
//     }
//   };

//   const togglePlay = () => {
//     if (audioRef.current) {
//       if (audioRef.current.paused) {
//         audioRef.current
//           .play()
//           .catch((error) => console.error('Play error:', error));
//       } else {
//         audioRef.current.pause();
//       }
//     }
//   };


  
//   return (
//     <div>
//       <input type="file" accept="audio/*" onChange={handleFileChange} />
//       {blob && (
//         <>
//           <audio
//             ref={audioRef}
//             src={URL.createObjectURL(blob)}
//             controls
//             onPlay={() => console.log('Audio playing')}
//             onPause={() => console.log('Audio paused')}
//           />
//           <button onClick={togglePlay}>Play / Pause</button>
//           <VisualizeAudio
//             ref={visualizerRef}
//             blob={blob}
//             width={500}
//             height={100}
//             barWidth={2}
//             gap={2}
//             // currentTime={audioRef.current}
//             currentTime={audioRef.current?.currentTime}
//             barColor="#00ff00"
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default VisualizeAudio;





// import React, { useState, useEffect } from 'react';
// import { VisualizeAudio } from 'react-audio-visualize';

// const VisualizeAudio = ({ audioUrl }) => {
//   const [blob, setBlob] = useState(null);

//   useEffect(() => {
//     if (!audioUrl) return;

//     // Fetch API로 audioUrl 가져와 Blob 생성
//     const fetchAudioBlob = async () => {
//       try {
//         const response = await fetch(audioUrl);
//         if (!response.ok) throw new Error('Failed to fetch audio');
//         const audioBlob = await response.blob();
//         console.log('Blob 생성 성공:', audioBlob); // Blob 확인
//         setBlob(audioBlob);
//       } catch (error) {
//         console.error('오디오 가져오기 실패:', error);
//       }
//     };

//     fetchAudioBlob();
//   }, [audioUrl]);

//   return (
//     <div>
//       <audio src={audioUrl} controls />
//       {blob && (
//         <VisualizeAudio
//           blob={blob}
//           width={500}
//           height={100}
//           barWidth={3}
//           gap={2}
//           barColor="#00f"
//           backgroundColor="#fff"
//         />
//       )}
//     </div>
//   );
// };

// export default VisualizeAudio;













import React, { useRef, useEffect } from "react";

const VisualizeAudio = ({ audioUrl }) => {
  const audioRef = useRef(null); // <audio> 태그 참조
  const canvasRef = useRef(null); // <canvas> 태그 참조
  const audioCtxRef = useRef(null); // AudioContext 참조
  const analyserRef = useRef(null); // AnalyserNode 참조
  const sourceRef = useRef(null); // MediaElementSourceNode 참조

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    if (!audioCtxRef.current) {
      // AudioContext 생성 (최초에만 실행)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!analyserRef.current) {
      // AnalyserNode 생성 (최초에만 실행)
      analyserRef.current = audioCtxRef.current.createAnalyser();
    }

    if (!sourceRef.current) {
      // MediaElementSourceNode 연결 (최초에만 실행)
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }

    // 분석기 설정
    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // 그리기 함수
    const draw = () => {
      requestAnimationFrame(draw);

      analyserRef.current.getByteTimeDomainData(dataArray);

      // 캔버스 초기화
      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";

      canvasCtx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 정규화
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

    // 오디오 컨텍스트 관리
    const handlePlay = () => {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };
    audio.addEventListener("play", handlePlay);

    // Cleanup
    return () => {
      audio.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <div>
      <audio ref={audioRef} controls src={audioUrl} />
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        style={{ display: "block", marginTop: "20px" }}
      />
    </div>
  );
};

export default VisualizeAudio;
