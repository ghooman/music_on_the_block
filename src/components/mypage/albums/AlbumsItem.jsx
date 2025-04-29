import MoreHoriz from '../../../assets/images/icon/more-horiz.svg';
import defaultAlbumImage from '../../../assets/images/intro/mob-album-cover.png';
import { useNavigate } from 'react-router-dom';
import './AlbumsItem.scss';
const AlbumsItem = ({ album, handleAlbumDetailClick }) => {
  const navigate = useNavigate();

  return (
    <div className="albums-item" onClick={() => navigate(`/albums-detail/${album?.id}`)}>
      <div className="albums-item__info">
        <div className="albums-item__info--title">
          <h1>{album?.album_name}</h1>
          {album?.is_owner && (
            <button
              className="albums-item__info--title__edit-btn"
              onClick={e => {
                e.stopPropagation(); // 버블링 방지
                handleAlbumDetailClick(album);
              }}
            >
              <img src={MoreHoriz} alt="more_content" />
            </button>
          )}
        </div>
        <p>{album?.name}</p>
        <span>{album?.song_cnt} Songs</span>
      </div>
      <div className="albums-item__cover">
        <img src={album?.cover_image || defaultAlbumImage} alt="album_cover" />
      </div>
    </div>
  );
};
export default AlbumsItem;
