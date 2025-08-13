import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './SearchBar.scss';
import clearIcon from '../../assets/images/icons/clear-icon.svg';
import searchIcon from '../../assets/images/icons/search-icon.svg';

const SearchBar = ({
  keyword,
  handleChange,
  handleClear,
  hideTitle = false,
  onSearch, // callback 모드에서 사용
  navigateTo = '/search-result', // navigate 모드에서 기본 목적지
  buildUrl, // (옵션) URL 커스터마이즈: (kw) => string
  mode = 'auto', // 'auto' | 'callback' | 'navigate'
}) => {
  const { t } = useTranslation('main');
  const navigate = useNavigate();

  const doSearch = () => {
    const keyWord = keyword?.trim();
    if (!keyWord) return;

    const resolvedMode =
      mode === 'auto' ? (typeof onSearch === 'function' ? 'callback' : 'navigate') : mode;

    if (resolvedMode === 'callback') {
      if (typeof onSearch !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[SearchBar] mode=callback 인데 onSearch가 없습니다.');
        }
        return;
      }
      onSearch(keyWord);
      return;
    }

    // resolvedMode === 'navigate'
    const url =
      typeof buildUrl === 'function'
        ? buildUrl(keyWord)
        : `${navigateTo}?keyword=${encodeURIComponent(keyWord)}&page=1`;
    navigate(url);
  };

  return (
    <section className="search-section">
      {!hideTitle && <h2 className="search-section__tit">{t('What are you looking for?')}</h2>}
      <div className="search-section__search-bar">
        <input
          type="text"
          className="search-bar__input"
          placeholder={t('Search for music and artists')}
          aria-label={t('Search for music and artists')}
          value={keyword}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
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
          <button className="search-bar__btn-search" aria-label={t('Search')} onClick={doSearch}>
            <img src={searchIcon} alt="" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
