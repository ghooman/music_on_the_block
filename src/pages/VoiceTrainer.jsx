// src/pages/VoiceTrainer.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './VoiceTrainer.scss';

const VoiceTrainer = () => {
  const kitsApiKey = process.env.REACT_APP_KITS_AI_KEY;

  const [voiceModels, setVoiceModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionStrength, setConversionStrength] = useState(0.5);
  const [modelVolumeMix, setModelVolumeMix] = useState(0.5);
  const [pitchShift, setPitchShift] = useState(0);
  const jobIdRef = useRef(null);
  const [jobStatus, setJobStatus] = useState('idle');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchVoiceModels = async () => {
      try {
        const response = await axios.get('https://arpeggi.io/api/kits/v1/voice-models/1815024', {
          headers: { Authorization: `Bearer ${kitsApiKey}` },
        });
        console.log('fetchVoiceModels response:', response.data);
        if (Array.isArray(response.data.data)) {
          setVoiceModels(response.data.data);
          setSelectedModelId(response.data.data[0].id);
        } else {
          console.error('voice-models 응답 구조가 배열이 아닙니다:', response.data);
          setVoiceModels([response.data]);
          setSelectedModelId(response.data?.id);
          console.log('selectedModelId', selectedModelId);
        }
      } catch (err) {
        console.error(err);
        setErrorMessage('음성 모델 목록을 가져오는 중 오류가 발생했습니다.');
      }
    };
    fetchVoiceModels();
  }, [kitsApiKey]);

  const handleFileChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadProgress(0);
      setJobStatus('idle');
      setConvertedUrl('');
      setErrorMessage('');
    }
  };

  const createConversionJob = async () => {
    if (!selectedFile) {
      setErrorMessage('먼저 음성 파일을 선택해 주세요.');
      return;
    }
    if (!selectedModelId) {
      setErrorMessage('변환에 사용할 음성 모델을 선택해 주세요.');
      return;
    }

    setJobStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('voiceModelId', selectedModelId);
      formData.append('soundFile', selectedFile);
      formData.append('conversionStrength', conversionStrength);
      formData.append('modelVolumeMix', modelVolumeMix);
      formData.append('pitchShift', pitchShift);

      const response = await axios.post(
        'https://arpeggi.io/api/kits/v1/voice-conversions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${kitsApiKey}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );
      console.log('createConversionJob response:', response.data);

      const { id } = response.data;
      jobIdRef.current = id;
      setJobStatus('running');
      pollConversionStatus(id);
    } catch (err) {
      console.error(err);
      setErrorMessage('음성 변환 작업 생성 중 오류가 발생했습니다.');
      setJobStatus('error');
    }
  };

  const pollConversionStatus = async jobId => {
    try {
      const statusResponse = await axios.get(
        `https://arpeggi.io/api/kits/v1/voice-conversions/${jobId}`,
        { headers: { Authorization: `Bearer ${kitsApiKey}` } }
      );
      console.log('pollConversionStatus response:', statusResponse.data);

      const { status, outputFileUrl, lossyOutputFileUrl } = statusResponse.data;

      console.log(`현재 상태: ${status} (jobId: ${jobId})`);

      if (status === 'success') {
        setJobStatus('completed');
        setConvertedUrl(outputFileUrl || lossyOutputFileUrl);
      } else if (status === 'failed') {
        setErrorMessage('음성 변환 작업이 실패했습니다.');
        setJobStatus('error');
      } else {
        setTimeout(() => pollConversionStatus(jobId), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('작업 상태 확인 중 오류가 발생했습니다.');
      setJobStatus('error');
    }
  };

  return (
    <div className="voice-trainer">
      <h2>음성 변환기</h2>

      <div className="field">
        <label htmlFor="model-select">음성 모델 선택</label>
        <select
          id="model-select"
          value={selectedModelId}
          onChange={e => setSelectedModelId(e.target.value)}
          disabled={jobStatus === 'uploading' || jobStatus === 'running'}
        >
          {voiceModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.title || model.id}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="strength-input">변환 강도 (0 ~ 1)</label>
        <input
          id="strength-input"
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={conversionStrength}
          onChange={e => setConversionStrength(parseFloat(e.target.value))}
          disabled={jobStatus === 'uploading' || jobStatus === 'running'}
        />
      </div>

      <div className="field">
        <label htmlFor="volume-mix-input">모델 볼륨 혼합 비율 (0 ~ 1)</label>
        <input
          id="volume-mix-input"
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={modelVolumeMix}
          onChange={e => setModelVolumeMix(parseFloat(e.target.value))}
          disabled={jobStatus === 'uploading' || jobStatus === 'running'}
        />
      </div>

      <div className="field">
        <label htmlFor="pitch-input">피치 시프트 (-24 ~ 24)</label>
        <input
          id="pitch-input"
          type="number"
          step="1"
          min="-24"
          max="24"
          value={pitchShift}
          onChange={e => setPitchShift(parseInt(e.target.value, 10))}
          disabled={jobStatus === 'uploading' || jobStatus === 'running'}
        />
      </div>

      <div className="field">
        <label htmlFor="file-input">변환할 음성 파일 선택</label>
        <input
          id="file-input"
          type="file"
          accept="audio/wav, audio/mp3, audio/flac"
          onChange={handleFileChange}
          disabled={jobStatus === 'uploading' || jobStatus === 'running'}
        />
      </div>

      <div className="actions">
        <button
          onClick={createConversionJob}
          disabled={
            !selectedFile ||
            !selectedModelId ||
            jobStatus === 'uploading' ||
            jobStatus === 'running'
          }
        >
          음성 변환 시작
        </button>
      </div>

      <div className="status">
        {jobStatus === 'uploading' && <p>업로드 중: {uploadProgress}%</p>}
        {jobStatus === 'running' && <p>변환 작업 실행 중입니다...</p>}
        {jobStatus === 'completed' && <p>변환이 완료되었습니다.</p>}
        {jobStatus === 'error' && <p className="error">{errorMessage}</p>}
      </div>

      {jobStatus === 'completed' && convertedUrl && (
        <div className="player-container">
          <h3>변환된 음성 미리 듣기</h3>
          <div className="player-box">
            <audio controls src={convertedUrl}>
              브라우저가 audio 태그를 지원하지 않습니다.
            </audio>
            <a href={convertedUrl} download className="download-button">
              다운로드
            </a>
          </div>
        </div>
      )}

      {errorMessage && jobStatus !== 'error' && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default VoiceTrainer;
