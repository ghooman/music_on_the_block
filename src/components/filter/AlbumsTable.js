import "./AlbumsTable.scss";

import halfHeartIcon from "../../assets/images/icon/half-heart.svg";

const AlbumsTable = () => {
  return (
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
            <img src={halfHeartIcon} alt="like-heart-icon"></img>
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
        <tr>
          <td>6</td>
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
          <td>7</td>
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
          <td>8</td>
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
          <td>9</td>
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
          <td>10 </td>
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
  );
};

export default AlbumsTable;
