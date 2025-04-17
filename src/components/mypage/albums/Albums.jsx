import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import ContentWrap from "../../unit/ContentWrap";
import Filter from "../../unit/Filter";
import Pagination from "../../unit/Pagination";
import Search from "../../unit/Search";
import SubBanner from "../../../components/create/SubBanner";
import AlbumsItem from "./AlbumsItem";
import AlbumsCreateModal from "./AlbumsCreateModal";
import AlbumsDetailsModal from "./AlbumsDetailsModal";

import subBannerImage4 from "../../../assets/images/create/subbanner-bg4.png";
import "./Albums.scss";
import { getAlbumsList } from "../../../api/AlbumsListApi";

const Albums = () => {
  const { token } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [createAlbumModal, setCreateAlbumModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumsList, setAlbumsList] = useState([]);
  // 현재 albumSort는 url에 없음 기준나올때 추가
  const albumSort = searchParams.get("album_sort");
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleAlbumClick = (album) => {
    console.log(album);
    setSelectedAlbum(album);
    setShowDetailModal(true);
  };

  useEffect(() => {
    const fetchAlbumsList = async () => {
      const response = await getAlbumsList(token, page, search, albumSort);
      setAlbumsList(response.data.data_list);
    };
    fetchAlbumsList();
  }, []);

  return (
    <div className="albums">
      <SubBanner>
        <SubBanner.LeftImages src={subBannerImage4} />
        <SubBanner.Title text="Create Your Own Album" />
        <SubBanner.Message text="Gather your favorite tracks and organise them into a single. You can showcase your musical world!" />
        <SubBanner.Button
          title="Create Album"
          handler={() => setShowCreateModal(true)}
        />
      </SubBanner>
      <ContentWrap title="Albums List">
        <ContentWrap.SubWrap gap={8}>
          <Filter albumSort={true} />
          <Search placeholder="Search by album name..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <div className="albums-list">
          {albumsList?.map((album, index) => (
            <AlbumsItem
              key={album?.id}
              album={album}
              handleAlbumClick={handleAlbumClick}
            />
          ))}
        </div>
        <Pagination
          totalCount={albumsList?.length}
          viewCount={12}
          page={page}
        />
      </ContentWrap>
      {showCreateModal && (
        <AlbumsCreateModal setShowCreateModal={setShowCreateModal} />
      )}
      {showDetailModal && selectedAlbum && (
        <AlbumsDetailsModal
          setShowDetailModal={setShowDetailModal}
          album={selectedAlbum}
        />
      )}
    </div>
  );
};

export default Albums;
