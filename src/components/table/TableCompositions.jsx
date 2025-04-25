import React from 'react';

import profileDefaultImage from '../../assets/images/header/logo-png.png';

import './TableCompositions.scss';

// 테이블 태그
export const TableWrapper = React.memo(({ children }) => {
  return <div className="table-wrapper">{children}</div>;
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

TableHeader.Col = React.memo(({ style, children }) => {
  return (
    <th className="table__thead--item" style={style}>
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

TableItem.Text = React.memo(({ text }) => {
  return (
    <td className="table__body--item">
      <p className="text">{text}</p>
    </td>
  );
});

TableItem.Date = React.memo(({ date }) => {
  return (
    <td className="table__body--item">
      <p className="text">{date ? new Date(date).toLocaleString() : '-'}</p>
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

TableItem.Button = React.memo(({ title, handleClick, type = 'details' }) => {
  return (
    <td className="table__body--item">
      <button className={`button ${type}`} onClick={handleClick}>
        {title}
      </button>
    </td>
  );
});

TableItem.Type = React.memo(({ image }) => {
  return (
    <td className="table__body--item" style={{ width: 26 }}>
      <div className="type">
        <img src={image} alt="icon" />
      </div>
    </td>
  );
});

TableItem.Song = React.memo(({ image, active }) => {
  return (
    // <td className="table__body--item" style={{ width: 26 }}>
      <td className={`table__body--item ${active ? 'active' : ''}`}
          // style={{ width: 26 }
        >
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
