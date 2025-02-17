import "./FilterAiServiceModal.scss";
import ModalWrap from "../ModalWrap";

import ResetIcon from "../../assets/images/icon/reset.svg";
import PencelIcon from "../../assets/images/icon/pencel.svg";

const FilterAiServiceModal = ({ list, onClose }) => {
  return (
    <ModalWrap title="Filter" onClose={onClose}>
      {list?.map((category, index) => (
        <div className="filter-ai-service-modal__content" key={index}>
          <h3>{category.title}</h3>
          <div className="filter-ai-service-modal__list">
            {category.items.map((item, subIndex) => (
              <button key={subIndex}>{item}</button>
            ))}
          </div>
        </div>
      ))}

      <div className="filter-ai-service-modal__footer">
        <button className="btn-reset">
          <img src={ResetIcon} alt="reset" />
          Reset
        </button>
        <button className="btn-view">
          View 1 results
          <img src={PencelIcon} alt="pencel" />
        </button>
      </div>
    </ModalWrap>
  );
};

export default FilterAiServiceModal;
