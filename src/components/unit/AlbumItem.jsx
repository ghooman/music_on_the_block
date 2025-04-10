// components/AlbumItem.jsx
import { Link } from "react-router-dom";
import "./AlbumItem.scss";

import loveIcon from "../../assets/images/album/love-icon.svg";
import halfHeartIcon from "../../assets/images/icon/half-heart.svg";
import playIcon from "../../assets/images/album/play-icon.svg";
import defaultCoverImg from "../../assets/images/header/logo.svg";
import coverImg10 from "../../assets/images/intro/intro-demo-img4.png";

const AlbumItem = ({
  track,
  isActive = false,
  currentTime,
  onClick,
  formatTime = (t) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`,
}) => {
  return (
    <button
      className={`album__content-list__list__item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="album__content-list__list__item__left">
        <p
          className="album__content-list__list__item__left__img"
          style={{
            backgroundImage: `url(${
              track.cover_image === "string" ? coverImg10 : track.cover_image
            })`,
          }}
        ></p>
        <span className="time">
          <strong>{isActive && currentTime !== undefined
            ? formatTime(currentTime)
            : formatTime(track.duration)}</strong>
        </span>
      </div>
      <div className="album__content-list__list__item__right">
        <p className="album__content-list__list__item__right__title">
          {track.title}
        </p>
        <div className="album__content-list__list__item__right__love-play">
          <p className="love">
            <img src={track.is_like ? halfHeartIcon : loveIcon} />
            {track.like || 0}
          </p>
          <p className="play">
            <img src={playIcon} />
            {track.play_cnt || 0}
          </p>
        </div>
        <div className="album__content-list__list__item__right__user">
          <p className="album__content-list__list__item__right__user__info">
            <img src={track.user_profile || defaultCoverImg} />
            {track.name || "unKnown"}
          </p>
          <Link
            className="album__content-list__list__item__right__user__btn"
            to={`/album-detail/${track.id}`}
          >
            Details
          </Link>
        </div>
      </div>
    </button>
  );
};

export default AlbumItem;
