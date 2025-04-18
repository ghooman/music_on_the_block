import { Link } from 'react-router-dom';

import './AlbumsTable.scss';

import halfHeartIcon from '../../assets/images/icon/half-heart.svg';
import NoneContent from './NoneContent';

/**
 *
 * @param {Array} songList : 곡의 데이터 리스트입니다.
 * @param {Component} children : 페이지네이션을 넣는 것을 권장드립니다! (부모 컴포넌트에서 페이지네이션 조작을 위해)
 * @returns
 */

const AlbumsTable = ({
    songList = [],
    // children
}) => {
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
                        {songList && songList.length > 0 && (
                            <>
                                {songList?.map((album, index) => (
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
                                                <Link
                                                    className="albums-table__detail-btn"
                                                    to={`/song-detail/${album.id}`}
                                                >
                                                    Detail
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
                {songList?.length === 0 && <NoneContent message={'There are no songs created yet.'} height={300} />}
                {/* {songList?.length > 0 && (
                    <Pagination totalCount={totalCount} viewCount={viewCount} page={page} setPage={setPage} />
                )} */}
            </div>
        </>
    );
};

export default AlbumsTable;
