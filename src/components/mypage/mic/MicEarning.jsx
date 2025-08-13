import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MicHistoryTable from '../../table/MicHistoryTable';
import Pagination from '../../unit/Pagination';
import './MicEarning.scss';

function MicEarning() {
    const { t } = useTranslation('my_page');
    const [page, setPage] = useState(1);
    const viewCount = 10;

    // 테스트용 데이터
    const micHistory = [
        { date: '2025-07-12', listening: 30, generated: 20, total: 50 },
    ];

    const pagedData = micHistory.slice((page - 1) * viewCount, page * viewCount);
  return (
    <>
        <ul className='mic-stats'>
            <li>
                <span className='mic-stats__tit'>{t('MIC Earned Today')}</span>
                <strong className='mic-stats__txt'>30</strong>
            </li>
            <li>
                <span className='mic-stats__tit'>{t('Current MIC Balance')}</span>
                <strong className='mic-stats__txt'>211,049</strong>
            </li>
            <li>
                <span className='mic-stats__tit'>{t('Total MIC Earned')}</span>
                <strong className='mic-stats__txt'>1,534,649</strong>
            </li>
        </ul>
        <section className="mic-history-table">
            <h2 className="mic-history-table__tit">{t('MIC Earning History')}</h2>
            <p className="mic-history-table__txt">{t('Earning history is updated every 24 hours.')}</p>
            
            {/* MIC History Table */}
            <MicHistoryTable micHistory={micHistory} />
            <Pagination totalCount={micHistory.length} viewCount={viewCount} page={page} />
        </section>
    
    </>
  )
}

export default MicEarning