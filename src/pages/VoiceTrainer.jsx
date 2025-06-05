// src/pages/VoiceTrainer.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './VoiceTrainer.scss';

const VoiceTrainer = () => {
  const kitsApiKey = process.env.REACT_APP_KITS_AI_KEY;

  // 사용할 음성 모델 목록
  const [voiceModels, setVoiceModels] = useState([]);
  // 선택된 음성 모델 ID
  const [selectedModelId, setSelectedModelId] = useState('');
  // 업로드할 오디오 파일
  const [selectedFile, setSelectedFile] = useState(null);
  // 변환 강도 (0 ~ 1)
  const [conversionStrength, setConversionStrength] = useState(0.5);
  // 모델 볼륨 혼합 비율 (0 ~ 1)
  const [modelVolumeMix, setModelVolumeMix] = useState(0.5);
  // 피치 시프트 (음계 반음 단위, -24 ~ 24)
  const [pitchShift, setPitchShift] = useState(0);
  // 변환 작업 ID
  const jobIdRef = useRef(null);
  // 작업 상태 ('idle' | 'uploading' | 'running' | 'completed' | 'error')
  const [jobStatus, setJobStatus] = useState('idle');
  // 변환된 음성 파일 URL
  const [convertedUrl, setConvertedUrl] = useState('');
  // 업로드 진행률 (0 ~ 100)
  const [uploadProgress, setUploadProgress] = useState(0);
  // 에러 메시지
  const [errorMessage, setErrorMessage] = useState('');

  // 컴포넌트 마운트 시 음성 모델 목록을 가져옵니다
  useEffect(() => {
    const fetchVoiceModels = async () => {
      try {
        const response = await axios.get('https://arpeggi.io/api/kits/v1/voice-models', {
          headers: {
            Authorization: `Bearer ${kitsApiKey}`,
          },
        });
        setVoiceModels(response.data);
        if (response.data.length > 0) {
          setSelectedModelId(response.data[0].id);
        }
      } catch (err) {
        console.error(err);
        setErrorMessage('음성 모델 목록을 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchVoiceModels();
  }, []);

  // 파일 선택 핸들러
  const handleFileChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadProgress(0);
      setJobStatus('idle');
      setConvertedUrl('');
      setErrorMessage('');
    }
  };

  // 변환 요청 함수
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

      // 반환된 작업 ID 저장 후 상태 폴링 시작
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

  // 작업 상태 폴링 함수
  const pollConversionStatus = async jobId => {
    try {
      const statusResponse = await axios.get(
        `https://arpeggi.io/api/kits/v1/voice-conversions/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${kitsApiKey}`,
          },
        }
      );
      const { status, resultUrl } = statusResponse.data;

      if (status === 'completed') {
        setJobStatus('completed');
        setConvertedUrl(resultUrl); // API에서 반환되는 변환된 파일 URL 필드 이름 예시
      } else if (status === 'failed') {
        setErrorMessage('음성 변환 작업이 실패했습니다.');
        setJobStatus('error');
      } else {
        // 작업이 아직 진행 중이면 일정 시간 후 재호출
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

      {/* 음성 모델 선택 */}
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
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* 파라미터 설정 */}
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

      {/* 파일 선택 */}
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

      {/* 변환 요청 버튼 */}
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

      {/* 상태 표시 */}
      <div className="status">
        {jobStatus === 'uploading' && <p>업로드 중: {uploadProgress}%</p>}
        {jobStatus === 'running' && <p>변환 작업 실행 중입니다...</p>}
        {jobStatus === 'completed' && <p>변환이 완료되었습니다.</p>}
        {jobStatus === 'error' && <p className="error">{errorMessage}</p>}
      </div>

      {/* 변환된 음성 미리 듣기 */}
      {jobStatus === 'completed' && convertedUrl && (
        <div className="player">
          <h3>변환된 음성 미리 듣기</h3>
          <audio controls src={convertedUrl}>
            브라우저가 audio 태그를 지원하지 않습니다.
          </audio>
        </div>
      )}

      {errorMessage && jobStatus !== 'error' && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default VoiceTrainer;
