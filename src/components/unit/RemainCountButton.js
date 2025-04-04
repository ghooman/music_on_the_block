import React from "react";
import "./RemainCountButton.scss";
// 남은 생성횟수

export const RemainCountButton = ({ remainingCount }) => {
  return (
    <div className="create__get-started--left-count-box">
      <div className="create__get-started--left-count">
        Today's Left: {remainingCount} / 5
      </div>
    </div>
  );
};
