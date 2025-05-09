// components/AlarmModal.js
import './AlarmModal.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import closeIcon from '../assets/images/close.svg';
import { AuthContext } from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';

const AlarmModal = () => {
  const albumIdStorageKey = 'generatedAlbumId';
  const albumTimerStorageKeyBase = 'generatedAlbumTimerStart';
  const MAX_GENERATION_TIME = 600; // 10분(600초) 최대 생성 시간

  const getStoredAlbumData = () => {
    try {
      const item = localStorage.getItem(albumIdStorageKey);
      if (!item) return null;
      const data = JSON.parse(item);
      if (data.expires < Date.now()) {
        localStorage.removeItem(albumIdStorageKey);
        return null;
      }
      return { id: data.id, title: data.title };
    } catch {
      localStorage.removeItem(albumIdStorageKey);
      return null;
    }
  };

  const item = localStorage.getItem(albumIdStorageKey);
  // console.log('item', item);
  const { walletAddress } = useContext(AuthContext);
  const { lastMessage, isConnected } = useContext(WebSocketContext);
  const location = useLocation();

  const [albumPk, setAlbumPk] = useState(null);
  const [albumWalletAddress, setAlbumWalletAddress] = useState(null);
  const [storedAlbumData, setStoredAlbumData] = useState(getStoredAlbumData());
  const [isClosed, setIsClosed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const hasTimerStartedRef = useRef(false);

  // 앨범 ID를 포함한 타이머 키 생성 - 각 사용자의 타이머가 분리되도록 함
  const getTimerKey = () => {
    if (storedAlbumData?.id) {
      return `${albumTimerStorageKeyBase}_${storedAlbumData.id}`;
    }
    return albumTimerStorageKeyBase;
  };

  // console.log('albumPk', albumPk);

  const shouldRenderModal =
    storedAlbumData || (albumPk && walletAddress?.address === albumWalletAddress);

  // console.log('storedAlbumData', storedAlbumData);

  const formatTime = sec => {
    try {
      if (sec === undefined || sec === null || isNaN(sec)) {
        return '00:00';
      }
      return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(
        Math.floor(sec % 60)
      ).padStart(2, '0')}`;
    } catch (err) {
      console.error('시간 포맷팅 오류:', err);
      return '00:00';
    }
  };

  // 타이머가 10분을 초과했을 때 자동 완료 처리
  const handleAutoComplete = () => {
    if (storedAlbumData && !albumPk && !isError) {
      setAlbumPk(storedAlbumData.id);
      setAlbumWalletAddress(walletAddress?.address);
      localStorage.removeItem(albumIdStorageKey);

      // 앨범 ID별 타이머 키 제거
      if (storedAlbumData?.id) {
        localStorage.removeItem(`${albumTimerStorageKeyBase}_${storedAlbumData.id}`);
      } else {
        localStorage.removeItem(albumTimerStorageKeyBase);
      }
      setStoredAlbumData(null);
    }
  };

  // 타이머 초기화 함수 - 여러 곳에서 재사용
  const initializeTimer = () => {
    if (!storedAlbumData) return;

    const timerKey = getTimerKey();
    const storedStart = localStorage.getItem(timerKey);
    if (storedStart) {
      try {
        const startTime = parseInt(storedStart);
        if (!isNaN(startTime)) {
          setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
        } else {
          // 저장된 값이 유효하지 않은 경우
          const newStartTime = Date.now();
          localStorage.setItem(timerKey, newStartTime.toString());
          setElapsedSeconds(0);
        }
      } catch (err) {
        console.error('타이머 초기화 오류:', err);
        const newStartTime = Date.now();
        localStorage.setItem(timerKey, newStartTime.toString());
        setElapsedSeconds(0);
      }
    } else {
      // 저장된 값이 없는 경우
      const newStartTime = Date.now();
      localStorage.setItem(timerKey, newStartTime.toString());
      setElapsedSeconds(0);
    }
    hasTimerStartedRef.current = true;
  };

  // 컴포넌트 마운트 시 한 번만 실행되는 초기화 로직
  useEffect(() => {
    if (storedAlbumData && !isError && !albumPk && !hasTimerStartedRef.current) {
      initializeTimer();
    }
  }, []); // 빈 의존성 배열로 최초 마운트 시에만 실행

  // storedAlbumData 변경 시 타이머 초기화 (새 곡 시작 시)
  useEffect(() => {
    if (storedAlbumData && !isError && !albumPk && !hasTimerStartedRef.current) {
      initializeTimer();
    }
  }, [storedAlbumData, isError, albumPk]);

  // 타이머 업데이트 로직
  useEffect(() => {
    let timer;
    if (storedAlbumData && !albumPk && !isError) {
      timer = setInterval(() => {
        const timerKey = getTimerKey();
        const storedStart = localStorage.getItem(timerKey);
        if (!storedStart) {
          initializeTimer();
        } else {
          try {
            const startTime = parseInt(storedStart);
            if (!isNaN(startTime)) {
              const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
              setElapsedSeconds(diffSeconds);

              // 10분(600초)이 지나면 자동으로 완료 처리
              if (diffSeconds >= MAX_GENERATION_TIME) {
                handleAutoComplete();
              }
            } else {
              initializeTimer();
            }
          } catch (err) {
            console.error('타이머 계산 오류:', err);
            initializeTimer();
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [storedAlbumData, albumPk, isError]);

  useEffect(() => {
    if (albumPk || isError) {
      hasTimerStartedRef.current = false;
      // 특정 앨범의 타이머만 제거
      if (storedAlbumData?.id) {
        localStorage.removeItem(getTimerKey());
      } else {
        localStorage.removeItem(albumTimerStorageKeyBase);
      }
    }
  }, [albumPk, isError]);

  const prevStoredAlbumData = useRef(null);
  const isInitialMount = useRef(true);
  // console.log('prevStoredAlbumData', prevStoredAlbumData.current);

  useEffect(() => {
    // 첫 마운트 시에는 실행하지 않음
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevStoredAlbumData.current = storedAlbumData;
      return;
    }

    // storedAlbumData가 "새로" 생긴 경우에만 초기화 (null에서 새 값으로 변경된 경우)
    const isNewStart =
      storedAlbumData &&
      (!prevStoredAlbumData.current ||
        (prevStoredAlbumData.current && storedAlbumData.id !== prevStoredAlbumData.current.id));

    // null → 값 생성 경우만 새 곡 생성으로 간주
    const isActuallyNew = !prevStoredAlbumData.current && storedAlbumData;

    if (isNewStart && isActuallyNew) {
      console.log('새로운 곡 생성 시작됨. 상태 초기화!');
      setAlbumPk(null);
      setAlbumWalletAddress(null);
      setIsError(false);
      setErrorMessage('');
      setElapsedSeconds(0);
      // 새 타이머 시작 - 앨범 ID를 포함한 키 사용
      const timerKey = `${albumTimerStorageKeyBase}_${storedAlbumData.id}`;
      localStorage.setItem(timerKey, Date.now().toString());
    }

    // 이전 값 업데이트
    prevStoredAlbumData.current = storedAlbumData;
  }, [storedAlbumData]);

  // 페이지 이동 감지 시 데이터 가져오기
  useEffect(() => {
    // 페이지 이동 후 데이터를 다시 가져올 때 조용히 처리
    const quietlyFetchData = () => {
      const data = getStoredAlbumData();
      if (data) {
        setStoredAlbumData(data);
        // 이미 storedAlbumData가 있었다면 prevStoredAlbumData도 초기화해서 "새로운 곡" 메시지 방지
        prevStoredAlbumData.current = data;
      }
    };

    quietlyFetchData();
  }, [location]);

  // 웹소켓 메시지 처리
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = lastMessage;

      // — 필터링 시작 —
      // 내 앨범 ID와 일치하거나 내 지갑 주소와 일치하는 경우만 처리
      const isMyAlbum = storedAlbumData?.id && data.pk === storedAlbumData.id;
      const isMyWallet = walletAddress?.address && data.wallet_address === walletAddress.address;

      if (!isMyAlbum && !isMyWallet) {
        // 내 데이터가 아니면 무시
        return;
      }
      // — 필터링 끝 —

      if (data.status === 'complt' || data.status === 'fail') {
        setAlbumPk(data.pk);
        setAlbumWalletAddress(data.wallet_address);
        localStorage.removeItem(albumIdStorageKey);
        // 앨범 ID별 타이머 키 제거
        if (storedAlbumData?.id) {
          localStorage.removeItem(`${albumTimerStorageKeyBase}_${storedAlbumData.id}`);
        } else {
          localStorage.removeItem(albumTimerStorageKeyBase);
        }
        setStoredAlbumData(null);

        if (data.status === 'fail') {
          setIsError(true);
          setErrorMessage(data.message?.message || 'Unknown error');
        }
      } else {
        // 상태 업데이트가 있을 때 타이머는 유지
        // console.log('현재 상태:', data.status);
      }
    } catch (err) {
      console.error('메시지 처리 에러:', err);
    }
  }, [lastMessage, storedAlbumData, walletAddress]);

  const handleClose = () => setIsClosed(true);
  const handleOverlayClick = () => setIsClosed(false);
  const errorClose = () => {
    setAlbumPk(null);
    setStoredAlbumData(null);
    setIsError(false);
    setErrorMessage('');
    setElapsedSeconds(0);
    localStorage.removeItem(albumIdStorageKey);
    // 앨범 ID별 타이머 키가 있으면 제거
    if (storedAlbumData?.id) {
      localStorage.removeItem(`${albumTimerStorageKeyBase}_${storedAlbumData.id}`);
    } else {
      localStorage.removeItem(albumTimerStorageKeyBase);
    }
  };

  if (!shouldRenderModal) return null;

  return (
    <>
      <div className={`alarm__modal ${isClosed ? 'active' : ''}`}>
        <div className="alarm__modal__item">
          <button className="alarm__modal__item__closed" onClick={handleClose}>
            <img src={closeIcon} alt="닫기" />
          </button>
          <p className="alarm__modal__item__title">
            {storedAlbumData?.title || 'AI Song Generation'}
          </p>
          <p
            className={`alarm__modal__item__txt ${isError ? 'alarm__modal__item__txt--error' : ''}`}
          >
            {isError ? (
              <>
                <span className="err-txt">Music generation failed.</span> <br />
                <br />
                <span className="err-txt">{errorMessage}</span>
              </>
            ) : albumPk ? (
              'Song generation completed!'
            ) : (
              'The generation process may take up to 10 minutes.'
            )}
          </p>

          {!isError && storedAlbumData && (
            <>
              <div className="middle2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`bar bar${i + 1}`}></div>
                ))}
              </div>
              <p className="alarm__modal__item__timer">{formatTime(elapsedSeconds)}</p>
            </>
          )}

          {isError ? (
            <button className="alarm__modal__item__link" onClick={errorClose}>
              OK
            </button>
          ) : (
            albumPk &&
            !storedAlbumData && (
              <Link
                className="alarm__modal__item__link"
                to={`/song-detail/${albumPk}`}
                onClick={() => {
                  setAlbumPk(null);
                  setElapsedSeconds(0);
                }}
              >
                My Song Link
              </Link>
            )
          )}
        </div>
      </div>
      <div
        className={`alarm__modal__arr ${isClosed ? 'active' : ''}`}
        onClick={handleOverlayClick}
      ></div>
    </>
  );
};

export default AlarmModal;
