import { useState } from 'react';

import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';
import NoneContent from '../unit/NoneContent';

import './Connections.scss';

const categories = ['Following', 'Followers'];

const Connections = () => {
    const [selectCategory, setSelectCategory] = useState(categories[0]);

    return (
        <div className="connections">
            <ContentWrap title="Connections">
                <SubCategories categories={categories} handler={setSelectCategory} value={selectCategory} />
                <ContentWrap.SubWrap gap={8}>
                    <Filter />
                    <Search />
                </ContentWrap.SubWrap>
            </ContentWrap>
        </div>
    );
};

export default Connections;
