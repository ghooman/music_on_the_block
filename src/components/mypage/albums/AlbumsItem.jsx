import MoreHoriz from "../../../assets/images/icon/more-horiz.svg";
import defaultAlbumImage from "../../../assets/images/mypage/albums-upload-logo.png";
import "./AlbumsItem.scss";
const AlbumsItem = ({ album, handleAlbumClick }) => {
  return (
    <div className="albums-item">
      <div className="albums-item__info">
        <h1>{album?.album_name}</h1>
        <p>{album?.name}</p>
        <span>{album?.song_cnt} Songs</span>
      </div>
      <div className="albums-item__cover">
        <button
          className="albums-item__cover-button"
          onClick={(e) => {
            e.stopPropagation(); // 버블링 방지
            handleAlbumClick(album);
          }}
        >
          <img src={MoreHoriz} alt="more_content" />
        </button>
        <img src={album?.cover_image || defaultAlbumImage} alt="album_cover" />
      </div>
    </div>
  );
};
export default AlbumsItem;
