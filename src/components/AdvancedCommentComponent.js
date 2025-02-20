import React, { useState } from 'react';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css'; // 기본 스타일
import './AdvancedCommentComponent.scss'; // 다크 테마 스타일 추가

import userImg1 from '../assets/images/demo/album01.svg';
import userImg2 from '../assets/images/demo/album02.svg';
import userImg3 from '../assets/images/demo/album04.svg';


const AdvancedCommentComponent = () => {
  const [data] = useState([
    {
      userId: '01a',
      comId: '012',
      fullName: 'Riya Negi',
      avatarUrl: userImg1,
      // userProfile: '/',
      text: 'Hey, Loved your blog! ',
      timestamp: "2024-09-28T10:34:56Z",
      replies: [
        {
          userId: '02b',
          comId: '017',
          fullName: 'Lily',
          // userProfile: '/',
          text: 'I have a doubt about the 4th point🤔',
          timestamp: "2024-09-28T10:34:56Z",
          avatarUrl: userImg2,
          replies: [],
        }
      ],
    }
  ]);

  return (
    <div>
      <CommentSection
        currentUser={{
          currentUserId: '01a',
          currentUserImg: userImg3,
          // currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
          currentUserFullName: 'Riya Negi',
        }}
        advancedInput={true}
        commentData={data}
        placeholder="Write a comment..."
      />
    </div>
  );
};

export default AdvancedCommentComponent;
