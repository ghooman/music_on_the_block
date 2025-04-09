import './Reward.scss';
import viewAllBackground from '../../assets/images/mypage/view-all-button.png';
// 컴포넌트
import Filter from '../unit/Filter';

import ContentWrap from '../unit/ContentWrap';
import FilterItems from '../unit/FilterItems';

const Reward = () => {
    return (
        <div className="mypage__reward-payment">
            <ContentWrap title="Reward Type">
                <Filter list={['All', 'Latest']} />
            </ContentWrap>
        </div>
        // <div className="mypage__reward-payment">
        //     <section className="reward__section">
        //         <div className="section__header">
        //             <h2 className="header-title">Reward Type</h2>
        //             <button className="header-button">View All</button>
        //         </div>
        //         <div className="section__filter">
        //             <Filter list={['All', 'Latest']} />
        //         </div>
        //         <div className="section__table">
        //             <table>
        //                 <thead>
        //                     <tr>
        //                         <th>#</th>
        //                         <th>Type</th>
        //                         <th>Prize</th>
        //                         <th>Date</th>
        //                         <th>Source</th>
        //                         <th>Status</th>
        //                         <th>Details</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     <tr>
        //                         <td>1</td>
        //                         <td>Likes Received</td>
        //                         <td>150 MOB</td>
        //                         <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
        //                         <td>AI Lyrics & Songwriting</td>
        //                         <td className="pending">Pending</td>
        //                         <td>
        //                             <div className="td-content">
        //                                 <button className="table-button">Details</button>
        //                             </div>
        //                         </td>
        //                     </tr>
        //                     <tr>
        //                         <td>1</td>
        //                         <td>Likes Received</td>
        //                         <td>150 MOB</td>
        //                         <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
        //                         <td>AI Lyrics & Songwriting</td>
        //                         <td className="completed">Completed</td>
        //                         <td>
        //                             <div className="td-content">
        //                                 <button className="table-button">Details</button>
        //                             </div>
        //                         </td>
        //                     </tr>
        //                 </tbody>
        //             </table>
        //         </div>
        //     </section>
        //     <section className="payment__section">
        //         <div className="section__header">
        //             <h2 className="header-title">Payment Type</h2>
        //             <button className="header-button">View All</button>
        //         </div>
        //         <div className="section__filter">
        //             <Filter list={['All', 'Latest']} />
        //         </div>
        //         <div className="section__table">
        //             <table>
        //                 <thead>
        //                     <tr>
        //                         <th>#</th>
        //                         <th>Type</th>
        //                         <th>Prize</th>
        //                         <th>Date</th>
        //                         <th>Source</th>
        //                         <th>Status</th>
        //                         <th>Details</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     <tr>
        //                         <td>1</td>
        //                         <td>Likes Received</td>
        //                         <td>150 MOB</td>
        //                         <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
        //                         <td>AI Lyrics & Songwriting</td>
        //                         <td className="pending">Pending</td>
        //                         <td>
        //                             <div className="td-content">
        //                                 <button className="table-button">Details</button>
        //                             </div>
        //                         </td>
        //                     </tr>
        //                     <tr>
        //                         <td>1</td>
        //                         <td>Likes Received</td>
        //                         <td>150 MOB</td>
        //                         <td>Sat, 04 Nov 2023 14:40:00 UTC+0</td>
        //                         <td>AI Lyrics & Songwriting</td>
        //                         <td className="completed">Completed</td>
        //                         <td>
        //                             <div className="td-content">
        //                                 <button className="table-button">Details</button>
        //                             </div>
        //                         </td>
        //                     </tr>
        //                 </tbody>
        //             </table>
        //         </div>
        //     </section>
        // </div>
    );
};

export default Reward;
