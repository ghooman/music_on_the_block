import { useEffect, useState } from 'react';

import ContentWrap from '../unit/ContentWrap';
import Filter from '../unit/Filter';
import Search from '../unit/Search';
import SubCategories from '../unit/SubCategories';
import Pagination from '../unit/Pagination';

import './Connections.scss';
import AlbumsTable from '../unit/AlbumsTable';
import { useSearchParams } from 'react-router-dom';

const categories = [
    { name: 'Following', preparing: false },
    { name: 'Followers', preparing: false },
];

const Connections = () => {
    const [searchParamas] = useSearchParams();
    const [selectCategory, setSelectCategory] = useState(categories[0].name);

    const page = searchParamas.get('page');
    const search = searchParamas.get('search');
    const connections = searchParamas.get('connections');

    useEffect(() => {}, [page, search, connections]);

    return (
        <div className="connections">
            <ContentWrap title="Connections">
                <SubCategories categories={categories} handler={setSelectCategory} value={selectCategory} />
                <ContentWrap.SubWrap gap={8}>
                    <Filter connections />
                    <Search />
                </ContentWrap.SubWrap>
                <AlbumsTable />
                <Pagination />
            </ContentWrap>
        </div>
    );
};

export default Connections;
