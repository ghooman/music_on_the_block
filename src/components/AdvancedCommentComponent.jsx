import "../styles/AlbumDetail.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css"; // 기본 스타일
import "./AdvancedCommentComponent.scss"; // 다크 테마 스타일 추가
import { useUserDetail } from "../hooks/useUserDetail";
import userImg1 from "../assets/images/demo/album01.svg";
import userImg2 from "../assets/images/demo/album02.svg";
import userImg3 from "../assets/images/demo/album04.svg";

const AdvancedCommentComponent = ({ id }) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { data: userData } = useUserDetail();
  const [commentList, setCommentList] = useState([]);
  const [typingComment, setTypingComment] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  // 코멘트 리스트 가져오기
  useEffect(() => {
    const fetchCommentList = async () => {
      try {
        const response = await axios.get(
          `${serverApi}/api/music/${id}/comment?page=${commentPage}`
        );
        console.log("fetchCommentList", response.data);
        setCommentList(response.data);
      } catch (error) {
        console.error("코멘트 리스트 가져오기 에러:", error);
      }
    };
    fetchCommentList();
  }, [id, serverApi]);
  // 코멘트 작성
  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        `${serverApi}/api/music/${id}/comment?comment=${typingComment}`,
        {}
      );
      console.log("handleCommentSubmit", response.data);
      setTypingComment("");
      setCommentPage(1);
    } catch (error) {
      console.error("코멘트 작성 에러:", error);
    }
  };

  const [data] = useState([
    {
      userId: "01a",
      comId: "012",
      fullName: "Riya Negi",
      avatarUrl: userImg1,
      // userProfile: '/',
      text: "Hey, Loved your blog! ",
      timestamp: "2024-09-28T10:34:56Z",
      replies: [
        {
          userId: "02b",
          comId: "017",
          fullName: "Lily",
          // userProfile: '/',
          text: "I have a doubt about the 4th point🤔",
          timestamp: "2024-09-28T10:34:56Z",
          avatarUrl: userImg2,
          replies: [],
        },
      ],
    },
  ]);
  console.log("userData", userData);
  return (
    <div>
      <CommentSection
        currentUser={{
          currentUserId: userData?.id,
          currentUserImg: userData?.profile || userImg3,
          currentUserFullName: userData?.name, // 로그인 안했을때 .. 추가해야됨
        }}
        advancedInput={true}
        commentData={data}
        placeholder="Write a comment..."
      />
    </div>
  );
};

export default AdvancedCommentComponent;
