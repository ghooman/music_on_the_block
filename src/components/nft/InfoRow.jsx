import './InfoRow.scss';

// 사용 예시
// <InfoRowWrap>
//<InfoRowWrap.ValueItem title="Total Volume" value="하하하3하" />
//<InfoRowWrap.ValueItem title="Total Volume" value="히히히히" />
//<InfoRowWrap.ValueItem title="Total Volume" value="히하ㅓ히ㅏ허" />
//<InfoRowWrap.ValueItem title="Total Volume" value="히하ㅓ히ㅏ허" />
//</InfoRowWrap>;

export const InfoRowWrap = ({ row = 4, children }) => {
    return <div className={`nft-component-inforow row${row}`}>{children}</div>;
};

InfoRowWrap.ValueItem = ({ title, value }) => {
    return (
        <ItemWrap title={title}>
            <p className="item-value">{value}</p>
        </ItemWrap>
    );
};

InfoRowWrap.UserItem = ({ title, value }) => {
    return (
        <ItemWrap title={title}>
            <div className="item-user">
                {value?.picture && <img src={value.picture} alt="pictures" />}
                {value?.username}
            </div>
        </ItemWrap>
    );
};

const ItemWrap = ({ title, children }) => {
    return (
        <div className="nft-component-inforow-item">
            <div className="nft-component-inforow-item__title">{title}</div>
            <div className="nft-component-inforow-item__value">{children}</div>
        </div>
    );
};
