// pages/Suno.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Suno.scss';

const BASE_URL = 'https://apibox.erweima.ai';
const POST_API_URL = `${BASE_URL}/api/v1/generate`;
const GET_API_URL = `${BASE_URL}/api/v1/generate/record-info`;

const Suno = () => {
  const [prompt, setPrompt] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [instrumental, setInstrumental] = useState(false);
  const [styleText, setStyleText] = useState('');
  const [title, setTitle] = useState('');
  const [model, setModel] = useState('V3_5');
  const [status, setStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [tracks, setTracks] = useState([]); // 여기에 응답 데이터 저장
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('PENDING');
    setError(null);
    setTracks([]);

    const payload = {
      customMode,
      instrumental,
      model,
      callbackUrl: 'https://webhook.site/b28ff59d-b2cb-443b-b3e7-128d574f62dd',
      ...(customMode ? { style: styleText, title, ...(!instrumental && { prompt }) } : { prompt }),
    };

    console.log('전송 데이터:', payload);

    try {
      const res = await axios.post(POST_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_SUNO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('API 응답:', res.data);

      if (res.data.code !== 200) throw new Error(res.data.msg);

      const { callbackType, data: returnedData, task_id } = res.data.data;
      setTaskId(task_id);

      if (callbackType === 'text') {
        console.log('즉시 반환된 데이터:', returnedData);
        setTracks(returnedData);
        setStatus('SUCCESS');
      }
    } catch (err) {
      console.error('API 요청 실패:', err);
      setError(err.response?.data?.msg || err.message);
      setStatus('CREATE_TASK_FAILED');
    }
  };

  // ↓ polling(GET) 로직 추가
  useEffect(() => {
    if (!taskId || status === 'SUCCESS') return;
    const interval = setInterval(async () => {
      try {
        console.log('Polling 요청 - taskId:', taskId);
        const res = await axios.get(`${GET_API_URL}?task_id=${taskId}`, {
          headers: { Authorization: `Bearer ${process.env.REACT_APP_SUNO_API_KEY}` },
        });
        console.log('Polling 응답:', res.data);

        if (res.data.code !== 200) throw new Error(res.data.msg);

        const record = res.data.data;
        setStatus(record.status);
        if (record.status === 'SUCCESS') {
          console.log('최종 결과 데이터:', record.data || record.results);
          clearInterval(interval);
          setTracks(record.data || record.results || []);
        }
      } catch (err) {
        console.error('Polling 요청 실패:', err);
        clearInterval(interval);
        setError(err.response?.data?.msg || err.message);
        setStatus('CREATE_TASK_FAILED');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [taskId, status]);

  return (
    <div className="music-generator">
      <h2 className="music-generator__title">Music Generator</h2>

      <form className="music-generator__form" onSubmit={handleSubmit}>
        {/* customMode / instrumental 체크박스 */}
        <div className="music-generator__field">
          <label className="music-generator__label">
            <input
              type="checkbox"
              checked={customMode}
              onChange={e => setCustomMode(e.target.checked)}
            />{' '}
            Custom Mode
          </label>
        </div>
        <div className="music-generator__field">
          <label className="music-generator__label">
            <input
              type="checkbox"
              checked={instrumental}
              disabled={!customMode}
              onChange={e => setInstrumental(e.target.checked)}
            />{' '}
            Instrumental
          </label>
        </div>

        {/* prompt */}
        {(!customMode || !instrumental) && (
          <div className="music-generator__field">
            <label className="music-generator__label" htmlFor="prompt">
              Prompt<span className="music-generator__required">*</span>
            </label>
            <textarea
              id="prompt"
              className="music-generator__textarea"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              required
            />
          </div>
        )}

        {/* customMode=True일 때 style, title */}
        {customMode && (
          <>
            <div className="music-generator__field">
              <label className="music-generator__label" htmlFor="style">
                Style<span className="music-generator__required">*</span>
              </label>
              <input
                id="style"
                type="text"
                className="music-generator__input"
                value={styleText}
                onChange={e => setStyleText(e.target.value)}
                required
              />
            </div>
            <div className="music-generator__field">
              <label className="music-generator__label" htmlFor="title">
                Title<span className="music-generator__required">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="music-generator__input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {/* model 선택 */}
        <div className="music-generator__field">
          <label className="music-generator__label" htmlFor="model">
            Model
          </label>
          <select
            id="model"
            className="music-generator__select"
            value={model}
            onChange={e => setModel(e.target.value)}
          >
            <option value="V3_5">chirp-v3-5</option>
            <option value="V4">chirp-v4</option>
            <option value="V4_5">chirp-v4-5</option>
          </select>
        </div>

        <button type="submit" className="music-generator__button">
          Generate
        </button>
      </form>

      {status && (
        <div className={`music-generator__status music-generator__status--${status.toLowerCase()}`}>
          <strong>Status:</strong> {status}
        </div>
      )}
      {error && (
        <div className="music-generator__error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ↓ 성공 시 받은 데이터(트랙)를 화면에 출력 */}
      {status === 'SUCCESS' && tracks.length > 0 && (
        <div className="music-generator__results">
          <h3>Generated Tracks</h3>
          {tracks.map((track, idx) => (
            <div key={track.id || idx} className="music-generator__choice">
              <p>
                <strong>Choice {idx + 1}:</strong> {track.title} ({track.model_name})
              </p>
              {track.image_url && (
                <img
                  className="music-generator__image"
                  src={track.image_url}
                  alt={`Track ${idx + 1}`}
                />
              )}
              <audio
                className="music-generator__audio"
                controls
                src={track.stream_audio_url || track.audio_url}
              >
                Your browser does not support the audio element.
              </audio>
              {track.tags && <p className="music-generator__tags">Style: {track.tags}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suno;
