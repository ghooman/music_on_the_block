import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/EvaluationResults.scss';

import EvaluationResultsComp from '../components/evaluation/EvaluationResultsComp';

import { AuthContext } from '../contexts/AuthContext';
import ErrorModal from '../components/modal/ErrorModal';

const serverApi = process.env.REACT_APP_SERVER_API;

const EvaluationResults = () => {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation('evaluation');
  const location = useLocation();
  const navigate = useNavigate();

  const [evaluationData, setEvaluationData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { state } = location;

  useEffect(() => {
    if (!state) {
      alert('Invalid access');
      navigate('/');
      return;
    }
    // 새로고침 시 정보 유실 알림.
    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = ''; // 대부분의 브라우저에서 경고 메시지를 자동으로 띄워줌
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    setEvaluationData(state);
    navigate(location.pathname, { replace: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <EvaluationResultsComp
        evaluationData={evaluationData}
        critic={evaluationData?.critic}
        isResult
      />
      {errorMessage && (
        <ErrorModal setShowErrorModal={setErrorMessage} button message={errorMessage} />
      )}
    </>
  );
};

export default EvaluationResults;
