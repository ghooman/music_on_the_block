import { useState } from 'react';

import PreparingModal from '../PreparingModal';

import './SubCategories.scss';

const SubCategories = ({ categories, handler, value }) => {
    const [preparingModal, setPreparingModal] = useState(false);

    if (!categories || categories?.length === 0) {
        return null;
    }

    return (
        <>
            <div className="unit-component-sub-categories">
                {categories?.map((category, index) => (
                    <button
                        className={`unit-component-sub-categories__category-item ${
                            value === category.name ? 'select' : ''
                        }`}
                        key={`category-${index}`}
                        onClick={() => {
                            if (category.preparing) {
                                setPreparingModal(true);
                                return;
                            }
                            handler(category.name);
                        }}
                    >
                        {category?.image && (
                            <div className="unit-component-sub-categories__category-item--icon">
                                <img src={category.image} alt="icon" />
                            </div>
                        )}
                        {category.name}
                    </button>
                ))}
            </div>
            {preparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
        </>
    );
};

export default SubCategories;
