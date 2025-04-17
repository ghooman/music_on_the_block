import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import ContentWrap from '../../unit/ContentWrap';
import Filter from '../../unit/Filter';
import Pagination from '../../unit/Pagination';
import Search from '../../unit/Search';
import SubBanner from '../../../components/create/SubBanner';
import AlbumsItem from './AlbumsItem';
import AlbumsCreateModal from './AlbumsCreateModal';
import AlbumsDetailsModal from './AlbumsDetailsModal';
import NoneContent from '../../../components/unit/NoneContent';
import NoDataImage from '../../../assets/images/mypage/albums-no-data.svg';
import Loading from '../../../components/IntroLogo2';

import subBannerImage4 from '../../../assets/images/create/subbanner-bg4.png';
import './Albums.scss';
import { getAlbumsList } from '../../../api/AlbumsListApi';
import { useQuery } from 'react-query';

const Albums = () => {
    const { token } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const albumSort = searchParams.get('album_sort');
    const page = searchParams.get('page');
    const search = searchParams.get('search');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleAlbumClick = (album) => {
        console.log(album);
        setSelectedAlbum(album);
        setShowDetailModal(true);
    };
    // 앨범 목록 조회
    const {
        data: albumsList,
        isLoading,
        refetch,
    } = useQuery(['album_list', { token, page, search, albumSort }], async () => {
        const { data } = await getAlbumsList(token, page, search, albumSort);
        return data;
    });

    return (
        <div className="albums">
            <SubBanner>
                <SubBanner.LeftImages src={subBannerImage4} />
                <SubBanner.Title text="Create Your Own Album" />
                <SubBanner.Message text="Gather your favorite tracks and organise them into a single. You can showcase your musical world!" />
                <SubBanner.Button title="Create Album" handler={() => setShowCreateModal(true)} />
            </SubBanner>
            <ContentWrap title="Albums List">
                <ContentWrap.SubWrap gap={8}>
                    <Filter albumSort={true} />
                    <Search placeholder="Search by album name..." reset={{ page: 1 }} />
                </ContentWrap.SubWrap>

                <div className="albums-list">
                    {albumsList?.data_list?.map((album, index) => (
                        <AlbumsItem key={album?.id} album={album} handleAlbumClick={handleAlbumClick} />
                    ))}
                </div>
                {(!albumsList?.data_list || albumsList?.data_list.length === 0) && (
                    <NoneContent message={'There are no albums created yet.'} image={NoDataImage} height={300} />
                )}
                <Pagination totalCount={albumsList?.total_cnt} viewCount={12} page={page} />
            </ContentWrap>
            {showCreateModal && <AlbumsCreateModal setShowCreateModal={setShowCreateModal} onAlbumCreated={refetch} />}
            {showDetailModal && selectedAlbum && (
                <AlbumsDetailsModal setShowDetailModal={setShowDetailModal} album={selectedAlbum} />
            )}
            {isLoading && <Loading />}
        </div>
    );
};

export default Albums;
