import "./Albums.scss";

import heartIcon from "../../assets/images/icon/heart.svg";
import moreIcon from "../../assets/images/icon/more.svg";
import playIcon from "../../assets/images/icon/play.svg";
import commentIcon from "../../assets/images/icon/comment.svg";
import demoAlbum from "../../assets/images/mypage/demo-album.png";
import demoUser from "../../assets/images/mypage/demo-user.png";

import Filter from "../unit/Filter";
import AlbumsTable from "../unit/AlbumsTable";
const Albums = () => {
  return (
    <div className="albums">
      <section className="albums__list">
        <div className="albums__header">
          <h1 className="albums__title">Top Albums</h1>
          <Filter list={["AI Lyric + Songwriting"]} />
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
          <Filter />
          <AlbumsTable />
        </div>
      </section>
    </div>
  );
};

export default Albums;
