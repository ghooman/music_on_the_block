import { useNavigate } from 'react-router-dom';
import NoneContent from '../unit/NoneContent';
import React, { useState } from 'react';

import { Table, TableBody, TableHeader, TableItem, TableWrapper } from '../table/TableCompositions';

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

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeader.Col>#</TableHeader.Col>
          <TableHeader.Col>Artist</TableHeader.Col>
          <TableHeader.Col>Level</TableHeader.Col>
          <TableHeader.Col>Total Songs</TableHeader.Col>
          <TableHeader.Col>Followers</TableHeader.Col>
          <TableHeader.Col>Details</TableHeader.Col>
          {unFollowOption && <TableHeader.Col>Unfollow</TableHeader.Col>}
          {followOption && <TableHeader.Col>Follow</TableHeader.Col>}
        </TableHeader>
        <TableBody>
          {userList.map((item, index) => (
            <React.Fragment key={item.id + index}>
              <TableItem>
                <TableItem.Text text={index + 1} />
                <TableItem.UserInfo image={item.profile} name={item.artist} />
                <TableItem.UserGrade grade={item.user_rating} />
                <TableItem.Text text={item.total_songs} />
                <TableItem.Text text={item.followers} />
                <TableItem.Button
                  title="Details"
                  type="details"
                  handleClick={() => navigate(`/profile?username=${item.artist}`)}
                />
                {unFollowOption && (
                  <TableItem.Button
                    title={item.is_follow ? 'Follow' : 'Unfollow'}
                    type={item.is_follow ? 'follow' : 'unfollow'}
                    handleClick={() => {
                      if (item.is_follow) {
                        handleFollowing(item.user_id);
                      } else {
                        handleUnFollowing(item.user_id);
                      }
                    }}
                  />
                )}
                {followOption && (
                  <TableItem.Button
                    title={item.is_follow ? 'Following' : 'Follow'}
                    type={item.is_follow ? 'following' : 'follow'}
                    handleClick={() => {
                      if (item?.is_follow) return;
                      handleFollowing(item.user_id);
                    }}
                  />
                )}
              </TableItem>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {userList.length <= 0 && (
        <NoneContent message={'There are no connections yet'} height={300} />
      )}
    </TableWrapper>
  );
};

export default UserTable;
