import "./FilterAiServiceModal.scss";
import ModalWrap from "../ModalWrap";

const FilterAiServiceModal = ({ list, onClose }) => {
  return (
    <ModalWrap title="Filter" onClose={onClose}>
      {list?.map((category, index) => (
        <div className="filter-ai-service-modal" key={index}>
          <h3>{category.title}</h3>
          <ul>
            {category.items.map((item, subIndex) => (
              <li key={subIndex}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </ModalWrap>
  );
};

export default FilterAiServiceModal;
