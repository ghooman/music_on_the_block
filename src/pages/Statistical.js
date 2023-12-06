import "../styles/Statistical.scss";
import Header from "../components/Header";
import arrow_down_red from "../assets/images/red-down-arrow.svg";
import check_img from "../assets/images/check.png";
import not_check_img from "../assets/images/not_check.png";
import reset_img from "../assets/images/autorenew.svg";
import React, { useEffect, useRef, useState } from "react";

const dummy = [
  {
    name: "세븐일레븐 사당점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-01",
  },
  {
    name: "세븐일레븐 강남점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-02",
  },
  {
    name: "세븐일레븐 종로점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-03",
  },
  {
    name: "세븐일레븐 중랑점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-04",
  },
  {
    name: "세븐일레븐 송파점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-05",
  },
  {
    name: "세븐일레븐 고려대점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-06",
  },
  {
    name: "세븐일레븐 관악점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-06",
  },
  {
    name: "세븐일레븐 홍익대점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-06",
  },
  {
    name: "세븐일레븐 강북점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-06",
  },
  {
    name: "세븐일레븐 서초점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-06",
  },
  {
    name: "세븐일레븐 신촌점",
    danger: { 기물파손: 3, "장시간 체류": 3, 쓰러짐: 1 },
    date: "2023-07-06",
  },
];

const Statistical = () => {
  // dropdown UI
  const [showMenu, setShowMenu] = useState("");
  const menuRef = useRef(null);
  const toggleMenu = (e, menuType) => {
    e.stopPropagation();
    if (showMenu === menuType) {
      setShowMenu(null);
      console.log("ref없음1");
    } else {
      setShowMenu(menuType);
      console.log("ref없음2");
    }
  };

  useEffect(() => {
    const handleBackgroundClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };
    document.addEventListener("click", handleBackgroundClick);
    return () => {
      document.removeEventListener("click", handleBackgroundClick);
    };
  }, []);

  // 체크박스
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  // 체크한 점포을 state에 저장합니다.
  const handleCheckboxSiteChange = (e, siteName) => {
    if (e.target.checked) {
      setSelectedSites([...selectedSites, siteName]);
    } else {
      setSelectedSites(selectedSites.filter((site) => site !== siteName));
    }
  };
  // 체크한 유형을 state에 저장합니다.
  const handleCheckboxTypeChange = (e, typeName) => {
    if (e.target.checked) {
      setSelectedTypes([...selectedTypes, typeName]);
    } else {
      setSelectedTypes(selectedTypes.filter((type) => type !== typeName));
    }
  };

  // 점포 모두선택
  const handleSelectAllSites = () => {
    const checkboxes = document.querySelectorAll(
      '.site__list-item input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    setSelectedSites(dummy.map((item) => item.name));
    console.log(selectedSites);
  };
  // 점포 선택 초기화
  const handleResetAllSites = () => {
    const checkboxes = document.querySelectorAll(
      '.site__list-item input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setSelectedSites([]);
    console.log(selectedSites);
  };
  const handleSelectAllTypes = () => {
    const checkboxes = document.querySelectorAll(
      '.type__list-item input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    setSelectedTypes(Object.keys(dummy[0]?.danger || {}));
    console.log(selectedTypes);
  };
  const handleResetAllTypes = () => {
    const checkboxes = document.querySelectorAll(
      '.type__list-item input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setSelectedTypes([]);
    console.log(selectedTypes);
  };
  // ====== 조회 =====
  const [serachData, setSearchData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  return (
    <div className="statistical">
      <div className="statistical__filter">
        <div className="filter-wrapper">
          <div className="filter__selected-menu">
            <div className="filter-wrapper__site-dropdown">
              <div className="filter__site-name">점포명</div>
              <div
                className="filter__site-name--cliked"
                onClick={(e) => toggleMenu(e, "site")}
              >
                <p>
                  {selectedSites.length === 0
                    ? "점포선택"
                    : selectedSites.length === 1
                    ? selectedSites[0]
                    : `${selectedSites[0]} 외 ${selectedSites.length - 1}곳`}
                </p>
                <img src={arrow_down_red} alt="arrow-down" />
              </div>
            </div>
            <div className="filter-wrapper__type-dropdown">
              <div className="filter__type-name">유형 </div>
              <div
                className="filter__type-name--cliked"
                onClick={(e) => toggleMenu(e, "type")}
              >
                <p>
                  {selectedTypes.length === 0
                    ? "유형선택"
                    : selectedTypes.length === 1
                    ? selectedTypes[0]
                    : `${selectedTypes[0]} 외 ${selectedTypes.length - 1}곳`}
                </p>
                <img src={arrow_down_red} alt="arrow-down" />
              </div>
            </div>
          </div>

          {showMenu === "site" && (
            <ul className="site__list" ref={menuRef}>
              {dummy.map((item, index) => (
                <li className="site__list-item" key={index}>
                  <input
                    type="checkbox"
                    value="check"
                    id={`site-checkbox-${index}`}
                    onClick={(e) => handleCheckboxSiteChange(e, item.name)}
                  />
                  <label htmlFor={`site-checkbox-${index}`}>{item.name}</label>
                </li>
              ))}
              <div className="site__all-check" onClick={handleSelectAllSites}>
                모두선택
              </div>
              <div className="site__check-reset" onClick={handleResetAllSites}>
                <img src={reset_img} alt="reset_button" />
                선택초기화
              </div>
            </ul>
          )}
          {showMenu === "type" && (
            <ul className="type__list" useRef={menuRef}>
              {Object.keys(dummy[0]?.danger || {}).map((item, index) => (
                <li className="type__list-item" key={index}>
                  <input
                    type="checkbox"
                    value="check"
                    id={`type-checkbox-${index}`}
                    onClick={(e) => handleCheckboxTypeChange(e, item)}
                  />
                  <label htmlFor={`type-checkbox-${index}`}>{item}</label>
                </li>
              ))}
              <div className="type__all-check" onClick={handleSelectAllTypes}>
                모두선택
              </div>
              <div className="type__check-reset" onClick={handleResetAllTypes}>
                <img src={reset_img} alt="reset_button" />
                선택초기화
              </div>
            </ul>
          )}

          <div className="filter__setting">
            <div className="filter-wrapper__date-range">
              <input type="date" className="date-range__start-date" />
            </div>
            <span className="filter-wrapper__tilde">~</span>
            <div className="filter-wrapper__date-range">
              <input type="date" className="date-range__end-date" />
            </div>
            <button className="filter-wrapper__search-button">
              <span>조회</span>
            </button>
          </div>
        </div>
      </div>
      <div className="statistical__container">
        {dummy ? (
          <table className="statistical__selection-list">
            <thead>
              <tr>
                <th className="selection-list__type-black">{""}</th>
                <th className="selection-list__type">기물파손</th>
                <th className="selection-list__type">장시간 체류</th>
                <th className="selection-list__type">쓰러짐</th>
              </tr>
            </thead>
            <tbody>
              {dummy.map((site) => (
                <tr key={site.name}>
                  <th className="selection-list__type-black">{site.name}</th>
                  <th className="selection-list__type">
                    {site.danger["기물파손"]}
                  </th>
                  <th className="selection-list__type">
                    {site.danger["장시간 체류"]}
                  </th>
                  <th className="selection-list__type">
                    {site.danger["쓰러짐"]}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="container__empty">조회 내용이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Statistical;
