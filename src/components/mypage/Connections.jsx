import { useState } from 'react';

import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';

import './Connections.scss';
import AlbumsTable from '../unit/AlbumsTable';

const categories = [
    { name: 'Following', preparing: false },
    { name: 'Followers', preparing: false },
];

const Connections = () => {
    const [selectCategory, setSelectCategory] = useState(categories[0].name);

    return (
        <div className="connections">
            <ContentWrap title="Connections">
                <SubCategories categories={categories} handler={setSelectCategory} value={selectCategory} />
                <ContentWrap.SubWrap gap={8}>
                    <Filter />
                    <Search />
                </ContentWrap.SubWrap>
                <AlbumsTable />
                <Pagination />
            </ContentWrap>
        </div>
    );
};

export default Connections;
