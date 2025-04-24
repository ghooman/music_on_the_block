import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import UnFollowModal from '../UnFollowModal';
import NoneContent from './NoneContent';

import defaultImage from '../../assets/images/header/logo-png.png';

import './UserTable.scss';
import { Table, TableBody, TableHeader, TableItem } from '../table/TableCompositions';

/**
 *
 * @param {object[]} userList : 유저 리스트 데이터
 * @param {boolean} unFollowOption : 언팔로우 옵션 (버튼 및 테이블 활성화)
 * @param {boolean} followOption : 팔로우 옵션 (버튼 및 테이블 활성화)
 * @param {function} handleUnFollow : 언팔로우 핸들러
 * @param {function} handleFollow : 팔로우 핸들러
 * @returns
 */

const UserTable = ({
  userList = [],
  unFollowOption,
  followOption,
  handleUnFollowing,
  handleFollowing,
}) => {
  const navigate = useNavigate();

  // return (
  //   <Table>
  //     <TableHeader>
  //       <TableHeader.Col>#</TableHeader.Col>
  //       <TableHeader.Col>Artist</TableHeader.Col>
  //       <TableHeader.Col>Level</TableHeader.Col>
  //       <TableHeader.Col>Total Songs</TableHeader.Col>
  //       <TableHeader.Col>Followers</TableHeader.Col>
  //       <TableHeader.Col>Details</TableHeader.Col>
  //       {unFollowOption && <TableHeader.Col>Unfollow</TableHeader.Col>}
  //       {followOption && <TableHeader.Col>Follow</TableHeader.Col>}
  //     </TableHeader>
  //     <TableBody>
  //       {userList.map((item, index) => (
  //         <React.Fragment key={item.id}>
  //           <TableItem>
  //             <TableItem.Text text={index + 1} />
  //             <TableItem.UserInfo image={item.profile} name={item.artist} />
  //             <TableItem.Text text={item.level} />
  //             <TableItem.Text text={item.total_songs} />
  //             <TableItem.Text text={item.followers} />
  //             <TableItem.Button
  //               title="Details"
  //               type="details"
  //               handleClick={() => navigate(`/profile?username=${item.artist}`)}
  //             />
  //             {unFollowOption && (
  //               <TableItem.Button
  //                 title={item.is_follow ? 'Follow' : 'Unfollow'}
  //                 type={item.is_follow ? 'follow' : 'unfollow'}
  //                 handleClick={() => {
  //                   if (item.is_follow) {
  //                     handleFollowing(item.user_id);
  //                   } else {
  //                     handleUnFollowing(item.user_id);
  //                   }
  //                 }}
  //               />
  //             )}
  //             {followOption && (
  //               <TableItem.Button
  //                 title={item.is_follow ? 'Following' : 'Follow'}
  //                 type={item.is_follow ? 'following' : 'follow'}
  //                 handleClick={() => {
  //                   if (item?.is_follow) return;
  //                   handleFollowing(item.user_id);
  //                 }}
  //               />
  //             )}
  //           </TableItem>
  //         </React.Fragment>
  //       ))}
  //     </TableBody>
  //   </Table>
  // );

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Artist</th>
            <th>Level</th>
            <th>Total Songs</th>
            <th>Followers</th>
            <th>Details</th>
            {unFollowOption && <th>Unfollow</th>}
            {followOption && <th>Follow</th>}
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <tr key={user.id || index}>
              <td>{index + 1}</td>
              <td>
                <div className="user-table__picture-name">
                  <img src={user.profile || defaultImage} alt="profile" />
                  <p>{user.artist}</p>
                </div>
              </td>
              <td>{user.level?.toLocaleString()}</td>
              <td>{user.total_songs?.toLocaleString()}</td>
              <td>{user.followers?.toLocaleString()}</td>
              <td>
                <button
                  className="user-table__button detail"
                  onClick={() => {
                    navigate(`/profile?username=${user.artist}`);
                  }}
                >
                  Details
                </button>
              </td>
              {unFollowOption && (
                <td>
                  {user?.is_follow ? (
                    <button
                      className="user-table__button follow"
                      onClick={() => {
                        handleFollowing(user.user_id);
                      }}
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      className="user-table__button unfollow"
                      onClick={() => {
                        handleUnFollowing(user);
                      }}
                    >
                      Unfollow
                    </button>
                  )}
                </td>
              )}
              {followOption && (
                <td>
                  <button
                    className={`user-table__button ${user?.is_follow ? 'following' : 'follow'}`}
                    onClick={() => {
                      if (user?.is_follow) return;
                      handleFollowing(user.user_id);
                    }}
                  >
                    {user.is_follow ? 'Following' : 'Follow'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {userList?.length === 0 && (
        <NoneContent message={'There are no connections yet'} height={300} />
      )}
    </div>
  );
};

export default UserTable;
