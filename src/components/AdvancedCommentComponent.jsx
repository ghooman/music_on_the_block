import '../styles/AlbumDetail.scss';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css'; // 기본 스타일
import './AdvancedCommentComponent.scss'; // 다크 테마 스타일 추가
import { useUserDetail } from '../hooks/useUserDetail';
import defaultCoverImg from '../assets/images/header/logo.svg';
import { useTranslation } from 'react-i18next';

const AdvancedCommentComponent = ({ id }) => {
  const { t } = useTranslation('song_detail');
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { data: userData } = useUserDetail();
  const { token } = useContext(AuthContext);
  const [comments, setComments] = useState([]);

  // 코멘트 리스트를 서버에서 가져오고 라이브러리 형식에 맞게 변환하는 함수
  const fetchCommentList = async () => {
    try {
      const response = await axios.get(`${serverApi}/api/music/${id}/comment`);
      const transformedComments = response.data.map(item => ({
        userId: item.wallet_address, // wallet_address를 식별자로 사용
        comId: item.id,
        fullName: item.name,
        avatarUrl: item.profile || defaultCoverImg,
        text: item.comment,
        timestamp: item.create_dt,
        replies: item.comment_list.map(reply => ({
          userId: reply.wallet_address, // 대댓글에서도 wallet_address 사용
          comId: `${reply.id}_${new Date(reply.create_dt).getTime()}`,
          fullName: reply.name,
          avatarUrl: reply.profile || defaultCoverImg,
          text: reply.comment,
          timestamp: reply.create_dt,
          replies: [],
        })),
      }));
      setComments(transformedComments);
      // console.log("fetchCommentList res", response);
      // console.log("fetchCommentList", transformedComments);
    } catch (error) {
      console.error('코멘트 리스트 가져오기 에러:', error);
    }
  };

  // 최초 및 id, serverApi 변경시 코멘트 리스트 갱신
  useEffect(() => {
    fetchCommentList();
  }, [id, serverApi]);

  // 상위 댓글 작성 함수 (onSubmitAction)
  const handleCommentSubmit = async commentData => {
    try {
      const response = await axios.post(
        `${serverApi}/api/music/${id}/comment?comment=${commentData.text}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('handleCommentSubmit', response.data);
      fetchCommentList(); // 댓글 작성 후 최신 데이터 갱신
    } catch (error) {
      console.error('코멘트 작성 에러:', error);
    }
  };

  // 대댓글 작성 함수 (onReplyAction)
  const handleReplySubmit = async replyData => {
    console.log('replyData', replyData);
    try {
      const response = await axios.post(
        `${serverApi}/api/music/comment/${replyData.repliedToCommentId}/reply?comment=${replyData.text}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('handleReplySubmit', response.data);
      fetchCommentList(); // 대댓글 작성 후 최신 데이터 갱신
    } catch (error) {
      console.error('대댓글 작성 에러:', error);
    }
  };

  // 코멘트 수정 함수 (onEditAction)
  const handleEditSubmit = async editData => {
    console.log('editData', editData);
    try {
      const response = await axios.post(
        `${serverApi}/api/music/comment/${editData.comId}?comment=${editData.text}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('handleEditSubmit', response.data);
      fetchCommentList(); // 수정 후 최신 데이터 갱신
    } catch (error) {
      console.error('코멘트 수정 에러:', error);
    }
  };

  // 코멘트 삭제 함수 추가 (onDeleteAction)
  const handleDeleteSubmit = async deleteData => {
    console.log('deleteData', deleteData);
    try {
      const response = await axios.delete(
        `${serverApi}/api/music/comment/${deleteData.comIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('handleDeleteSubmit', response.data);
      fetchCommentList(); // 삭제 후 최신 데이터 갱신
    } catch (error) {
      console.error('코멘트 삭제 에러:', error);
    }
  };

  return (
    <div>
      <CommentSection
        currentUser={{
          currentUserId: userData?.wallet_address, // currentUser 식별자로 wallet_address 사용
          currentUserImg: userData?.profile || defaultCoverImg,
          currentUserFullName: userData?.name,
        }}
        advancedInput={true}
        commentData={comments}
        placeHolder={t('Write a comment') + '...'}
        customNoComment={() => (
          <div className="no-comment">
            {t('No comments here.')}
            <br />
            {t('Be the first one to comment!')}
          </div>
        )}
        onSubmitAction={commentData => {
          handleCommentSubmit(commentData);
        }}
        onReplyAction={replyData => {
          handleReplySubmit(replyData);
        }}
        onEditAction={editData => {
          handleEditSubmit(editData);
        }}
        onDeleteAction={deleteData => {
          handleDeleteSubmit(deleteData);
        }}
      />
    </div>
  );
};

export default AdvancedCommentComponent;
