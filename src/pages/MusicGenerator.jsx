// MusicGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './music-generator.scss';

const MusicGenerator = () => {
  const [lyrics, setLyrics] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('auto');
  const [status, setStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = 'https://api.mureka.ai/v1/song/generate'; // 실제 엔드포인트로 변경

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('preparing');
    setError(null);

    try {
      const response = await axios.post(
        API_URL,
        {
          lyrics,
          prompt,
          model,
        },
        {
          headers: {
            Authorization: `Bearer ${'op_mag4gx3uHbHKxB7NE5b8v8pbVuUmfT8'}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { id, status: taskStatus } = response.data;
      setTaskId(id);
      setStatus(taskStatus);
      console.log('음악 생성 데이터 :', response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
      setStatus('failed');
    }
  };

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
          {taskId && <span> (Task ID: {taskId})</span>}
        </div>
      )}
      {error && (
        <div className="music-generator__error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
