import "./AlbumsTable.scss";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import halfHeartIcon from "../../assets/images/icon/half-heart.svg";
const AlbumsTable = () => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigator = useNavigate();
  // 앨범 목록 가져오기
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`${serverApi}/api/music/my/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlbums(response.data.data_list);
        console.log("앨범 목록:", response.data);
      } catch (error) {
        console.error("앨범 목록 가져오기 에러:", error);
      }
    };
    fetchAlbums();
  }, [serverApi, token]);

  return (
    <div className="albums-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Artist</th>
            {/* <th>AI Service</th>
            <th>AI Service Type</th> */}
            <th>Song Title</th>
            <th>Date</th>
            <th>Like</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
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
          </tr> */}
          {albums?.map((album, index) => (
            <tr key={album.id}>
              <td>{index + 1}</td>
              <td>{album.name}</td>
              {/* <td>{album.ai_service}</td>
              <td>{album.ai_service_type}</td> */}
              <td>{album.title}</td>
              <td>{album.create_dt}</td>
              <td>
                <div className="td-content">
                  <img src={halfHeartIcon} alt="like-heart-icon"></img>
                </div>
              </td>
              <td>
                <div className="td-content">
                  <button
                    className="albums-table__detail-btn"
                    onClick={() => navigator(`/album-detail/${album.id}`)}
                  >
                    Detail
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlbumsTable;
