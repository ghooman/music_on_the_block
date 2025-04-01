import catgImageOn from '../../assets/images/album/album-tab_icon01-on.svg';
import catgImage2On from '../../assets/images/album/album-tab_icon02-on.svg';

import catgImageOff from '../../assets/images/album/album-tab_icon01.svg';
import catgImage2Off from '../../assets/images/album/album-tab_icon02.svg';

import './Categories.scss';

const Categories = ({ categories, value, onClick }) => {
    return (
        <div className="nft-component-categories">
            {categories &&
                categories.map((item, index) => (
                    <button
                        className={`nft-component-categories__item ${value === item ? 'selected' : ''}`}
                        onClick={() => {
                            if (onClick) onClick(item);
                        }}
                        key={index}
                    >
                        <img src={value === item ? catgImage2On : catgImage2Off} alt="icon" />
                        {item}
                    </button>
                ))}
        </div>
    );
};

export default Categories;
