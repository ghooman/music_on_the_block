import './AlbumsTable.scss';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import halfHeartIcon from '../../assets/images/icon/half-heart.svg';
import NoneContent from './NoneContent';
import Pagination from './Pagination';

const serverApi = process.env.REACT_APP_SERVER_API;

const AlbumsTable = () => {
    const [albums, setAlbums] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    const { token } = useContext(AuthContext);
    const navigator = useNavigate();

    const page_ = searchParams.get('page');

    const viewCount = 10;

    // 앨범 목록 가져오기

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get(`${serverApi}/api/music/my/list?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalCount(response.data.total_cnt);
                setAlbums(response.data.data_list);
                console.log('앨범 목록:', response.data);
            } catch (error) {
                console.error('앨범 목록 가져오기 에러:', error);
            }
        };
        fetchAlbums();
    }, [serverApi, token, page]);

    return (
        <>
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
                            <th>Likes</th>
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
                          onClick={() => navigator(`/song-detail/${album.id}`)}
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
        {albums?.length === 0 && (
          <NoneContent message={"No albums created"} height={300} />
        )}
        {albums?.length > 0 && (
          <Pagination
            totalCount={totalCount}
            viewCount={viewCount}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default AlbumsTable;
