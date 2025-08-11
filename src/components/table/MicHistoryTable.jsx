import React from 'react';
import { useTranslation } from 'react-i18next';
import NoneContent from '../unit/NoneContent';
import { Table, TableBody, TableHeader, TableItem, TableWrapper } from '../table/TableCompositions';


function MicHistoryTable() {
    const { t } = useTranslation('my_page');
    const micHistory = [ 
        { date: '2025-07-12T00:00:00Z', listening: 30, generated: 20, total: 50 },
    ];
  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Col>{t('Date')}</TableHeader.Col>
          <TableHeader.Col>{t('Listening')}</TableHeader.Col>
          <TableHeader.Col>{t('Generated')}</TableHeader.Col>
          <TableHeader.Col>{t('Total MIC')}</TableHeader.Col>
        </TableHeader>

        <TableBody>
          {micHistory.map((item, idx) => (
            <React.Fragment key={idx}>
              <TableItem>
                {/* 날짜는 유틸 formatLocalTime을 쓰는 TableItem.Date 활용 */}
                <TableItem.Date date={item.date} />
                {/* 숫자는 천단위 표시 */}
                <TableItem.Text text={Number(item.listening ?? 0).toLocaleString()} />
                <TableItem.Text text={Number(item.generated ?? 0).toLocaleString()} />
                <TableItem.Text text={Number(item.total ?? 0).toLocaleString()} />
              </TableItem>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {micHistory.length <= 0 && (
        <NoneContent message={t('No earnings yet')} height={300} />
      )}
    </TableWrapper>
  )
}

export default MicHistoryTable