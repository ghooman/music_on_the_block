import "./AlbumsTable.scss";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import halfHeartIcon from "../../assets/images/icon/half-heart.svg";
import NoneContent from "../../components/NoneContent";
import Pagination from "../Pagination";
const AlbumsTable = () => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigator = useNavigate();
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const viewCount = 10;
  // 앨범 목록 가져오기
  const [albums, setAlbums] = useState([]);
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          `${serverApi}/api/music/my/list?page=${page + 1}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalCount(response.data.total_cnt);
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
          {albums && albums.length > 0 && (
            <>
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
            </>
          )}
        </tbody>
      </table>
      <Pagination
        page={page}
        setPage={(page) => setPage(page)}
        totalCount={totalCount}
        viewCount={viewCount}
      />
      {albums?.length === 0 && (
        <NoneContent message={"No albums created"} height={300} />
      )}
    </div>
  );
};

export default AlbumsTable;
