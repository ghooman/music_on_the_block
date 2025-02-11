import "./Albums.scss";
import { useState } from "react";
import heartIcon from "../../assets/images/icon/heart.svg";
import moreIcon from "../../assets/images/icon/more.svg";
import playIcon from "../../assets/images/icon/play.svg";
import commentIcon from "../../assets/images/icon/comment.svg";
import demoAlbum from "../../assets/images/mypage/demo-album.png";
import demoUser from "../../assets/images/mypage/demo-user.png";

import Filter from "../unit/Filter";
import AlbumsTable from "../unit/AlbumsTable";
import FilterAiServiceModal from "../unit/FilterAiServiceModal";
const Albums = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalList, setModalList] = useState([]);

  const AiServiceList = [
    "All",
    "AI Singing Evaluation",
    "AI Lyric & Songwriting",
    "AI Cover Creation",
  ];

  const AiServiceTypeList = ["Lyric", "Songwriting", "Sing", "Link"];

  const SortByList = [
    "Latest",
    "Oldest",
    "Most Liked",
    "Most Commented",
    "Low Likes",
    "Most Comments",
  ];
  // 첫 번째 필터 클릭 이벤트 (AI 서비스 리스트 + 타입 리스트만 전달)
  const handleFilterClick = () => {
    setModalList([
      { title: "AI Service List", items: AiServiceList },
      { title: "AI Service Type List", items: AiServiceTypeList },
    ]);
    setOpenModal(true);
  };

  // 두 번째 필터 클릭 이벤트 (AI 서비스 리스트 + 타입 리스트 + 정렬 리스트 전달)
  const handleAlbumsFilterClick = () => {
    setModalList([
      { title: "AI Service List", items: AiServiceList },
      { title: "AI Service Type List", items: AiServiceTypeList },
      { title: "Sort By List", items: SortByList },
    ]);
    setOpenModal(true);
  };

  return (
    <div className="albums">
      <section className="albums__list">
        <div className="albums__header">
          <h1 className="albums__title">Top Albums</h1>
          <Filter
            list={["AI Lyric + Songwriting"]}
            clickEvent={handleFilterClick}
          />
        </div>
        <div className="albums__body">
          <div className="albums__item">
            <p className="albums__item-title">Top Likes</p>
            <div className="albums__item-intro">
              <div className="albums__item__img-box">
                <img
                  className="albums__item__img"
                  src={demoAlbum}
                  alt="album"
                />
              </div>
              <div className="albums__item-desc">
                <p className="albums__item-desc-text">
                  he dances through his masks like breathing - Yolkhead
                </p>
                <div className="albums__item__icon-box">
                  <div className="albums__item__play-count">
                    <img src={heartIcon} alt="play" />
                    <span>145</span>
                  </div>
                  <div className="albums__item__play-count">
                    <img src={commentIcon} alt="play" />
                    <span>326</span>
                  </div>
                </div>

                <div className="albums__item__user-info">
                  <img
                    className="albums__item__user-img"
                    src={demoUser}
                    alt="user"
                  />
                  <span>Yolkhead</span>
                  <button className="albums__item__more-btn">
                    <img src={moreIcon} alt="more" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="albums__item">
            <p className="albums__item-title">Top Comments</p>
            <div className="albums__item-intro">
              <div className="albums__item__img-box">
                <img
                  className="albums__item__img"
                  src={demoAlbum}
                  alt="album"
                />
              </div>
              <div className="albums__item-desc">
                <p className="albums__item-desc-text">
                  he dances through his masks like breathing - Yolkhead
                </p>
                <div className="albums__item__icon-box">
                  <div className="albums__item__play-count">
                    <img src={heartIcon} alt="play" />
                    <span>145</span>
                  </div>
                  <div className="albums__item__play-count">
                    <img src={commentIcon} alt="play" />
                    <span>326</span>
                  </div>
                </div>
                <div className="albums__item__user-info">
                  <img
                    className="albums__item__user-img"
                    src={demoUser}
                    alt="user"
                  />
                  <span>Yolkhead</span>
                  <button className="albums__item__more-btn">
                    <img src={moreIcon} alt="more" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="albums__item">
            <p className="albums__item-title">Top Plays</p>
            <div className="albums__item-intro">
              <div className="albums__item__img-box">
                <img
                  className="albums__item__img"
                  src={demoAlbum}
                  alt="album"
                />
              </div>
              <div className="albums__item-desc">
                <p className="albums__item-desc-text">
                  he dances through his masks like breathing - Yolkhead
                </p>
                <div className="albums__item__icon-box">
                  <div className="albums__item__play-count">
                    <img src={heartIcon} alt="play" />
                    <span>145</span>
                  </div>
                  <div className="albums__item__play-count">
                    <img src={commentIcon} alt="play" />
                    <span>326</span>
                  </div>
                </div>
                <div className="albums__item__user-info">
                  <img
                    className="albums__item__user-img"
                    src={demoUser}
                    alt="user"
                  />
                  <span>Yolkhead</span>
                  <button className="albums__item__more-btn">
                    <img src={moreIcon} alt="more" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="albums__my-albums">
        <div className="my-albums__header">
          <p className="my-albums__title">My Albums</p>
          <button className="my-albums__more-btn"> View All </button>
        </div>
        <div className="my-albums__input">
          <input
            type="text"
            className="my-albums__search"
            placeholder="Search by song title..."
          />
        </div>
        <div className="my-albums__filter">
          <Filter clickEvent={handleAlbumsFilterClick} />
          <AlbumsTable />
        </div>
      </section>
      {openModal && (
        <FilterAiServiceModal
          list={modalList}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default Albums;
