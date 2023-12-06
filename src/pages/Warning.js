import React, { useState , useEffect} from "react";
import "../styles/Warning.scss";
import dummyImg2 from "../assets/images/dummy2.png";
import videoTest from "../assets/video/videoTest4s.mp4";
import StorageModal from "../components/StorageModal";

const dummyData = [
  {
    name: "세븐 일레븐 사당점",
  },
  {
    name: "세븐 일레븐 강남점",
  },
  {
    name: "세븐 일레븐 종로점",
  },
  {
    name: "세븐 일레븐 중랑점",
  },
  {
    name: "세븐 일레븐 송파점",
  },
  {
    name: "세븐 일레븐 고려대점",
  },
  {
    name: "세븐 일레븐 관악점",
  },
  {
    name: "세븐 일레븐 홍익대점",
  },
  {
    name: "세븐 일레븐 강북점",
  },
  {
    name: "세븐 일레븐 서초점",
  },
  {
    name: "세븐 일레븐 신촌점",
  },
  {
    name: "세븐 일레븐 구로점",
  },
  {
    name: "세븐 일레븐 잠실점",
  },
  {
    name: "세븐 일레븐 노원점",
  },
  {
    name: "세븐 일레븐 명동점",
  },

];
const Warning = () => {
  const [storageModal, setStorageModal] = useState(false);
  const handleEnterActionSubmit = (e) => {
    e.preventDefault();
    setStorageModal((prev) => !prev);
    document.body.overflow = "hidden";
  };
  const [selectedIndex, setSelectedIndex] = useState(null);//경고알림현황 더미 클릭
  const [isClicked, setIsClicked] = useState(false);//cctv영상active제어
  const [showCCTV, setShowCCTV] = useState(false);//cctv영상0.2초뒤에 나와라
  const [showSensingItem, setShowSensingItem] = useState(false);
  const [isClickActive, setisClickActive] = useState(false);//조치하기버튼토글
  const [isClickvideo, setisClickvideo] = useState(false);//영상확인토글

  const [selectedName, setSelectedName] = useState(null);


  const handleItemClick = (index) => {
    setSelectedIndex(index);
    handleClick();
    handleCCTVClick();
    const clickedItem = dummyData[index];
    setSelectedName(clickedItem.name);
  };

  const handleClick = () => {
    setIsClicked(true);
  };
  const handleClickActive = () => {
    setisClickActive(!isClickActive);
  };
  const handleClickvideo = () => {
    setisClickvideo(!isClickvideo);
  };

  useEffect(() => {
    if (isClicked) {
      setTimeout(() => {
        setShowCCTV(true);
      }, 200);
    }
  }, [isClicked]);
  
  useEffect(() => {
    if (isClicked) {
      setTimeout(() => {
        setShowSensingItem(true);
        // setShowCCTV(true);

      }, 7000);
    }
  }, [isClicked]);
  

  const [isVideoActive, setIsVideoActive] = useState(false);//에러 빨간색 효과
  const [isContainerActive, setIsContainerActive] = useState(false);//컨테이너가 흔들리는 효과

  //동영상이 시작하고나서6초뒤에 효과 나타나라 에러효과
  const handleCCTVClick = () => {
    setShowCCTV(true);
    setTimeout(() => {
      setIsVideoActive(true);
    }, 6000);

    setTimeout(() => {
      setIsContainerActive(true);
    }, 6000);

  };

  //저장버튼눌렀을때 실행
  const handleConfirm = () => {
    setIsClicked(false);
    setisClickActive(false);
    setisClickvideo(false);
    setShowCCTV(false);
    setShowSensingItem(false);
    setSelectedIndex(false);

    setSelectedIndex(null); // null로 리셋시키고
    setIsContainerActive(false); // 컨테이너의 active 클래스 제거
    setIsVideoActive(false); // 비디오의 active 클래스 제거
  };

  return (
    <div className="warning-background">
      {/* <div className={`warning__container ${isClicked ? "active" : ""}`}> */}
      <div className={`warning__container ${isContainerActive ? "active" : ""}`}>
        
        <div className="container__left-box">
          <div className="left-box__title">경고알림 현황</div>
          <div className="left-box__main">
            <div className="main__list">
            {dummyData.map((item, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={index}
                  // className="main__item"
                  // onClick={handleClick}
                  className={`main__item ${isActive ? "active" : ""}`}
                  onClick={() => handleItemClick(index)}
                >
                  {item.name}
                </div>
              );
            })}
              {/* {dummyData.map((item) => {
                return <div className="main__item">{item.name}</div>;
              })} */}
            </div>
            {showCCTV && (
              <div className={`main__video ${isVideoActive ? "active" : ""}`}>
                {/* <img src={cctv} alt="cctv_img" /> */}
                <div className="vide__demoVideo">
                {/* {isVideoActive && ( */}
                  <video autoPlay>
                    <source src={videoTest} type="video/mp4" />
                  </video>
                {/* )} */}
                </div>
                <span className="video__errorEffect"></span>
              </div>
            )}

              {/* <img src={cctv} alt="cctv_img"></img> */}
          </div>
        </div>
        <div className="container__right-box">
          <div className="right-box__sensing-list">
            <div className="sensing-list__title">감지목록</div>
            
              <ul className="sensing-list__main">
                <li className={`sensing__item ${showSensingItem ? "active" : ""}`}>
                  <span className="sensing-item__time">
                    2022-01-22 05:14:51 ~ 2022-01-23 05:40:10
                  </span>
                  <span className="sensing-item__text">기물파손</span>
                  {/* <button className="sensing-item__btn">조치하기</button> */}
                  <button className={`sensing-item__btn ${isClickActive ? "active" : ""}`}
                  onClick={handleClickActive}
                  >조치하기</button>
                </li>
              </ul>
              {!showSensingItem && (
                <div className="sensing-list__empty">감지목록이 없습니다.</div>
              )}
            {/* <ul className="sensing-list__main"> */}
              {/* <li className="sensing__item">
                <span className="sensing-item__time">
                  2022-00-00 00:00:00 ~ 2022-0000 00:00:30
                </span>
                <span className="sensing-item__text">기물파손</span>
                <button className="sensing-item__btn">조치하기</button>
              </li> */}
              {/* <div className="sensing-list__empty">감지목록이 없습니다.</div> */}
            {/* </ul> */}
          </div>
          <div className="right-box__enter-action">
            <div className="enter-action__title">조치 사항 입력</div>
            <div className="enter-action__main">
              <div className={`enter-action__main__hidden ${isClickActive ? "active" : ""}`}>
                <div className="enter-action__info">
                  <div className="info__left">
                    <span className="info-left__title">
                      {selectedName}
                      <span className="safety-belt__text">기물파손</span>
                    </span>
                    <span className="info-left__time">
                      2022-01-22 05:14:51 ~ 2022-01-23 05:40:10
                    </span>
                  </div>
                  <button className={`check-video__btn ${isClickvideo ? "active" : ""}`}
                    onClick={handleClickvideo}
                  >영상확인
                  </button>
                </div>
                <form
                  className="enter-action__form"
                  onSubmit={handleEnterActionSubmit}
                >
                  <label>
                    <span>확인자</span>
                    <input type="text" />
                  </label>
                  <label>
                    <span>조치자</span>
                    <input type="text" />
                  </label>
                  <label>
                    <span>위반자</span>

                    <input type="text" />
                  </label>
                  <label>
                    <span>조치결과</span>

                    <input type="text" />
                  </label>
                  <button className="enter-action__storage-btn">
                    <span>저장</span>
                  </button>
                </form>
                {/* 조치 항목이 없을때 */}
              </div>
              {!isClickActive && (
                  <div className="enter-action__empty">조치 항목이 없습니다.</div>
                )}
            </div>
          </div>
        </div>
      </div>
      {storageModal && <StorageModal setStorageModal={setStorageModal} onConfirm={handleConfirm} />}
    </div>
  );
};

export default Warning;
