import '../styles/LicenseKey.scss';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PreparingModal from '../components/PreparingModal';
import LicenseKeyModal from '../components/LicenseKeyModal';


function LicenseKey() {
  const { t } = useTranslation('License Key');
  const [preparingModal, setPreparingModal] = useState(false)
  const [licenseKeyModal, setLicenseKeyModal] = useState(false)

  return (
    <>
      <div className='license-key'>
        <h1>Connect License Key</h1>
        <div className='license-key__content'>
          <dl className='license-key__content__item'>
            <dt>
              {t('What are the benefits of connecting the license key?')}
            </dt>
            <dd>
              {t('By connecting the license key, you can transfer the MIC earned through the MUSIC ON THE BLOCK APP to your current account and use it. Additionally, you will be able to access and use more features within the MUSIC ON THE BLOCK APP.')}
            </dd>
          </dl>
          <dl className='license-key__content__item'>
            <dt>
              {t('How to check my license key')}
            </dt>
            <dd>
              {t("Open the MUSIC ON THE BLOCK APP, and click on 'My' in the bottom menu to access and check your license key. Additionally, by using the 'Copy' button, you can easily paste it without the need to memorize it.")}
            </dd>
          </dl>
        </div>
        <dl className='license-key__input'>
          <dt>
            {t('License Key')}
          </dt>
          <dd>
            <input placeholder='Enter the License Key' />
          </dd>
        </dl>
        <div className='license-key__btns'>
          <button 
            className='license-key__btns__connect'
            // onClick={()=>setLicenseKeyModal(true)}
            onClick={()=>setPreparingModal(true)}
          >
            {t('Connect')}
          </button>
          <button 
            className='license-key__btns__app'
            onClick={()=>setPreparingModal(true)}
          >
            {t('Explore the MUSIC ON THE BLOCK APP')}
          </button>
        </div>
      </div>
      {preparingModal && <PreparingModal setPreparingModal={setPreparingModal} />}
      {licenseKeyModal && <LicenseKeyModal setLicenseKeyModal={setLicenseKeyModal}/>}

    </>
  );
}

export default LicenseKey;
