import React, { useState } from "react";
import "../styles/ActionList.scss";
import ActionDetailModal from "../components/ActionDetailModal";
import { PiCaretRightBold } from "react-icons/pi";
import { PiCaretLeftBold } from "react-icons/pi";
const actionDummyData = [
  {
    id: 1,
    detectionDate: "2022-00-00 00:00:00 ~ 2022-0000 00:00:30",
    location: "세븐일레븐 OOO점",
    detectionText: "기물파손",
    actionDate: "2022-00-00 00:00:00",
    checker: "김확인",
    actionPerson: "김조치",
    violator: "김위반",
    resultAction: "기물파손에 대한 확인 및 점포 처리",
    detailView: "상세 데이터",
  },
  {
    id: 2,
    detectionDate: "2022-00-00 00:00:00 ~ 2022-0000 00:00:30",
    location: "세븐일레븐 OOO점",
    detectionText: "기물파손",
    actionDate: "2022-00-00 00:00:00",
    checker: "김확인",
    actionPerson: "김조치",
    violator: "김위반",
    resultAction: "기물파손에 대한 확인 및 점포 처리",
    detailView: "상세 데이터",
  },
  {
    id: 3,
    detectionDate: "2022-00-00 00:00:00 ~ 2022-0000 00:00:30",
    location: "세븐일레븐 OOO점",
    detectionText: "기물파손",
    actionDate: "2022-00-00 00:00:00",
    checker: "김확인",
    actionPerson: "김조치",
    violator: "김위반",
    resultAction: "기물파손에 대한 확인 및 점포 처리",
    detailView: "상세 데이터",
  },
];
const ActionList = () => {
  const [actionListModal, setActionListModal] = useState(false);
  console.log("actionListModal", actionListModal);
  return (
    <div className="action-list__background">
      {actionListModal ? (
        <ActionDetailModal setActionListModal={setActionListModal} />
      ) : (
        <div className="action-list__container">
          <div className="action-list__main">
            <table className="action-list__main-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>감지 일시</th>
                  <th>점포 위치</th>
                  <th>감지 내용</th>
                  <th>조치 일시</th>
                  <th>확인자</th>
                  <th>조치자</th>
                  <th>위반자</th>
                  <th>조치결과</th>
                  <th>상세보기</th>
                </tr>
              </thead>
              <tbody>
                {actionDummyData.map((item) => {
                  return (
                    <>
                      {" "}
                      <tr>
                        <td className="list__text list__number">{item.id}</td>
                        <td className="list__text list__detection-date">
                          {item.detectionDate}
                        </td>
                        <td className="list__text list__location">
                          {item.location}
                        </td>
                        <td className="list__text list__detection-text">
                          {item.detectionText}
                        </td>
                        <td className="list__text list__action-date">
                          {item.actionDate}
                        </td>
                        <td className="list__text list__checker">
                          {item.checker}
                        </td>
                        <td className="list__text list__action-person">
                          {item.actionPerson}
                        </td>
                        <td className="list__text list__violator">
                          {item.violator}
                        </td>
                        <td className="list__text list__result-action">
                          {item.resultAction}
                        </td>
                        <td className="list__button">
                          <button
                            onClick={() => setActionListModal((prev) => !prev)}
                          >
                            상세
                          </button>
                        </td>
                      </tr>
                      {/* <tr className="list__margin"></tr> */}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="action-list__page">
            <button className="page__handler">
              <PiCaretLeftBold className="prev-button__PiCaretLeftBold"/>
              {/* Prev */}
            </button>
            <div className="page__number-box">
              <button className="page__number-btn pagination__button-active">1</button>
              <button className="page__number-btn">2</button>
              <button className="page__number-btn">3</button>
              <button className="page__number-btn">4</button>
              <button className="page__number-btn">5</button>
            </div>
            <button className="page__handler">
              <PiCaretRightBold className="next-button__PiCaretRightBold"/>
              {/* Next */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionList;
