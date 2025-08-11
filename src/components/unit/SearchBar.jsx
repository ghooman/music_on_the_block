import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // 추가
// 스타일
import './SearchBar.scss';
// 이미지
import clearIcon from '../../assets/images/icons/clear-icon.svg';
import searchIcon from '../../assets/images/icons/search-icon.svg';

const SearchBar = ({ keyword, handleChange, handleClear, hideTitle = false }) => {
  const { t } = useTranslation('main');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim() === '') return;
    navigate(`/search-result?keyword=${encodeURIComponent(keyword)}&page=1`);
  };

  return (
    <section className="search-section">
      {!hideTitle && (
        <h2 className="search-section__tit">
          {t('What are you looking for?')}
        </h2>
      )}
      <div className="search-section__search-bar">
        <input
          type="text"
          className="search-bar__input"
          placeholder={t('Search for music and artists')}
          aria-label={t('Search for music and artists')}
          value={keyword}
          onChange={handleChange}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <div className="search-bar__button">
          <button
            className={`search-bar__btn-reset${
              keyword.length > 0 ? ' search-bar__btn-reset--typing' : ''
            }`}
            onClick={handleClear}
            aria-label={t('Clear Search Form')}
          >
            <img src={clearIcon} alt="" />
          </button>
          <button
            className="search-bar__btn-search"
            aria-label={t('Search')}
            onClick={handleSearch}
          >
            <img src={searchIcon} alt="" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
