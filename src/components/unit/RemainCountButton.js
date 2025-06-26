import React from 'react';
import './RemainCountButton.scss';
import { useTranslation } from 'react-i18next';
// 남은 생성횟수

export const RemainCountButton = ({ createPossibleCount }) => {
  const { t } = useTranslation('song_create');

  return (
    <div className="create__get-started--left-count-box">
      <div className="create__get-started--left-count">
        금일 생성 가능한 횟수가 <span className="sky-blue">{createPossibleCount}회 </span>남았어요
      </div>
    </div>
  );
};
