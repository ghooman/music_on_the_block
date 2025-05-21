import { useState } from 'react';
import searchIcon from '../../assets/images/icon/search.svg';

import './Search.scss';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 *
 * @param {string} placeholder : 플레이스 홀더
 * @param {function} hanlder : 검색 시 함수 (쿼리 파라미터 방식 사용하지 않을 시)
 * @param {string} queryParameterName : 쿼리파라미터의 이름 지정 (한 페이지에서 여러 개의 검색이 필요한 경우 즉, 쿼리 파라미터를 구분해야 하)
 * @param {object} reset : 검색어 입력 시 초기화할 쿼리 파라미터
 * @returns
 */
const Search = ({ placeholder, handler, queryParameterName = 'search', reset }) => {
  const { t } = useTranslation('module');

  const [focus, setFocus] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search');

  const handleSearch = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData?.get('search').trim();

    if (handler) {
      // 전달되는 함수 사용 방식 예) State로 검색 기능 제어 시
      handler(search);
    } else {
      // 쿼리 파라미터 변경 방식
      setSearchParams(prev => {
        if (!search) {
          const { [queryParameterName]: extracted, ...rest } = Object.fromEntries(prev);
          return { ...rest };
        }
        return {
          ...Object.fromEntries(prev),
          [queryParameterName]: search,
          ...reset,
        };
      });
    }
  };

  return (
    <form onSubmit={e => handleSearch(e)}>
      <label className={`unit-component-search ${focus ? 'focus' : ''}`}>
        <input
          className="search__input"
          type="text"
          name="search"
          placeholder={t(placeholder) + '...'}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          defaultValue={search}
        />
        <button className="search__button" type="submit">
          <img src={searchIcon} alt="search" />
        </button>
      </label>
    </form>
  );
};

export default Search;
