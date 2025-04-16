import MoreHoriz from "../../assets/images/icon/more-horiz.svg";

import "./AlbumsItem.scss";
const AlbumsItem = ({ album }) => {
  return (
    <div className="albums-item">
      <div className="albums-item__info">
        <h1>{album?.title}</h1>
        <p>{album?.artist}</p>
        <span>{album?.song_count} Songs</span>
      </div>
      <div className="albums-item__cover">
        <button className="albums-item__cover-button">
          <img src={MoreHoriz} alt="more_content" />
        </button>
        <img src={album?.cover_image} alt="album_cover" />
      </div>
    </div>
  );
};
export default AlbumsItem;
