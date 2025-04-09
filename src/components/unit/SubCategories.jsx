import './SubCategories.scss';

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
                    {category}
                </button>
            ))}
        </div>
    );
};

export default SubCategories;
