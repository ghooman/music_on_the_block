import React from "react";
import "./CustomTable.scss";
import heartIcon from "../assets/images/like-icon/like-icon.svg";
import heartFilledIcon from "../assets/images/like-icon/like-icon-on.svg";
import lyricIcon from "../assets/images/icon/Lyrics-Icon.svg"; //작사
import compositionIcon from "../assets/images/icon/Composition-Icon.svg"; //작곡
import songIcon from "../assets/images/icon/Songwriting-Icon.svg"; //작사+작곡=노래

const DEFAULT_HEADERS = [
  "#",
  "Type",
  "Item",
  "Username",
  "Quantity",
  "Price(MOB)",
  "Total Volume(MOB)",
  "Transaction Date",
  "Details",
];

const TYPE_ICONS = {
  LYRIC: lyricIcon,
  COMPOSITION: compositionIcon,
  SONG: songIcon,
};

const CustomTable = ({ data, headers = DEFAULT_HEADERS }) => {
  if (!data) return null;

  const renderCell = (item, key) => {
    if (key === "type") {
      return (
        <img
          src={TYPE_ICONS[item[key]] || songIcon}
          alt={item[key]}
          className="type-icon"
        />
      );
    }
    if (key === "details") {
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
              {item.number && <td>{item.number}</td>}
              {item.type && <td>{renderCell(item, "type")}</td>}
              {item.item && <td>{item.item}</td>}
              {item.username && (
                <td>
                  {typeof item.username === "object" ? (
                    <div className="user-cell">
                      <img
                        src={item.username.picture}
                        alt={item.username.name}
                      />
                      <span>{item.username.name}</span>
                    </div>
                  ) : (
                    item.username
                  )}
                </td>
              )}
              {item.quantity && <td>{item.quantity}</td>}
              {item.price && <td>{item.price}</td>}
              {item.totalVolume && <td>{item.totalVolume}</td>}
              {item.transactionDate && <td>{item.transactionDate}</td>}
              {item.details && (
                <td>
                  <button className="details-btn">Details</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
