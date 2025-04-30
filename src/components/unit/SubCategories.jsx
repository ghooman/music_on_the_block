import { useState } from 'react';

import PreparingModal from '../PreparingModal';

import './SubCategories.scss';

/**
 *
 * @param { { name : string , image : image, preparing : boolean }[] } categories : 카테고리 항목입니다 { name , image, preparing } 로 구성된 오브젝트 배열을 넣어주세요
 * @param { function } handler : 카테고리 클릭 시 호출할 함수
 * @param { any } value : 셀렉트 표시를 위한 값을 넣어주세요
 * @returns { JSX }
 */
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
              if (handler) handler(category.name);
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
