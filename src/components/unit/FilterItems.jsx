import './FilterItems.scss';

const FilterItems = ({ style }) => {
  return (
    <div className="unit-component-filteritems">
      <button className="unit-component-filteritems__item">Filter</button>
      <button className="unit-component-filteritems__item">Month</button>
    </div>
  );
};

export default FilterItems;
