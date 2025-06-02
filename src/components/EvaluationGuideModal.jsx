import ModalWrap from './ModalWrap';
import { RadarChart } from './unit/Chart';

import './EvaluationGuideModal.scss';
import { useTranslation } from 'react-i18next';
import React from 'react';

const guideData = [
  {
    title: 'Emotion',
    content:
      'Evaluates how genuinely the song conveys emotion, focusing on natural and heartfelt expression.',
  },
  {
    title: 'Creativity',
    content:
      'Assesses the originality of sounds, lyrics, or structure that make the song stand out.',
  },
  {
    title: 'Structure',
    content: 'Checks whether the song flows logically and transitions smoothly between sections.',
  },
  {
    title: 'Sound',
    content: 'Evaluations the balance, clarity, and technical polish of the overall sound and mix.',
  },
  {
    title: 'Popularity',
    content: 'Looks at how relatable the song is and whether it has lasting or mainstream appeal.',
  },
];

const EvaluationGuideModal = ({ setEvaluationGuideModal }) => {
  const { t } = useTranslation('modal');
  const radarData = [
    {
      item: '80 ' + t('Emotion'),
      value: 80,
    },
    {
      item: '60 ' + t('Creativity'),
      value: 60,
    },
    {
      item: '76 ' + t('Structure'),
      value: 76,
    },
    {
      item: '69 ' + t('Sound'),
      value: 69,
    },
    {
      item: '92 ' + t('Popularity'),
      value: 92,
    },
  ];

  const onClose = () => {
    setEvaluationGuideModal(false);
  };

  return (
    <ModalWrap title={t('Evaluation Graph')} onClose={onClose}>
      <div className="evaluation-guide-modal">
        <div className="evaluation-guide-modal__chart-parent">
          <RadarChart data={radarData} />
        </div>
        <p className="evaluation-guide-modal__text mb16">
          {t(
            'These five items are scored individually, but the weighted score calculation varies according to the emphasis each Evaluationer places on them.'
          )}
        </p>
        {guideData?.map((guide, index) => {
          return (
            <React.Fragment key={index}>
              <GuideItem t={t} index={index + 1} title={guide?.title} content={guide?.content} />
            </React.Fragment>
          );
        })}
      </div>
    </ModalWrap>
  );
};

export default EvaluationGuideModal;

const GuideItem = ({ t, index, title, content }) => {
  return (
    <>
      <p className="evaluation-guide-modal__text mb8">
        {index}. {t(title)}
      </p>
      <div className="evaluation-guide-modal__item--content mb8">
        <span className="evaluation-guide-modal__text">-</span>
        <p className="evaluation-guide-modal__text">{t(content)}</p>
      </div>
    </>
  );
};
