import { useEffect } from 'react';
import ModalWrap from './ModalWrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

import './TransactionsModal.scss';

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

  return (
    <ModalWrap
      title="Transactions"
      onClose={() => setTransactionsModal(false)}
      className="transactions"
    >
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Time</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {leaderBoardData.map((item, index) => (
              <tr key={item.id}>
                <td className={item.status}>{item.status}</td>
                <td>{item.time}</td>
                <td>
                  <Link to="/" className="link-btn">
                    link btn
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalWrap>
  );
};

export default TransactionsModal;
