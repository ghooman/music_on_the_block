import './FilterItems.scss';

const FilterItems = ({ style }) => {
    return (
        <div className="nft-component-filteritems">
            <button className="nft-component-filteritems__item">Filter</button>
            <button className="nft-component-filteritems__item">Month</button>
        </div>
    );
};

export default FilterItems;
