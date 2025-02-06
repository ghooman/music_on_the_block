import "./Albums.scss";

import heartIcon from "../../assets/images/icon/heart.svg";
import moreIcon from "../../assets/images/icon/more.svg";
import playIcon from "../../assets/images/icon/play.svg";
import commentIcon from "../../assets/images/icon/comment.svg";
import demoAlbum from "../../assets/images/mypage/demo-album.png";
import demoUser from "../../assets/images/mypage/demo-user.png";
import emptyHeartIcon from "../../assets/images/icon/empty-heart.svg";
import halfHeartIcon from "../../assets/images/icon/half-heart.svg";
import Filter from "../filter/Filter";
const Albums = () => {
  return (
    <div className="albums">
      <h1 className="albums__title">Top Albums</h1>
      <Filter />

      <div className="albums__list">
        <div className="albums__item">
          <p className="albums__item-title">Top Likes</p>
          <div className="albums__item-intro">
            <div className="albums__item__img-box">
              <img className="albums__item__img" src={demoAlbum} alt="album" />
            </div>
            <div className="albums__item-desc">
              <p className="albums__item-desc-text">
                he dances through his masks like breathing - Yolkhead
              </p>
              <div className="albums__item__play-count">
                <img src={heartIcon} alt="play" />
                <span>145</span>
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
              <img className="albums__item__img" src={demoAlbum} alt="album" />
            </div>
            <div className="albums__item-desc">
              <p className="albums__item-desc-text">
                he dances through his masks like breathing - Yolkhead
              </p>
              <div className="albums__item__play-count">
                <img src={commentIcon} alt="play" />
                <span>326</span>
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
              <img className="albums__item__img" src={demoAlbum} alt="album" />
            </div>
            <div className="albums__item-desc">
              <p className="albums__item-desc-text">
                he dances through his masks like breathing - Yolkhead
              </p>
              <div className="albums__item__play-count">
                <img src={playIcon} alt="play" />
                <span>326K</span>
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

      <section className="albums__my-albums">
        <div className="my-albums__header">
          <p className="my-albums__title">
            My <span className="neon">Albums</span>
          </p>
          <button className="my-albums__more-btn"> View All </button>
        </div>
        <div className="my-albums__input">
          <input
            type="text"
            className="my-albums__search"
            placeholder="Search"
          />
        </div>
        <div className="my-albums__filter">
          <Filter />
        </div>

        <table className="my-albums__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Artist</th>
              <th>AI Service</th>
              <th>AI Service Type</th>
              <th>Song Title</th>
              <th>Date</th>
              <th>Like</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Yolkhead</td>
              <td>AI Lyric & Songwriting</td>
              <td>Lyric</td>
              <td>Songname</td>
              <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
              <td>
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </td>
              <td>
                <button className="my-albums__detail-btn">View Detail</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Yolkhead</td>
              <td>AI Lyric & Songwriting</td>
              <td>Lyric</td>
              <td>Songname</td>
              <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
              <td>
                <img src={emptyHeartIcon} alt="like-heart-icon"></img>
              </td>
              <td>
                <button className="my-albums__detail-btn">View Detail</button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Yolkhead</td>
              <td>AI Lyric & Songwriting</td>
              <td>Lyric</td>
              <td>Songname</td>
              <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
              <td>
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </td>
              <td>
                <button className="my-albums__detail-btn">View Detail</button>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>Yolkhead</td>
              <td>AI Lyric & Songwriting</td>
              <td>Lyric</td>
              <td>Songname</td>
              <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
              <td>
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </td>
              <td>
                <button className="my-albums__detail-btn">View Detail</button>
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>Yolkhead</td>
              <td>AI Lyric & Songwriting</td>
              <td>Lyric</td>
              <td>Songname</td>
              <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
              <td>
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </td>
              <td>
                <button className="my-albums__detail-btn">View Detail</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Albums;
