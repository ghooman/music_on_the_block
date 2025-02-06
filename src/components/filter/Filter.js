import filterIcon from "../../assets/images/icon/filter.svg";
import "./Filter.scss";
const Filter = () => {
  return (
    <div className="albums__filter">
      <button className="albums__filter__btn">
        <img src={filterIcon} alt="filter" />
        <span>Filter</span>
      </button>
      <button className="albums__filter__btn active">
        <span>AI Lyric & Songwriting</span>
      </button>
      <button className="albums__filter__btn active">
        <span>Lyric</span>
      </button>
    </div>
  );
};

export default Filter;
