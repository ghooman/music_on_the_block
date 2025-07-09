import React from 'react';
import './RemainCountButton.scss';
import { useTranslation } from 'react-i18next';
// 남은 생성횟수

export const RemainCountButton = ({ createPossibleCount }) => {
  const { t } = useTranslation('song_create');

  return (
    <div className="create__get-started--left-count">
      {t('You have')} <span>{createPossibleCount}</span> {t('remaining creations today')}
    </div>
  );
};
