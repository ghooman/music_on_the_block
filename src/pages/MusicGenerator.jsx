// MusicGenerator.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './music-generator.scss';

const MusicGenerator = () => {
  const [lyrics, setLyrics] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('auto');
  const [status, setStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [choices, setChoices] = useState([]);
  const [error, setError] = useState(null);

  const POST_API_URL = 'https://api.mureka.ai/v1/song/generate';
  const GET_API_URL = 'https://api.mureka.ai/v1/song/query';

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('preparing');
    setError(null);
    setChoices([]);

    try {
      const { data } = await axios.post(
        POST_API_URL,
        { lyrics, prompt, model },
        {
          headers: {
            Authorization: `Bearer op_mag4gx3uHbHKxB7NE5b8v8pbVuUmfT8`,
            'Content-Type': 'application/json',
          },
        }
      );
      setTaskId(data.id);
      setStatus(data.status);
      console.log('POST 응답 데이터:', data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setStatus('failed');
    }
  };

  // 작업 상태 주기적 확인
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${GET_API_URL}/${taskId}`, {
          headers: {
            Authorization: `Bearer op_mag4gx3uHbHKxB7NE5b8v8pbVuUmfT8`,
            'Content-Type': 'application/json',
          },
        });
        setStatus(data.status);
        console.log('GET 응답 데이터:', data);

        if (data.status === 'succeeded' || data.status === 'completed') {
          clearInterval(interval);
          // choices 배열 전체를 저장
          setChoices(data.choices || []);
        }

        if (data.status === 'failed') {
          clearInterval(interval);
          setError('음악 생성에 실패했습니다.');
        }
      } catch (err) {
        clearInterval(interval);
        setError('상태 조회 중 오류가 발생했습니다.');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="music-generator">
      <h2 className="music-generator__title">Music Generator</h2>
      <form className="music-generator__form" onSubmit={handleSubmit}>
        <label className="music-generator__label" htmlFor="lyrics">
          Lyrics<span className="music-generator__required">*</span>
        </label>
        <textarea
          id="lyrics"
          className="music-generator__textarea"
          value={lyrics}
          onChange={e => setLyrics(e.target.value)}
          required
        />

        <label className="music-generator__label" htmlFor="prompt">
          Prompt
        </label>
        <input
          id="prompt"
          type="text"
          className="music-generator__input"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />

        <label className="music-generator__label" htmlFor="model">
          Model
        </label>
        <select
          id="model"
          className="music-generator__select"
          value={model}
          onChange={e => setModel(e.target.value)}
        >
          <option value="auto">auto</option>
          <option value="mureka-5.5">mureka-5.5</option>
          <option value="mureka-6">mureka-6</option>
        </select>

        <button type="submit" className="music-generator__button">
          Generate
        </button>
      </form>

      {status && (
        <div className={`music-generator__status music-generator__status--${status}`}>
          <strong>Status:</strong> {status}
        </div>
      )}
      {error && (
        <div className="music-generator__error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* 생성 완료된 choices를 audio player로 렌더링 */}
      {choices.length > 0 && (
        <div className="music-generator__results">
          <h3>Generated Tracks</h3>
          {choices.map((choice, idx) => (
            <div key={idx} className="music-generator__choice">
              <p>
                Choice {idx + 1} (duration: {choice.duration} ms)
              </p>
              <audio className="music-generator__audio" controls src={choice.url}>
                Your browser does not support the audio element.
              </audio>
              <p>
                <a href={choice.flac_url} target="_blank" rel="noopener noreferrer">
                  Download FLAC
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
