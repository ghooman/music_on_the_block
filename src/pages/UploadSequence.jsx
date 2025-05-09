// src/pages/UploadSequence.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import '../styles/UploadSequence.scss';

const ffmpeg = new FFmpeg();

const UploadSequence = () => {
  const [uploadName, setUploadName] = useState('');
  const [files, setFiles] = useState([]);
  const [statusLog, setStatusLog] = useState([]);
  const [uploadsList, setUploadsList] = useState([]);
  const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);

  const addLog = msg => setStatusLog(prev => [...prev, msg]);

  // FFmpeg 초기 로딩
  useEffect(() => {
    const loadFfmpeg = async () => {
      addLog('🌀 FFmpeg 로딩 중...');
      await ffmpeg.load();
      setIsFfmpegLoaded(true);
      addLog('✅ FFmpeg 로딩 완료');
    };
    loadFfmpeg();
  }, []);

  // MP4 -> MP3 변환 함수
  const convertToMp3 = async inputFile => {
    const inputName = inputFile.name;
    const outputName = 'output.mp3';
    addLog(`🌀 변환 시작: ${inputName} → MP3`);
    const data = new Uint8Array(await inputFile.arrayBuffer());
    await ffmpeg.writeFile(inputName, data);
    await ffmpeg.exec([
      '-i',
      inputName,
      '-vn',
      '-ar',
      '44100',
      '-ac',
      '2',
      '-b:a',
      '192k',
      outputName,
    ]);
    const result = await ffmpeg.readFile(outputName);
    addLog('✅ 변환 완료');
    return new Blob([result.buffer], { type: 'audio/mpeg' });
  };

  // 여러 파일을 하나의 업로드 세션으로 배치 전송
  const runSequence = async () => {
    if (!uploadName) {
      addLog('❗️ 업로드 이름을 입력하세요.');
      return;
    }
    const count = files.length;
    if (count === 0) {
      addLog('❗️ 파일을 선택하세요.');
      return;
    }
    // API 요구사항: 한 번에 100~200 파일
    if (count < 100 || count > 200) {
      addLog(
        `❗️ 오류: 선택된 파일 수가 API 요구사항(100~200개)과 맞지 않습니다. 현재: ${count}개`
      );
      return;
    }

    try {
      // 1) 업로드 생성
      addLog('🌀 업로드 생성 중...');
      const { data: createData } = await axios.post(
        'https://api.mureka.ai/v1/uploads/create',
        { upload_name: uploadName, purpose: 'fine-tuning' },
        { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
      );
      const uploadId = createData.id;
      addLog(`✅ 업로드 생성 완료 (ID: ${uploadId})`);

      // 2) 모든 파일을 파트로 추가
      const partIds = [];
      for (const inputFile of files) {
        let uploadFile = inputFile;
        if (inputFile.type === 'video/mp4') {
          if (!isFfmpegLoaded) throw new Error('FFmpeg 로딩 대기 중...');
          const mp3Blob = await convertToMp3(inputFile);
          uploadFile = new File([mp3Blob], inputFile.name.replace(/\..+$/, '') + '.mp3', {
            type: 'audio/mpeg',
          });
        }

        addLog(`🌀 파트 추가: ${uploadFile.name}`);
        const formData = new FormData();
        formData.append('upload_id', uploadId);
        formData.append('file', uploadFile);
        const { data: partData } = await axios.post(
          'https://api.mureka.ai/v1/uploads/add',
          formData,
          { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
        );
        partIds.push(partData.id);
        addLog(`✅ 파트 추가 완료 (Part ID: ${partData.id})`);
      }

      // 3) 업로드 완료 요청
      addLog('🌀 업로드 완료 요청');
      const { data: completeData } = await axios.post(
        'https://api.mureka.ai/v1/uploads/complete',
        { upload_id: uploadId, part_ids: partIds },
        { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
      );
      addLog(`✅ 업로드 완료 (상태: ${completeData.status})`);

      // 4) 파인튜닝 생성
      addLog('🌀 파인튜닝 생성 요청');
      const { data: fineData } = await axios.post(
        'https://api.mureka.ai/v1/fine-tunes',
        { training_file: uploadId },
        { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
      );
      addLog(`⭐ 파인튜닝 작업 생성 (ID: ${fineData.id})`);

      // 5) 파인튜닝 상태 조회
      addLog('🌀 파인튜닝 상태 조회');
      const { data: statusData } = await axios.get(
        `https://api.mureka.ai/v1/fine-tunes/${fineData.id}`,
        { headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` } }
      );
      addLog(`🎯 상태: ${statusData.status}`);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message;
      addLog(`❗️ 처리 실패: ${msg}`);
      console.error(err);
    }
  };

  // 업로드 목록 조회
  const fetchUploadsList = async () => {
    try {
      addLog('🕵️‍♂️ 업로드 목록 조회 중...');
      const { data } = await axios.get('https://api.mureka.ai/v1/uploads', {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_MUREKA_API_KEY}` },
      });
      setUploadsList(data);
      addLog('✅ 업로드 목록 조회 완료');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message;
      addLog(`❗️ 목록 조회 에러: ${msg}`);
    }
  };

  return (
    <div className="upload-sequence">
      <h3 className="upload-sequence__title">Upload & Fine-tune</h3>
      <div className="upload-sequence__form">
        <input
          type="text"
          className="upload-sequence__input"
          placeholder="Enter upload name"
          value={uploadName}
          onChange={e => setUploadName(e.target.value)}
        />
        <label className="upload-sequence__file-wrapper">
          <input
            type="file"
            multiple
            accept="audio/mp3,video/mp4"
            className="upload-sequence__file-input"
            onChange={e => setFiles([...e.target.files])}
          />
          <span>
            {files.length > 0 ? files.map(f => f.name).join(', ') : 'Select MP3 or MP4 files'}
          </span>
        </label>
        <div className="upload-sequence__button-group">
          <button
            className="upload-sequence__button"
            onClick={runSequence}
            disabled={!uploadName || files.length === 0}
          >
            Start All
          </button>
          <button className="upload-sequence__fetch-button" onClick={fetchUploadsList}>
            목록 조회
          </button>
        </div>
      </div>

      {uploadsList.length > 0 && (
        <ul className="upload-sequence__uploads-list">
          {uploadsList.map(item => (
            <li key={item.id} className="upload-sequence__uploads-item">
              <strong>{item.upload_name}</strong> (ID: {item.id}) — 상태: {item.status}
            </li>
          ))}
        </ul>
      )}

      <ul className="upload-sequence__log-list">
        {statusLog.map((msg, idx) => (
          <li key={idx} className="upload-sequence__log-item">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadSequence;
