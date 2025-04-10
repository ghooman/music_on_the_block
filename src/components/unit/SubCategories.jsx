import LyricsIcon from '../../assets/images/icon/Lyrics-Icon.svg';
import LyricsAndSongwritingIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import SongwritingIcon from '../../assets/images/icon/Composition-Icon.svg';

import './SubCategories.scss';

const categoryImage = {
    'AI Lyrics & Songwriting': LyricsAndSongwritingIcon,
    'AI Singing Evaluation': LyricsIcon,
    'AI Cover Creation': SongwritingIcon,
    Lyrics: LyricsIcon,
    Songwriting: SongwritingIcon,
    'Lyrics + Songwriting': LyricsAndSongwritingIcon,
};

const SubCategories = ({ categories, handler, value }) => {
    if (!categories || categories?.length === 0) {
        return null;
    }
    return (
        <div className="unit-component-sub-categories">
            {categories?.map((category, index) => (
                <button
                    className={`unit-component-sub-categories__category-item ${value === category ? 'select' : ''}`}
                    key={`category-${index}`}
                    onClick={() => handler(category)}
                >
                    {categoryImage[category] && (
                        <div className="unit-component-sub-categories__category-item--icon">
                            <img src={categoryImage[category]} alt="icon" />
                        </div>
                    )}
                    {category}
                </button>
            ))}
        </div>
    );
};

export default SubCategories;
