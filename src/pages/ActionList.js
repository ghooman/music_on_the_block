import React, { useState } from "react";
import "../styles/ActionList.scss";
import ActionDetailModal from "../components/ActionDetailModal";
import { PiCaretRightBold } from "react-icons/pi";
import { PiCaretLeftBold } from "react-icons/pi";




function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomTime() {
  const startDate = new Date(2022, 0, 1); // 2022년 1월 1일
  const endDate = new Date(2022, 11, 31); // 2022년 12월 31일
  const randomDateValue = randomDate(startDate, endDate);

  const fixedRandomDate = randomDateValue.toISOString().slice(0, 19).replace("T", " "); // 고정된 무작위 시간값

  return fixedRandomDate; // 고정된 값으로 반환
}


const actionDummyData = [
  {
    id: 1,
    detectionDate: randomTime() + " ~ " + randomTime(),
    location: "세븐일레븐 사당점",
    detectionText: "기물파손",
    actionDate: randomTime(),
    checker: "송영진",
    actionPerson: "김진명",
    violator: "진우만",
    resultAction: "기물파손에 대한 확인 및 점포 처리",
    detailView: "상세 데이터",
  },
  {
    id: 2,
    detectionDate: randomTime() + " ~ " + randomTime(),
    location: "세븐일레븐 남성역점",
    detectionText: "기물파손",
    actionDate: randomTime(),
    checker: "장명래",
    actionPerson: "이태원",
    violator: "함성진",
    resultAction: "기물파손에 대한 확인 및 점포 처리",
    detailView: "상세 데이터",
  },
  {
    id: 3,
    detectionDate: randomTime() + " ~ " + randomTime(),
    location: "세븐일레븐 개봉역점",
    detectionText: "기물파손",
    actionDate: randomTime(),
    checker: "김진원",
    actionPerson: "송현진",
    violator: "조원희",
    resultAction: "기물파손에 대한 확인 및 점포 처리",
    detailView: "상세 데이터",
  },
];
const ActionList = () => {
  const [actionListModal, setActionListModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  console.log("actionListModal", actionListModal);
  return (
    <div className="action-list__background">
      {actionListModal ? (
        <ActionDetailModal 
          setActionListModal={setActionListModal} 
          selectedAction={selectedAction} // 선택한 액션 정보 전달
        />
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
                            onClick={() => {
                              setActionListModal((prev) => !prev);
                              setSelectedAction(item); // 클릭한 정보를 상태에 저장
                            }}
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
