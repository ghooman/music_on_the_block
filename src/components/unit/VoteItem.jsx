import { Link } from 'react-router-dom';
// 이미지
import defaultCoverImg from '../../assets/images/header/logo-png.png';
import defaultAlbumImage from '../../assets/images/album/album-cover.png';
// 스타일
import './VoteItem.scss';

function VoteItem({
  albumImage,
  type,
  playCount,
  likeCount,
  musicTitle,
  artistImage,
  artistName,
  voteCount,
  detailLink,
  isVoted = false, // 투표 전 btn--vote
  onVoteClick,
  disabled = false,
}) {
  return (
    <div className="vote-item">
      <Link to={detailLink} className="vote-item__music-cover">
        <img src={albumImage || defaultAlbumImage} alt={musicTitle} />
      </Link>
      <div>
        <ul className="vote-item__meta">
          <li className="vote-item__meta__type">
            <span>{type}</span>
          </li>
          <li className="vote-item__meta__play">
            <span>{playCount}</span>
          </li>
          <li className="vote-item__meta__like">
            <span>{likeCount}</span>
          </li>
        </ul>
        <strong className="vote-item__tit">{musicTitle}</strong>
        <div className="vote-item__artist">
          <img src={artistImage || defaultCoverImg} alt="" className="artist-cover" />
          <strong className="artist-name">{artistName}</strong>
        </div>
      </div>
      <div className="vote-item__vote">
        <small>현재 득표 수</small>
        <strong>{voteCount}</strong>
      </div>
      <button
        className={`vote-item__btn ${
          disabled ? 'vote-item__btn--success' : 'vote-item__btn--vote'
        }`}
        onClick={onVoteClick}
      >
        {isVoted ? '투표를 완료하였습니다.' : '투표하기'}
      </button>
    </div>
  );
}

export default VoteItem;
