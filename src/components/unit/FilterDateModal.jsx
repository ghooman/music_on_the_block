import { useState } from "react";
import "./FilterDateModal.scss";
import ModalWrap from "../ModalWrap";

const FilterDateModal = ({ setOpenModal }) => {
  const [selectedFilter1, setSelectedFilter1] = useState("Month");
  const [selectedFilter2, setSelectedFilter2] = useState("5");

  const filter1Options = ["Day", "Week", "Month", "Year"];
  const filter2Options = ["5", "10", "15", "20"];

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <ModalWrap title="Filter" onClose={handleClose}>
      <div className="filter-date-modal">
        <div className="filter-date-box">
          <p className="filter-date-box__title">Filter 1</p>
          <div className="filter-date-box__date-list">
            {filter1Options.map((option) => (
              <label
                key={option}
                className={`custom-radio ${
                  selectedFilter1 === option ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="filter1"
                  value={option}
                  checked={selectedFilter1 === option}
                  onChange={() => setSelectedFilter1(option)}
                />
                <span className="radio-checkmark"></span>
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-count-box">
          <p className="filter-count-box__title">Filter 2</p>
          <div className="filter-count-box__count-list">
            {filter2Options.map((option) => (
              <label
                key={option}
                className={`custom-radio ${
                  selectedFilter2 === option ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="filter2"
                  value={option}
                  checked={selectedFilter2 === option}
                  onChange={() => setSelectedFilter2(option)}
                />
                <span className="radio-checkmark"></span>
                {option}
              </label>
            ))}
          </div>
        </div>
        <div className="filter-footer">
          <button className="filter-footer__apply-btn">
            Apply + <span className="filter-footer__apply-btn__count">1</span>
          </button>
          <button className="filter-footer__reset-btn">Reset</button>
        </div>
      </div>
    </ModalWrap>
  );
};

export default FilterDateModal;
