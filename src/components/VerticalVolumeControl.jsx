// components/VerticalVolumeControl.js

import React, { useState, useEffect } from 'react';
import './VerticalVolumeControl.scss';

const VerticalVolumeControl = ({ audioElement }) => {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!audioElement) return;
    setVolume(audioElement.volume);
    const onVolChange = () => setVolume(audioElement.volume);
    audioElement.addEventListener('volumechange', onVolChange);
    return () => audioElement.removeEventListener('volumechange', onVolChange);
  }, [audioElement]);

  const handleChange = e => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioElement) {
      audioElement.volume = newVol;
      audioElement.muted = newVol === 0;
    }
  };

  return (
    <div className="vertical-volume-control">
      <input
        className="vertical-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleChange}
        orient="vertical"
      />
    </div>
  );
};

export default VerticalVolumeControl;
