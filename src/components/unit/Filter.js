import "./Filter.scss";
const Filter = ({ list }) => {
  return (
    <div className="albums__filter">
      <button className="albums__filter__btn">
        <span>Filter</span>
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
