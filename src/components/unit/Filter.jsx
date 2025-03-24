import "./Filter.scss";
const Filter = ({ list, clickEvent }) => {
  return (
    <div className="albums__filter">
      <button className="albums__filter__btn">
        <span onClick={clickEvent}>Filter</span>
      </button>
      {list?.map((item, index) => (
        <button className="albums__filter__btn" key={index}>
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
};

export default Filter;
