import React from 'react';

import { formatUtcTime, formatLocalTime } from '../../utils/getFormattedTime';

import profileDefaultImage from '../../assets/images/header/logo-png.png';
import grade1Icon from '../../assets/images/icon/grade-icon/Grade01-icon.svg';
import grade2Icon from '../../assets/images/icon/grade-icon/Grade2-icon.svg';
import grade3Icon from '../../assets/images/icon/grade-icon/Grade3-icon.svg';
import grade4Icon from '../../assets/images/icon/grade-icon/Grade4-icon.svg';
import grade5Icon from '../../assets/images/icon/grade-icon/Grade5-icon.svg';

import user_grade1Icon from '../../assets/images/icon/grade-icon/user_Grade01-icon.svg';
import user_grade2Icon from '../../assets/images/icon/grade-icon/user_Grade2-icon.svg';
import user_grade3Icon from '../../assets/images/icon/grade-icon/user_Grade3-icon.svg';
import user_grade4Icon from '../../assets/images/icon/grade-icon/user_Grade4-icon.svg';
import user_grade5Icon from '../../assets/images/icon/grade-icon/user_Grade5-icon.svg';

import ai_service_songIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import ai_service_BGMIcon from '../../assets/images/icon/Composition-Icon.svg';

import './TableCompositions.scss';

const gradeIcons = {
  New: grade1Icon,
  Indie: grade2Icon,
  Rising: grade3Icon,
  Top: grade4Icon,
  Legend: grade5Icon,
};

const userGradeIcons = {
  New: user_grade1Icon,
  Indie: user_grade2Icon,
  Rising: user_grade3Icon,
  Top: user_grade4Icon,
  Legend: user_grade5Icon,
};

const aiServiceTypeIcons = {
  0: ai_service_BGMIcon, // BGM
  1: ai_service_songIcon, // Song
};
// 테이블 태그
export const TableWrapper = React.memo(({ children }) => {
  return <div className="table__wrapper">{children}</div>;
});

export const Table = React.memo(({ children, style }) => {
  return (
    <table className="table" style={style}>
      {children}
    </table>
  );
});

// 테이블 헤더
export const TableHeader = React.memo(({ children }) => {
  return (
    <thead className="table__thead">
      <tr>{children}</tr>
    </thead>
  );
});

TableHeader.Col = React.memo(({ style, children, width }) => {
  return (
    <th className="table__thead--item" style={{ ...style, width }}>
      {children}
    </th>
  );
});

TableHeader.Indexs = React.memo(({ style, children }) => {
  return (
    <th className="table__thead--item index" style={style}>
      {children}
    </th>
  );
});

// 테이블 바디
export const TableBody = React.memo(({ children }) => {
  return <tbody>{children}</tbody>;
});

export const TableItem = ({ children, handleClick, isHover }) => {
  return (
    <tr className={`table__body ${isHover ? 'hover' : ''}`} onClick={handleClick}>
      {children}
    </tr>
  );
};

// 테이블 바디 아이템 -------
TableItem.Music = React.memo(() => {
  return <td></td>;
});

TableItem.Indexs = React.memo(({ text }) => {
  return (
    <td className="table__body--item index">
      <p className="text">{text}</p>
    </td>
  );
});

TableItem.Text = React.memo(({ text, color }) => {
  return (
    <td className="table__body--item" style={{ color }}>
      <p className="text">{text}</p>
    </td>
  );
});

TableItem.Date = React.memo(({ date }) => {
  return (
    <td className="table__body--item">
      <p className="text">{date ? formatLocalTime(date) : '-'}</p>
    </td>
  );
});

TableItem.UserInfo = React.memo(({ image, name }) => {
  return (
    <td className="table__body--item artist" style={{ width: 100 }}>
      <div className="userinfo">
        <img src={image || profileDefaultImage} alt="pictures" />
        {name}
      </div>
    </td>
  );
});

TableItem.Button = React.memo(({ title, handleClick, type = 'details', disabled }) => {
  return (
    <td className="table__body--item" style={{ width: 100 }}>
      <button className={`button ${type}`} onClick={handleClick} disabled={disabled}>
        {title}
      </button>
    </td>
  );
});

TableItem.AiServiceType = React.memo(({ service }) => {
  return (
    <td className="table__body--item" style={{ width: 26 }}>
      {aiServiceTypeIcons[service] ? (
        <div className="type">
          <img src={aiServiceTypeIcons[service]} alt="icon" />
        </div>
      ) : (
        '-'
      )}
    </td>
  );
});

TableItem.Grade = React.memo(({ grade }) => {
  return (
    <td className="table__body--item" style={{ width: 26 }}>
      <div className="grade">
        <img src={gradeIcons[grade] || grade1Icon} alt="icon" />
      </div>
    </td>
  );
});

TableItem.UserGrade = React.memo(({ grade }) => {
  return (
    <td className="table__body--item" style={{ width: 26 }}>
      <div className="grade">
        <img src={userGradeIcons[grade] || user_grade1Icon} alt="icon" />
      </div>
    </td>
  );
});

TableItem.Song = React.memo(({ image, active, width }) => {
  return (
    <td className={`table__body--item ${active ? 'active' : ''}`} style={{ width }}>
      <div className={`song ${active ? 'active' : ''}`}>
        <img src={image} alt="images" />
        <div className="loading-wave">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      </div>
    </td>
  );
});
