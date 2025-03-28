import searchIcon from '../../assets/images/icon/search.svg';

import './Search.scss';

const Search = ({ placeholder }) => {
    return (
        <div className="nft-component-search">
            <input className="search__input" type="text" placeholder={placeholder} />
            <button className="search__button" type="submit">
                <img src={searchIcon} alt="search" />
            </button>
        </div>
    );
};

export default Search;
