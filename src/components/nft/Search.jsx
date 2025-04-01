import { useState } from 'react';
import searchIcon from '../../assets/images/icon/search.svg';

import './Search.scss';

const Search = ({ placeholder = 'Search' }) => {
    const [focus, setFocus] = useState(false);

    return (
        <label className={`nft-component-search ${focus ? 'focus' : ''}`}>
            <input
                className="search__input"
                type="text"
                placeholder={placeholder}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            />
            <button className="search__button" type="submit">
                <img src={searchIcon} alt="search" />
            </button>
        </label>
    );
};

export default Search;
