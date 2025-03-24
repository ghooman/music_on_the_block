import "./AlbumsTable.scss";

import halfHeartIcon from "../../assets/images/icon/half-heart.svg";

const AlbumsTable = () => {
  return (
    <div className="albums-table">
      <table>
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
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
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
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
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
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
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
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
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
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>Yolkhead</td>
            <td>AI Lyric & Songwriting</td>
            <td>Lyric</td>
            <td>Songname</td>
            <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
            <td>
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>7</td>
            <td>Yolkhead</td>
            <td>AI Lyric & Songwriting</td>
            <td>Lyric</td>
            <td>Songname</td>
            <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
            <td>
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>8</td>
            <td>Yolkhead</td>
            <td>AI Lyric & Songwriting</td>
            <td>Lyric</td>
            <td>Songname</td>
            <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
            <td>
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>9</td>
            <td>Yolkhead</td>
            <td>AI Lyric & Songwriting</td>
            <td>Lyric</td>
            <td>Songname</td>
            <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
            <td>
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>10 </td>
            <td>Yolkhead</td>
            <td>AI Lyric & Songwriting</td>
            <td>Lyric</td>
            <td>Songname</td>
            <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
            <td>
              <div className="td-content">
                <img src={halfHeartIcon} alt="like-heart-icon"></img>
              </div>
            </td>
            <td>
              <div className="td-content">
                <button className="albums-table__detail-btn">Detail</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  );
};

export default AlbumsTable;
