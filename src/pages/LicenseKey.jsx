import '../styles/LicenseKey.scss';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PreparingModal from '../components/PreparingModal';
import LicenseKeyModal from '../components/LicenseKeyModal';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

function LicenseKey() {
  const { t } = useTranslation('my_page');
  const [preparingModal, setPreparingModal] = useState(false);
  const [licenseKeyModal, setLicenseKeyModal] = useState(false);

  const serverAPI = process.env.REACT_APP_SERVER_API;

  const { token } = useContext(AuthContext);

  // 라이센스 키
  const [myLicenceKey, setMyLicenceKey] = useState('');
  // 라이센스 키 상태
  const [licenceKey, setLicenceKey] = useState('');
  // 라이센스 키 연결 여부
  const [isConnected, setIsConnected] = useState(false);

  // 연결된 라이센스 키 보여주는 함수
  useEffect(() => {
    const fetchUserLicenseKey = async () => {
      try {
        const res = await axios.get(`${serverAPI}/api/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const key = res.data.licence_key;
        if (key) {
          setMyLicenceKey(key);
          setLicenceKey(key); // 입력창에도 표시
          setIsConnected(true); // 연결 상태 true
        }
      } catch (error) {
        console.error('아직 라이센스 키 연결 안되었는디용', error);
      }
    };

    fetchUserLicenseKey();
  }, [serverAPI, token]);

  // 라이센스 키 체크하는 API 함수
  const handleCheckLicenseKey = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/user/licence/key/check`, {
        params: {
          licence_key: licenceKey,
        },
      });
      console.log('라이센스 키 체크 완료!', res.data);
      console.log(res.data);
      if (res.data === true) {
        // 유효하면 연결 요청
        await handleConnectLicenseKey();
        setLicenseKeyModal(true); // 연결 성공 시 모달 열기
      } else {
        console.error('❌ 유효하지 않은 라이센스 키입니다.');
      }
    } catch (error) {
      console.error('라이센스 키 체크 오류', error);
    }
  };

  // 라이센스 키 연결 API 함수
  const handleConnectLicenseKey = async () => {
    try {
      const res = await axios.post(`${serverAPI}/api/user/licence/key/connect`, null, {
        params: {
          licence_key: licenceKey,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('라이센스 키 연결 완료!', res.data);
      setIsConnected(true); // ✅ 연결 성공 처리
    } catch (error) {
      console.error('라이센스 키 연결 오류', error);
    }
  };

  return (
    <>
      <div className="license-key">
        <h1>{t('Connect License Key')}</h1>
        <div className="license-key__content">
          <dl className="license-key__content__item">
            <dt>{t('What are the benefits of connecting the license key?')}</dt>
            <dd>
              {t(
                'By connecting the license key, you can transfer the MIC earned through the MUSIC ON THE BLOCK APP to your current account and use it. Additionally, you will be able to access and use more features within the MUSIC ON THE BLOCK APP.'
              )}
            </dd>
          </dl>
          <dl className="license-key__content__item">
            <dt>{t('How to check my license key')}</dt>
            <dd>
              {t(
                "Open the MUSIC ON THE BLOCK APP, and click on 'My' in the bottom menu to access and check your license key. Additionally, by using the 'Copy' button, you can easily paste it without the need to memorize it."
              )}
            </dd>
          </dl>
        </div>
        <dl className="license-key__input">
          <dt>{t('License Key')}</dt>
          <dd>
            <input
              placeholder={t('Enter the License Key')}
              value={licenceKey}
              onChange={e => setLicenceKey(e.target.value)}
              readOnly={isConnected} // ✅ 연결된 경우 입력 불가
            />
          </dd>
        </dl>
        <div className="license-key__btns">
          <button
            className="license-key__btns__connect"
            onClick={handleCheckLicenseKey}
            disabled={isConnected} // ✅ 연결된 경우 비활성화
          >
            {t('Connect')}
          </button>
          <button className="license-key__btns__app" onClick={() => setPreparingModal(true)}>
            {t('Explore the MUSIC ON THE BLOCK APP')}
          </button>
        </div>
      </div>
      {preparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
      {licenseKeyModal && <LicenseKeyModal setLicenseKeyModal={setLicenseKeyModal} />}
    </>
  );
}

export default LicenseKey;
