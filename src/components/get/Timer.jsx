import React, { useEffect, useState } from 'react';
import './Timer.scss';
import FlipNumbers from 'react-flip-numbers';

const Timer = ({ time, fontSize, textWidth, color, fontFamily = '' }) => {
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);

  useEffect(() => {
    let interval;

    const defineTime = () => {
      const date = new Date();
      setHours(date.getHours());
      setMinutes(date.getMinutes());
      setSeconds(date.getSeconds());
    };

    defineTime();
    interval = setInterval(() => {
      defineTime();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const width = textWidth;
  const height = fontSize;

  const numberStyle = {
    color,
    fontFamily,
    fontSize,
  };
  const nonNumberStyle = {
    color,
    fontFamily,
    fontSize,
  };

  const timeArr = [
    `4D`,
    `${hours?.toString()?.padStart(2, '0')}H`,
    `${minutes?.toString()?.padStart(2, '0')}M`,
    `${seconds?.toString()?.padStart(2, '0')}S`,
  ];

  return (
    <div className="get-detail-timer">
      {timeArr.map((item, index) => (
        <React.Fragment key={index}>
          <FlipNumbers
            width={width}
            height={height}
            numbers={item}
            play
            numberStyle={numberStyle}
            nonNumberStyle={nonNumberStyle}
            duration={2}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Timer;
