import '../styles/NodeViewer.scss';
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import plusIcon from '../assets/images/ic_round-plus.svg';
import copyIcon from '../assets/images/mage_copy.svg';
import copyCheckIcon from '../assets/images/copy_check.svg';
import deleteIcon from '../assets/images/mynaui_trash.svg';

import PreparingModal from '../components/PreparingModal';
import AddNodeWallet from '../components/AddNodeWallet';
import DeleteWallet from '../components/DeleteWallet';





function NodeViewer() {
  const { t } = useTranslation('node-viewer');
  const [addNodeWalletModal, setAddNodeWalletModal] = useState(false);
  const [deleteWalletModal, setDeleteWalletModal] = useState(false);
  const fullText =
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890";

  // 화면에는 0x440...E9dC 형태처럼 앞 6글자 + ... + 뒤 4글자만 노출
  const shortText =
    fullText.length > 10
      ? `${fullText.slice(0, 6)}...${fullText.slice(-4)}`
      : fullText;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText); // 전체 텍스트 복사
    setCopied(true);                         // 체크 아이콘으로 변경
    setTimeout(() => setCopied(false), 2000); // 2초 뒤 원복
  };

  return (
    <>
      <div className='node-viewer'>
        <button className='node-viewer__add-btn'
          onClick={() => setAddNodeWalletModal(true)}
        >
          <img src={plusIcon}/> {t('Add Node Wallet')}
        </button>
        <div className='node-viewer__list'>
          <section className='node-viewer__list__item'>
            <article className='node-viewer__list__item__title-wrap'>
              <dl className='node-viewer__list__item__title'>
                <dt>Wallet Name</dt>
                <dd>
                  {shortText}
                  <button
                    type="button"
                    className="node-viewer__list__item__title__btn"
                    onClick={handleCopy}
                  >
                    <img src={copied ? copyCheckIcon : copyIcon} alt="copy" />
                  </button>
                </dd>
              </dl>
              <button className='node-viewer__list__item__delete-btn'
                onClick={() => setDeleteWalletModal(true)}
              >
                <img src={deleteIcon}/>
              </button>
            </article>
            <article className='node-viewer__list__item__content-wrap01'>
              <div className='node-viewer__list__item__content-wrap01__item'>
                <p className='node-viewer__list__item__content-wrap01__item__title'>
                  {t('Owned Nodes')}
                </p>
                <div className='node-viewer__list__item__content-wrap01__item__content'>
                  <div className='node-viewer__list__item__content-wrap01__item__content__number'>0</div>
                  <p className='node-viewer__list__item__content-wrap01__item__content__quantity'>{t('Quantity')}</p>
                </div>
              </div>
              <div className='node-viewer__list__item__content-wrap01__item'>
                <p className='node-viewer__list__item__content-wrap01__item__title'>
                  {t('Activated Nodes')}
                </p>
                <div className='node-viewer__list__item__content-wrap01__item__content'>
                  <div className='node-viewer__list__item__content-wrap01__item__content__number'>0</div>
                  <p className='node-viewer__list__item__content-wrap01__item__content__quantity'>{t('Quantity')}</p>
                </div>
              </div>
            </article>
            <article className='node-viewer__list__item__content-wrap02'>
              <div className='node-viewer__list__item__content-wrap02__item'>
                <p className='node-viewer__list__item__content-wrap02__item__title'>
                  {t('My Balance')}
                </p>
                <div className='node-viewer__list__item__content-wrap02__item__content'>
                  <div className='node-viewer__list__item__content-wrap02__item__content__number'>0.0000</div>
                  <p className='node-viewer__list__item__content-wrap02__item__content__mob'>{t('MOB')}</p>
                </div>
              </div>
              <div className='node-viewer__list__item__content-wrap02__item'>
                <p className='node-viewer__list__item__content-wrap02__item__title'>
                  {t('Earned this session')}
                </p>
                <div className='node-viewer__list__item__content-wrap02__item__content'>
                  <div className='node-viewer__list__item__content-wrap02__item__content__number'>0.0000</div>
                  <p className='node-viewer__list__item__content-wrap02__item__content__mob'>{t('MOB')}</p>
                </div>
              </div>
              <div className='node-viewer__list__item__content-wrap02__item'>
                <p className='node-viewer__list__item__content-wrap02__item__title'>
                  {t('Unclaimed')}
                </p>
                <div className='node-viewer__list__item__content-wrap02__item__content'>
                  <div className='node-viewer__list__item__content-wrap02__item__content__number'>0.0000</div>
                  <p className='node-viewer__list__item__content-wrap02__item__content__mob'>{t('MOB')}</p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
      {addNodeWalletModal && <AddNodeWallet setAddNodeWalletModal={setAddNodeWalletModal}/>}
      {deleteWalletModal && <DeleteWallet setDeleteWalletModal={setDeleteWalletModal}/>}
    </>
  );
}

export default NodeViewer;
