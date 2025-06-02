import { useTranslation } from 'react-i18next';
import ModalWrap from './ModalWrap';

import './EvaluationConfirmModal.scss';
import { useEffect, useState } from 'react';

const loadingMessage = [
  'Focusing on the music',
  'Analyzing the flavor of the drums',
  'Checking for electrifying high notes',
  'Dancing to the music',
  'Checking if the vocalist swallowed a CD',
  'Going crazy over the music',
];

const dot = 3; // 로딩 메시지 . 갯수 정의

const EvaluationConfirmModal = ({ setEvaluationConfirmModal, handler, isLoading }) => {
  const { t } = useTranslation('modal');
  const [selectMessageIdx] = useState(Math.floor(Math.random() * loadingMessage.length));
  const [dotCnt, setDotCnt] = useState(0);

  const handleClose = () => {
    if (isLoading) return;
    setEvaluationConfirmModal(false);
  };

  useEffect(() => {
    let interval;
    let cnt = 0;
    let type = 'increase';

    if (!isLoading) {
      // 로딩중이 아닐 경우 인터벌 클리어
      clearInterval(interval);
      return;
    }

    interval = setInterval(() => {
      if (cnt === 0) {
        type = 'increase';
      } else if (cnt === dot) {
        type = 'decrease';
      }

      if (type === 'increase') {
        setDotCnt(++cnt);
      } else if (type === 'decrease') {
        setDotCnt(--cnt);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  return (
    <ModalWrap title={t('Start the Evaluation')} closeIcon={false} onClose={handleClose}>
      <div className="evaluation-confirm-modal">
        <p className="evaluation-confirm-modal__message">
          {t('Would you like to proceed with the evaluation using the selected information?')}
        </p>
        <div className="evaluation-confirm-modal__button-wrap">
          {!isLoading ? (
            <>
              <button
                className="evaluation-confirm-modal__button responsive cancel"
                onClick={handleClose}
              >
                {t('Cancel')}
              </button>
              <button
                className="evaluation-confirm-modal__button responsive start"
                onClick={handler}
              >
                {t('Start')}
              </button>
            </>
          ) : (
            <button className="evaluation-confirm-modal__button loading">
              {t(loadingMessage[selectMessageIdx])}
              {Array.from({ length: dotCnt }).map((item, index) => (
                <span key={index}>.</span>
              ))}
            </button>
          )}
        </div>
      </div>
    </ModalWrap>
  );
};

export default EvaluationConfirmModal;
