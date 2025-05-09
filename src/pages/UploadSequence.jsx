// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import '../styles/UploadSequence.scss';

// const UploadSequence = () => {
//   const [uploadName, setUploadName] = useState('');
//   const [file, setFile] = useState(null);
//   const [statusLog, setStatusLog] = useState([]);
//   const [uploadsList, setUploadsList] = useState([]);
//   const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
//   const ffmpeg = FFmpeg.createFFmpeg({ log: true });

//   const addLog = msg => setStatusLog(prev => [...prev, msg]);

//   // Load ffmpeg once on mount
//   useEffect(() => {
//     const loadFfmpeg = async () => {
//       addLog('🌀 FFmpeg 로딩 중...');
//       await ffmpeg.load();
//       setIsFfmpegLoaded(true);
//       addLog('✅ FFmpeg 로딩 완료');
//     };
//     loadFfmpeg();
//   }, []);

//   // Converts mp4 file to mp3 blob
//   const convertToMp3 = async inputFile => {
//     const { name } = inputFile;
//     const outputName = 'output.mp3';
//     addLog(`🌀 파일 변환 중: ${name} → MP3`);
//     ffmpeg.FS('writeFile', name, await fetchFile(inputFile));
//     await ffmpeg.run('-i', name, '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', outputName);
//     const data = ffmpeg.FS('readFile', outputName);
//     addLog('✅ 변환 완료');
//     return new Blob([data.buffer], { type: 'audio/mpeg' });
//   };

//   const runSequence = async () => {
//     try {
//       // prepare file: convert if necessary
//       let uploadFile = file;
//       if (file && file.type === 'video/mp4') {
//         if (!isFfmpegLoaded)
//           throw new Error('FFmpeg가 아직 로딩되지 않았습니다. 잠시 후 다시 시도해주세요.');
//         const mp3Blob = await convertToMp3(file);
//         uploadFile = new File([mp3Blob], 'converted.mp3', { type: 'audio/mpeg' });
//       }

//       addLog('🌀 업로드 생성 중...');
//       const { data: createData } = await axios.post(
//         'https://api.mureka.ai/v1/uploads/create',
//         { upload_name: uploadName, purpose: 'fine-tuning' },
//         { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
//       );
//       const uploadId = createData.id;
//       addLog(`✅ 업로드 생성 완료 (ID: ${uploadId})`);

//       if (!uploadFile) throw new Error('파일이 선택되지 않았습니다.');
//       addLog('🌀 파트 추가 중...');
//       const formData = new FormData();
//       formData.append('upload_id', uploadId);
//       formData.append('file', uploadFile);
//       const { data: partData } = await axios.post(
//         'https://api.mureka.ai/v1/uploads/add',
//         formData,
//         { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
//       );
//       const partId = partData.id;
//       addLog(`✅ 파트 추가 완료 (Part ID: ${partId})`);

//       addLog('🌀 업로드 완료 요청 중...');
//       const { data: completeData } = await axios.post(
//         'https://api.mureka.ai/v1/uploads/complete',
//         { upload_id: uploadId, part_ids: [partId] },
//         { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
//       );
//       addLog(`✅ 업로드 완료 (상태: ${completeData.status})`);

//       addLog('🌀 파인튜닝 생성 중...');
//       const { data: fineData } = await axios.post(
//         'https://api.mureka.ai/v1/fine-tunes',
//         { training_file: uploadId },
//         { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
//       );
//       addLog(`⭐ 파인튜닝 작업 ID: ${fineData.id}`);

//       addLog('🌀 파인튜닝 상태 조회...');
//       const { data: statusData } = await axios.get(
//         `https://api.mureka.ai/v1/fine-tunes/${fineData.id}`,
//         { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
//       );
//       addLog(`🎯 파인튜닝 상태: ${statusData.status}`);
//     } catch (error) {
//       const msg = error.response?.data?.error?.message || error.message;
//       addLog(`❗️ 에러 발생: ${msg}`);
//       console.error(error);
//     }
//   };

//   const fetchUploadsList = async () => {
//     try {
//       addLog('🕵️‍♂️ 업로드 목록 조회 중...');
//       const { data } = await axios.get('https://api.mureka.ai/v1/uploads', {
//         headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` },
//       });
//       setUploadsList(data);
//       addLog('✅ 업로드 목록 조회 완료');
//     } catch (error) {
//       const msg = error.response?.data?.error?.message || error.message;
//       addLog(`❗️ 목록 조회 에러: ${msg}`);
//     }
//   };

//   return (
//     <div className="upload-sequence">
//       <h3 className="upload-sequence__title">Upload & Fine-tune</h3>
//       <div className="upload-sequence__form">
//         <input
//           type="text"
//           className="upload-sequence__input"
//           placeholder="Enter upload name"
//           value={uploadName}
//           onChange={e => setUploadName(e.target.value)}
//         />
//         <label className="upload-sequence__file-wrapper">
//           <input
//             type="file"
//             accept="audio/mp3,video/mp4"
//             className="upload-sequence__file-input"
//             onChange={e => setFile(e.target.files[0])}
//           />
//           <span>{file ? file.name : 'Select MP3 or MP4 file'}</span>
//         </label>
//         <div className="upload-sequence__button-group">
//           <button
//             className="upload-sequence__button"
//             onClick={runSequence}
//             disabled={!uploadName || !file}
//           >
//             Start
//           </button>
//           <button className="upload-sequence__fetch-button" onClick={fetchUploadsList}>
//             목록 조회
//           </button>
//         </div>
//       </div>

//       {uploadsList.length > 0 && (
//         <ul className="upload-sequence__uploads-list">
//           {uploadsList.map(item => (
//             <li key={item.id} className="upload-sequence__uploads-item">
//               <strong>{item.upload_name}</strong> (ID: {item.id}) — 상태: {item.status}
//             </li>
//           ))}
//         </ul>
//       )}

//       <ul className="upload-sequence__log-list">
//         {statusLog.map((msg, idx) => (
//           <li key={idx} className="upload-sequence__log-item">
//             {msg}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UploadSequence;
