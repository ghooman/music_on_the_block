import { useEffect } from 'react';
import ModalWrap from './ModalWrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatUtcTime, formatLocalTime } from '../utils/getFormattedTime';
import './TransactionsModal.scss';
import NoneContent from './unit/NoneContent';

const TransactionsModal = ({ setTransactionsModal, txidData }) => {
  const leaderBoardData = [
    {
      id: 1,
      status: 'Buy',
      time: 'Sat, 04 Nov 2023 14:40:00 UTC+9',
    },
    {
      id: 2,
      status: 'Sell',
      time: 'Sat, 04 Nov 2023 14:40:00 UTC+9',
    },
    {
      id: 3,
      status: 'Cancel',
      time: 'Sat, 04 Nov 2023 14:40:00 UTC+9',
    },
  ];

  console.log('txidData', txidData);
  return (
    <ModalWrap
      title="Transactions"
      onClose={() => setTransactionsModal(false)}
      className="transactions"
    >
      <div className="table-container">
        {txidData.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Time</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {txidData.map((item, index) => (
                <tr key={item.id}>
                  <td className={item.status}>{item.status}</td>
                  <td>{formatLocalTime(item.create_dt)}</td>
                  <td>
                    <Link
                      to={`https://polygonscan.com/tx/${item.tx_id}`}
                      className="link-btn"
                      target="_b"
                    >
                      link btn
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoneContent
          message='No transactions found'
          />
          // <span className="table-container__empty-text">No transactions found.</span>
        )}
      </div>
    </ModalWrap>
  );
};

export default TransactionsModal;
