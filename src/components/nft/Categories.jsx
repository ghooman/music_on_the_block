import './Categories.scss';

const Categories = ({ categories, value, onClick }) => {
    return (
        <div className="nft-component-categories">
            {categories.map((item, index) => (
                <button
                    className={`nft-component-categories__item ${value === item ? 'selected' : ''}`}
                    onClick={() => {
                        if (onClick) onClick(item);
                    }}
                    key={index}
                >
                    {item}
                </button>
            ))}
        </div>
    );
};

export default Categories;
