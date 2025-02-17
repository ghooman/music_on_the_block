import React, { useState } from 'react';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css'; // 기본 스타일
import './AdvancedCommentComponent.scss'; // 다크 테마 스타일 추가

const AdvancedCommentComponent = () => {
  const [data] = useState([
    {
      userId: '01a',
      comId: '012',
      fullName: 'Riya Negi',
      avatarUrl: 'https://ui-avatars.com/api/?name=Riya&background=random',
      userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
      text: 'Hey, Loved your blog! ',
      timestamp: "2024-09-28T10:34:56Z",
      replies: [
        {
          userId: '02b',
          comId: '017',
          fullName: 'Lily',
          userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
          text: 'I have a doubt about the 4th point🤔',
          timestamp: "2024-09-28T10:34:56Z",
          avatarUrl: 'https://ui-avatars.com/api/?name=Lily&background=random',
          replies: [],
        }
      ],
    }
  ]);

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ color: '#ffffff' }}>💬 댓글 시스템</h2>
      <CommentSection
        currentUser={{
          currentUserId: '01a',
          currentUserImg: 'https://ui-avatars.com/api/?name=Riya&background=random',
          currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
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
