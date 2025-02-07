import "./FilterDateModal.scss";
import ModalWrap from "../ModalWrap";
const FilterDateModal = ({ setOpenModal, handleModalClaim }) => {
  return (
    <ModalWrap title="Filter">
      <div className="filter-date-modal">
        <div className="filter-date-box">
          <p className="filter-date-box__title">Filter 1</p>
          <div className="filter-date-box__date-list">
            <button className="filter-date-box__date-item">
              <input type="checkbox" id="Day" name="Day" value="Day" />
              <label for="Day">Day</label>
            </button>
            <button className="filter-date-box__date-item">
              <input type="checkbox" id="Day" name="Day" value="Day" />
              <label for="Day">Day</label>
            </button>
            <button className="filter-date-box__date-item">
              <input type="checkbox" id="Day" name="Day" value="Day" />
              <label for="Day">Day</label>
            </button>
            <button className="filter-date-box__date-item">
              <input type="checkbox" id="Day" name="Day" value="Day" />
              <label for="Day">Day</label>
            </button>
          </div>
          <div className="filter-count-box">
            <p className="filter-count-box__title">Filter 2</p>
            <div className="filter-count-box__count-list">
              <button className="filter-count-box__count-item">
                <input type="checkbox" id="Day" name="Day" value="Day" />
                <label for="Day">Day</label>
              </button>
              <button className="filter-count-box__count-item">
                <input type="checkbox" id="Day" name="Day" value="Day" />
                <label for="Day">Day</label>
              </button>
              <button className="filter-count-box__count-item">
                <input type="checkbox" id="Day" name="Day" value="Day" />
                <label for="Day">Day</label>
              </button>
              <button className="filter-count-box__count-item">
                <input type="checkbox" id="Day" name="Day" value="Day" />
                <label for="Day">Day</label>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrap>
  );
};

export default FilterDateModal;
