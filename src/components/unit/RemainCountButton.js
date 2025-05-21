import React from 'react';
import './RemainCountButton.scss';
import { useTranslation } from 'react-i18next';
// 남은 생성횟수

export const RemainCountButton = ({ createPossibleCount }) => {
  const { t } = useTranslation('song_create');

  return (
    <div className="create__get-started--left-count-box">
      <div className="create__get-started--left-count">
        {t("Today's Left")}: {createPossibleCount} / 5
      </div>
    </div>
  );
};
