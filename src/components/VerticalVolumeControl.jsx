// components/VerticalVolumeControl.js

import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import './VerticalVolumeControl.scss';

const VerticalVolumeControl = ({ audioElement, isVolumeHovered, setIsVolumeHovered }) => {
  const { volume, handleVolumeChange } = useAudio();
  const [localVolume, setLocalVolume] = useState(volume);

  // AudioContext의 볼륨 상태와 동기화
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  // 오디오 요소의 초기 볼륨 설정
  useEffect(() => {
    if (!audioElement) return;

    // 초기 볼륨 동기화만 수행
    setLocalVolume(audioElement.volume);
  }, [audioElement]);

  const handleChange = e => {
    const newVol = parseFloat(e.target.value);
    setLocalVolume(newVol);
    handleVolumeChange(newVol);
  };

  return (
    <div
      className="vertical-volume-control"
      onMouseEnter={() => setIsVolumeHovered && setIsVolumeHovered(true)}
      onMouseLeave={() => setIsVolumeHovered && setIsVolumeHovered(false)}
    >
      <input
        className={`vertical-slider ${isVolumeHovered ? 'active' : ''}`}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={localVolume}
        onChange={handleChange}
        orient="vertical"
        // style={{
        //   display: isVolumeHovered ? 'block' : 'none',
        // }}
      />
    </div>
  );
};

export default VerticalVolumeControl;
