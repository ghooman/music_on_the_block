import React from 'react';
import './CustomTable.scss';
import heartIcon from '../assets/images/like-icon/like-icon.svg';
import heartFilledIcon from '../assets/images/like-icon/like-icon-on.svg';
import lyricIcon from '../assets/images/icon/Lyric-Icon.svg';//작사
import compositionIcon from '../assets/images/icon/Composition-Icon.svg';//작곡
import songIcon from '../assets/images/icon/Songwriting-Icon.svg';//작사+작곡=노래

const DEFAULT_HEADERS = ["#", "Type", "Item", "Username", "Quantity", "Price(MOB)", "Total Volume(MOB)", "Transaction Date", "Details"];

const TYPE_ICONS = {
    'LYRIC': lyricIcon,
    'COMPOSITION': compositionIcon,
    'SONG': songIcon
};

const CustomTable = ({ data, headers = DEFAULT_HEADERS }) => {
    if (!data) return null;

    const renderCell = (item, key) => {
        if (key === 'type') {
            return <img src={TYPE_ICONS[item[key]] || songIcon} alt={item[key]} className="type-icon" />;
        }
        if (key === 'details') {
            return <button className="details-btn">Details</button>;
        }
        return item[key];
    };

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{item.number}</td>
                            <td>{renderCell(item, 'type')}</td>
                            <td>{item.item}</td>
                            <td>{item.username}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                            <td>{item.totalVolume}</td>
                            <td>{item.transactionDate}</td>
                            <td>
                                <button className="details-btn">Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomTable; 