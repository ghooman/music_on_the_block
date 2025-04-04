// components/AdvancedCommentComponent.js
import "../styles/AlbumDetail.scss";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css"; // 기본 스타일
import "./AdvancedCommentComponent.scss"; // 다크 테마 스타일 추가
import { useUserDetail } from "../hooks/useUserDetail";
import defaultCoverImg from "../assets/images/header/logo.svg";
const AdvancedCommentComponent = ({ id }) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { data: userData } = useUserDetail();
  const { token } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);

  // 코멘트 리스트를 서버에서 가져오고 라이브러리 형식에 맞게 변환하는 함수
  const fetchCommentList = async () => {
    try {
      const response = await axios.get(
        `${serverApi}/api/music/${id}/comment?page=${commentPage}`
      );
      const transformedComments = response.data.map((item) => ({
        userId: item.name,
        comId: item.id,
        fullName: item.name,
        avatarUrl: item.profile || defaultCoverImg,
        text: item.comment,
        timestamp: item.create_dt,
        replies: item.comment_list.map((reply) => ({
          userId: reply.id,
          comId: `${reply.id}_${new Date(reply.create_dt).getTime()}`,
          fullName: reply.name,
          avatarUrl: reply.profile || defaultCoverImg,
          text: reply.comment,
          timestamp: reply.create_dt,
          replies: [],
        })),
      }));
      setComments(transformedComments);
      console.log("fetchCommentList res", response);
      console.log("fetchCommentList", transformedComments);
    } catch (error) {
      console.error("코멘트 리스트 가져오기 에러:", error);
    }
  };

  // 최초 및 페이지 변경시 코멘트 리스트 갱신
  useEffect(() => {
    fetchCommentList();
  }, [id, serverApi, commentPage]);

  // 상위 댓글 작성 함수 (onSubmitAction)
  const handleCommentSubmit = async (commentData) => {
    try {
      const response = await axios.post(
        `${serverApi}/api/music/${id}/comment?comment=${commentData.text}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("handleCommentSubmit", response.data);
      fetchCommentList(); // 댓글 작성 후 최신 데이터 갱신
    } catch (error) {
      console.error("코멘트 작성 에러:", error);
    }
  };

  // 대댓글 작성 함수 (onReplyAction)
  const handleReplySubmit = async (replyData) => {
    console.log("replyData", replyData);
    try {
      const response = await axios.post(
        `${serverApi}/api/music/comment/${replyData.repliedToCommentId}/reply?comment=${replyData.text}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("handleReplySubmit", response.data);
      fetchCommentList(); // 대댓글 작성 후 최신 데이터 갱신
    } catch (error) {
      console.error("대댓글 작성 에러:", error);
    }
  };

  // 코멘트 수정 함수 (onEditAction)
  const handleEditSubmit = async (editData) => {
    try {
      // 서버에 코멘트 수정 요청 (적절한 API 엔드포인트를 확인하여 수정)
      const response = await axios.put(
        `${serverApi}/api/music/comment/${editData.comId}?comment=${editData.text}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("handleEditSubmit", response.data);
      fetchCommentList(); // 수정 후 최신 데이터 갱신
    } catch (error) {
      console.error("코멘트 수정 에러:", error);
    }
  };

  return (
    <div>
      <CommentSection
        currentUser={{
          currentUserId: userData?.id,
          currentUserImg: userData?.profile || defaultCoverImg,
          currentUserFullName: userData?.name,
        }}
        advancedInput={true}
        commentData={comments}
        placeholder="Write a comment..."
        onSubmitAction={(commentData) => {
          handleCommentSubmit(commentData);
        }}
        onReplyAction={(replyData) => {
          handleReplySubmit(replyData);
        }}
        onEditAction={(editData) => {
          handleEditSubmit(editData);
        }}
      />
    </div>
  );
};

export default AdvancedCommentComponent;
