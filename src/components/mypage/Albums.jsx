import { useSearchParams } from 'react-router-dom';
import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Pagination from '../unit/Pagination';
import Search from '../unit/Search';
import SubBanner from '../../components/create/SubBanner';

import subBannerImage4 from '../../assets/images/create/subbanner-bg4.png';

import './Albums.scss';

const Albums = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const albumSort = searchParams.get('album_sort');

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
                    <Filter />
                    <Search placeholder="Search by album name..." reset={{ page: 1 }} />
                </ContentWrap.SubWrap>
                {/** */}
                <Pagination />
            </ContentWrap>
        </div>
    );
};

export default Albums;
