import MoreHoriz from "../../../assets/images/icon/more-horiz.svg";
import defaultAlbumImage from "../../../assets/images/mypage/albums-upload-logo.png";
import { useNavigate } from "react-router-dom";
import "./AlbumsItem.scss";
const AlbumsItem = ({ album, handleAlbumDetailClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className="albums-item"
      onClick={() => navigate(`/my-page/albums-detail/${album?.id}`)}
    >
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
            handleAlbumDetailClick(album);
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
