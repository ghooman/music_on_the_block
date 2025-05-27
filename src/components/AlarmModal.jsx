// components/AlarmModal.js
import './AlarmModal.scss';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import closeIcon from '../assets/images/close.svg';
import { AuthContext } from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { checkCreatingSong } from '../api/cheekCreatingSong';

const AlarmModal = () => {
  const { t } = useTranslation('modal');

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
  const { lastAlbumMessage, isAlbumConnected } = useContext(WebSocketContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [albumPk, setAlbumPk] = useState(null);
  const [albumWalletAddress, setAlbumWalletAddress] = useState(null);
  const [storedAlbumData, setStoredAlbumData] = useState(getStoredAlbumData());
  const [isClosed, setIsClosed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAutoCompleted, setIsAutoCompleted] = useState(false);

  // 메시지 중복 처리 방지를 위한 참조
  const processedMessageRef = useRef(null);
  const prevStoredAlbumData = useRef(null);
  const isInitialMount = useRef(true);

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
      setIsAutoCompleted(true);
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
          const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
          setElapsedSeconds(currentElapsed);
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

  // 컴포넌트 마운트 시 타이머 초기화
  useEffect(() => {
    // console.log('컴포넌트 마운트 시 타이머 초기화 확인');
    if (storedAlbumData && !isError && !albumPk) {
      initializeTimer();
    }
  }, []); // 빈 의존성 배열로 최초 마운트 시에만 실행

  // storedAlbumData 변경 시 타이머 초기화 (새 곡 시작 시)
  useEffect(() => {
    // console.log('storedAlbumData 변경됨:', storedAlbumData);

    if (storedAlbumData && !isError && !albumPk) {
      // console.log('storedAlbumData 변경으로 타이머 초기화 조건 충족됨');
      initializeTimer(); // 항상 타이머 초기화
    }
  }, [storedAlbumData, isError, albumPk]);

  // 타이머 업데이트 로직 - 이 부분이 핵심입니다!
  useEffect(() => {
    let timer;
    // console.log('타이머 업데이트 로직 검사 - 조건:', {
    //   storedAlbumData: !!storedAlbumData,
    //   albumPk: !!albumPk,
    //   isError: !!isError,
    //   hasTimerStarted: hasTimerStartedRef.current,
    // });

    if (storedAlbumData && !albumPk && !isError) {
      // console.log('타이머 업데이트 인터벌 시작');
      timer = setInterval(() => {
        const timerKey = getTimerKey();
        const storedStart = localStorage.getItem(timerKey);

        if (!storedStart) {
          // console.log('타이머 값 없음 - 초기화');
          initializeTimer();
        } else {
          try {
            const startTime = parseInt(storedStart);
            if (!isNaN(startTime)) {
              const diffSeconds = Math.floor((Date.now() - startTime) / 1000);
              // console.log('타이머 업데이트:', diffSeconds);
              setElapsedSeconds(diffSeconds);

              // 10분(600초)이 지나면 자동으로 완료 처리 - 주석처리
              // if (diffSeconds >= MAX_GENERATION_TIME) {
              //   // console.log('최대 생성 시간 초과 - 자동 완료');
              //   handleAutoComplete();
              // }
            } else {
              // console.log('타이머 값이 유효하지 않음 - 초기화');
              initializeTimer();
            }
          } catch (err) {
            // console.error('타이머 계산 오류:', err);
            initializeTimer();
          }
        }
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [storedAlbumData, albumPk, isError]);

  // 페이지 이동 시 데이터 동기화
  useEffect(() => {
    // 페이지 이동 후 데이터를 다시 가져올 때 조용히 처리
    const quietlyFetchData = () => {
      const data = getStoredAlbumData();
      // console.log('페이지 이동 감지:', location.pathname);
      // console.log('페이지 이동 후 가져온 데이터:', data);

      if (data) {
        // console.log('로컬 스토리지에서 데이터 발견');
        setStoredAlbumData(data);
        // 이미 storedAlbumData가 있었다면 prevStoredAlbumData도 초기화해서 "새로운 곡" 메시지 방지
        prevStoredAlbumData.current = data;

        // 새 곡이 시작된 경우 앨범 PK 초기화
        setAlbumPk(null);
        setAlbumWalletAddress(null);
        setIsError(false);
        setErrorMessage('');

        // 타이머 상태는 localStorage 기반으로 확인
        const timerKey = `${albumTimerStorageKeyBase}_${data.id}`;
        const hasTimer = localStorage.getItem(timerKey);

        if (hasTimer) {
          // console.log('기존 타이머 발견:', timerKey);
          // 타이머 상태 활성화
          hasTimerStartedRef.current = true;
        } else {
          // console.log('타이머를 찾을 수 없음, 새로 시작합니다');
          // 아직 타이머가 없으면 초기화 예약 (다음 렌더링에서 initializeTimer가 호출됨)
          hasTimerStartedRef.current = false;
        }
      } else {
        // console.log('로컬 스토리지에 데이터 없음');
        // 로컬 스토리지에 데이터가 없으면 앨범 관련 상태는 유지 (완료된 노래)
        // 단 storedAlbumData 상태와 타이머 관련 상태만 초기화
        setStoredAlbumData(null);
        prevStoredAlbumData.current = null;
        // 타이머 상태는 그대로 유지
      }
    };

    quietlyFetchData();
  }, [location]);

  // 새 노래 생성 시 초기화 로직
  useEffect(() => {
    // 첫 마운트 시에는 실행하지 않음
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevStoredAlbumData.current = storedAlbumData;
      return;
    }

    // null -> 새 앨범 데이터가 생긴 경우
    if (prevStoredAlbumData.current === null && storedAlbumData) {
      // 새 앨범 데이터가 생기면 완전히 초기화
      setAlbumPk(null);
      setAlbumWalletAddress(null);
      setIsError(false);
      setErrorMessage('');
      setElapsedSeconds(0);
      setIsAutoCompleted(false);

      // 새 타이머 시작 - 앨범 ID를 포함한 키 사용
      const timerKey = `${albumTimerStorageKeyBase}_${storedAlbumData.id}`;
      localStorage.setItem(timerKey, Date.now().toString());
      hasTimerStartedRef.current = true;
    }

    // 이전 값 업데이트
    prevStoredAlbumData.current = storedAlbumData;
  }, [storedAlbumData, albumPk]);

  // 타이머 키가 변경될 때만 타이머를 재설정하는 효과
  useEffect(() => {
    // 타이머가 이미 시작되었고, storedAlbumData가 변경된 경우에만 타이머 키 업데이트
    if (hasTimerStartedRef.current && storedAlbumData) {
      const newTimerKey = getTimerKey();

      // 이전 타이머 키가 있다면 제거
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith(albumTimerStorageKeyBase) && key !== newTimerKey) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [storedAlbumData]);

  // 웹소켓 메시지 처리
  useEffect(() => {
    if (!lastAlbumMessage) return;

    // 동일한 메시지 재처리 방지
    if (
      processedMessageRef.current &&
      processedMessageRef.current.pk === lastAlbumMessage.pk &&
      processedMessageRef.current.status === lastAlbumMessage.status
    ) {
      return;
    }

    try {
      const data = lastAlbumMessage;

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
        // 이 메시지를 처리했다고 표시
        processedMessageRef.current = { ...data };

        // 완료된 노래의 ID가 현재 생성 중인 노래와 같은지 확인
        if (storedAlbumData && storedAlbumData.id !== data.pk) {
          return;
        }

        setAlbumPk(data.pk);
        setAlbumWalletAddress(data.wallet_address);
        // 서버에서 받은 완료 메시지는 타임아웃 자동 완료가 아님
        setIsAutoCompleted(false);

        // 로컬 스토리지와 타이머 키 제거 - 초기화
        localStorage.removeItem(albumIdStorageKey);
        // 앨범 ID별 타이머 키 제거
        if (storedAlbumData?.id) {
          localStorage.removeItem(`${albumTimerStorageKeyBase}_${storedAlbumData.id}`);
        } else {
          localStorage.removeItem(albumTimerStorageKeyBase);
        }

        // 마지막에 storedAlbumData를 null로 설정 (순서 중요)
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
  }, [lastAlbumMessage, storedAlbumData, walletAddress]);

  // WebSocketContext가 재연결될 때 processedMessageRef 초기화
  useEffect(() => {
    if (isAlbumConnected) {
      processedMessageRef.current = null;
    }
  }, [isAlbumConnected]);
  // 생성 상태 확인 - 5분마다 자동 호출
  useEffect(() => {
    console.log('storedAlbumData', storedAlbumData);

    const checkSongStatus = async () => {
      try {
        const response = await checkCreatingSong(storedAlbumData?.id);
        console.log('checkSongStatus', response);

        if (response?.status === 'success') {
          // 성공: My Song Link 화면 표시
          setAlbumPk(storedAlbumData.id);
          setAlbumWalletAddress(walletAddress?.address);
          setIsAutoCompleted(false);

          // 로컬 스토리지 정리
          localStorage.removeItem(albumIdStorageKey);
          if (storedAlbumData?.id) {
            localStorage.removeItem(`${albumTimerStorageKeyBase}_${storedAlbumData.id}`);
          } else {
            localStorage.removeItem(albumTimerStorageKeyBase);
          }
          setStoredAlbumData(null);
        } else if (response?.status === 'fail') {
          // 실패: 에러 메시지 표시
          setIsError(true);
          setErrorMessage(response?.message || 'Song generation failed');
        } else if (response?.status === 'creating') {
          // 생성중: 현재 화면 유지 (아무것도 하지 않음)
          console.log('Song is still being created...');
        }
      } catch (error) {
        console.error('checkSongStatus error:', error);
      }
    };

    if (storedAlbumData?.id && !albumPk && !isError) {
      // 즉시 한 번 호출
      checkSongStatus();

      // 5분(300초)마다 반복 호출
      const interval = setInterval(() => {
        checkSongStatus();
      }, 300000); // 5분 = 300,000ms

      return () => clearInterval(interval);
    }
  }, [storedAlbumData, albumPk, isError]);
  const handleClose = () => setIsClosed(true);
  const handleOverlayClick = () => setIsClosed(false);
  const errorClose = () => {
    setAlbumPk(null);
    setStoredAlbumData(null);
    setIsError(false);
    setErrorMessage('');
    setElapsedSeconds(0);
    setIsAutoCompleted(false);
    localStorage.removeItem(albumIdStorageKey);
    // 앨범 ID별 타이머 키가 있으면 제거
    if (storedAlbumData?.id) {
      localStorage.removeItem(`${albumTimerStorageKeyBase}_${storedAlbumData.id}`);
    } else {
      localStorage.removeItem(albumTimerStorageKeyBase);
    }
  };

  // 메인페이지로 이동하는 함수
  const navigateToMain = () => {
    setAlbumPk(null);
    setElapsedSeconds(0);
    navigate('/');
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
                <span className="err-txt">{t('Music generation failed.')}</span> <br />
                <br />
                <span className="err-txt">{errorMessage}</span>
              </>
            ) : albumPk ? (
              t('Song generation completed!')
            ) : (
              t('The generation process may take up to 10 minutes.')
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
              {t('OK')}
            </button>
          ) : (
            albumPk &&
            !storedAlbumData &&
            (isAutoCompleted ? (
              <button className="alarm__modal__item__link" onClick={navigateToMain}>
                {t('My Song Link')}
              </button>
            ) : (
              <Link
                className="alarm__modal__item__link"
                to={`/song-detail/${albumPk}`}
                onClick={() => {
                  setAlbumPk(null);
                  setElapsedSeconds(0);
                }}
              >
                {t('My Song Link')}
              </Link>
            ))
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
