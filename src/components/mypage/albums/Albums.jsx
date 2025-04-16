import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ContentWrap from "../../unit/ContentWrap";
import Filter from "../../unit/Filter";
import Pagination from "../../unit/Pagination";
import Search from "../../unit/Search";
import SubBanner from "../../../components/create/SubBanner";
import AlbumsItem from "./AlbumsItem";

import subBannerImage4 from "../../../assets/images/create/subbanner-bg4.png";
import "./Albums.scss";
import DemoImg from "../../../assets/images/demo/album01.svg";

const dummyAlbumDataList = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "Ocean Waves",
    cover_image: DemoImg,
    song_count: 12,
  },
  {
    id: 2,
    title: "Midnight Dreams",
    artist: "Starlight",
    cover_image: DemoImg,
    song_count: 8,
  },
  {
    id: 3,
    title: "Urban Jungle",
    artist: "City Lights",
    cover_image: DemoImg,
    song_count: 15,
  },
  {
    id: 4,
    title: "Mountain Echo",
    artist: "Nature Sounds",
    cover_image: DemoImg,
    song_count: 10,
  },
  {
    id: 5,
    title: "Electric Dreams",
    artist: "Neon Pulse",
    cover_image: DemoImg,
    song_count: 7,
  },
  {
    id: 6,
    title: "Rainy Days",
    artist: "Cloud Nine",
    cover_image: DemoImg,
    song_count: 9,
  },
  {
    id: 7,
    title: "Desert Winds",
    artist: "Sand Dunes",
    cover_image: DemoImg,
    song_count: 11,
  },
  {
    id: 8,
    title: "Ocean Depths",
    artist: "Deep Blue",
    cover_image: DemoImg,
    song_count: 6,
  },
  {
    id: 9,
    title: "Forest Whispers",
    artist: "Green Leaf",
    cover_image: DemoImg,
    song_count: 14,
  },
  {
    id: 10,
    title: "City Nights",
    artist: "Urban Beat",
    cover_image: DemoImg,
    song_count: 13,
  },
  {
    id: 11,
    title: "Morning Light",
    artist: "Sunrise",
    cover_image: DemoImg,
    song_count: 5,
  },
  {
    id: 12,
    title: "Winter Tales",
    artist: "Snowfall",
    cover_image: DemoImg,
    song_count: 8,
  },
];

const Albums = () => {
  const [searchParams] = useSearchParams();
  const [createAlbumModal, setCreateAlbumModal] = useState(false);

  const albumSort = searchParams.get("album_sort");
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <div className="albums">
      <SubBanner>
        <SubBanner.LeftImages src={subBannerImage4} />
        <SubBanner.Title text="Create Your Own Album" />
        <SubBanner.Message text="Gather your favorite tracks and organise them into a single. You can showcase your musical world!" />
        <SubBanner.Button title="Create Album" />
      </SubBanner>
      <ContentWrap title="Albums List">
        <ContentWrap.SubWrap gap={8}>
          <Filter albumSort={true} />
          <Search placeholder="Search by album name..." reset={{ page: 1 }} />
        </ContentWrap.SubWrap>
        <div className="albums-list">
          {dummyAlbumDataList?.map((album, index) => (
            <AlbumsItem key={album?.id} album={album} />
          ))}
        </div>
        <Pagination
          totalCount={dummyAlbumDataList?.length}
          viewCount={12}
          page={page}
        />
      </ContentWrap>
    </div>
  );
};

export default Albums;
