

import { Link } from 'react-router-dom';
// 이미지
import SampleAlbumImg from '../../assets/images/vote/vote-sample-album.png';
import SampleArtistImg from '../../assets/images/vote/vote-sample-artist.png';
// 스타일
import './VoteItem.scss';

function VoteItem({
    albumImage,
    genre,
    playCount,
    heartCount, 
    musicTitle, 
    artistImage, 
    artistName, 
    voteCount,
    detailLink
}) {
  return (
    <div className='vote-item'>
        <Link to={detailLink} className='vote-item__music-cover'>
            <img src={albumImage|| SampleAlbumImg} alt={musicTitle} />
        </Link>
        <div>
            <ul className='vote-item__meta'>
                <li className='vote-item__meta__genre'>
                    <span>
                        {genre}
                    </span>
                </li>
                <li className='vote-item__meta__play'>
                    <span>
                        {playCount}
                    </span>
                </li>
                <li className='vote-item__meta__heart'>
                    <span>
                        {heartCount}
                    </span>
                </li>
            </ul>
            <strong className='vote-item__tit'>
                {musicTitle}
            </strong>
            <div className='vote-item__artist'>
                <img src={artistImage || SampleArtistImg} alt="" className='artist-cover' />
                <strong className='artist-name'>
                    {artistName}
                </strong>
            </div>
        </div>
        <div className='vote-item__vote'>
            <small>현재 득표 수</small>
            <strong>
                {voteCount}
            </strong>
        </div>
        <button className='vote-item__btn vote-item__btn--vote'>
            투표하기
        </button>
    </div>
  )
}

export default VoteItem