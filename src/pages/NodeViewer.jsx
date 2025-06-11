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

import { getNodeViewer } from '../api/nodeViewerApi';

function NodeViewer() {
  const { t } = useTranslation('node-viewer');
  const { token } = useContext(AuthContext);
  const [addNodeWalletModal, setAddNodeWalletModal] = useState(false);
  const [deleteWalletModal, setDeleteWalletModal] = useState(false);
  const [nodeViewerList, setNodeViewerList] = useState([]);
  const [deleteWalletId, setDeleteWalletId] = useState(null);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchNodeViewer = async () => {
    try {
      const res = await getNodeViewer(token);
      setNodeViewerList(res.data);
      console.log('fetched data', res.data);
    } catch (error) {
      console.error('NodeViewer 로딩 실패:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNodeViewer();
    }
  }, [token]);

  const handleAddWalletSuccess = () => {
    fetchNodeViewer();
  };

  const handleDeleteWalletSuccess = () => {
    fetchNodeViewer();
  };

  const [copiedWallets, setCopiedWallets] = useState({});

  const handleCopy = (walletAddress, walletId) => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedWallets(prev => ({ ...prev, [walletId]: true }));
    setTimeout(() => {
      setCopiedWallets(prev => ({ ...prev, [walletId]: false }));
    }, 2000);
  };

  return (
    <>
      <div className="node-viewer">
        <button className="node-viewer__add-btn" onClick={() => setAddNodeWalletModal(true)}>
          <img src={plusIcon} alt="plus" /> {t('Add Node Wallet')}
        </button>
        <div className="node-viewer__list">
          {nodeViewerList.map(item => (
            <section className="node-viewer__list__item">
              <article className="node-viewer__list__item__title-wrap">
                <dl className="node-viewer__list__item__title">
                  <dt>{item.wallet_name}</dt>
                  <dd>
                    {item.wallet_address.length > 10
                      ? `${item.wallet_address.slice(0, 6)}...${item.wallet_address.slice(-4)}`
                      : item.wallet_address}
                    <button
                      type="button"
                      className="node-viewer__list__item__title__btn"
                      onClick={() => handleCopy(item.wallet_address, item.id)}
                    >
                      <img src={copiedWallets[item.id] ? copyCheckIcon : copyIcon} alt="copy" />
                    </button>
                  </dd>
                </dl>
                <button
                  className="node-viewer__list__item__delete-btn"
                  onClick={() => {
                    setDeleteWalletModal(true);
                    setDeleteWalletId(item.id);
                  }}
                >
                  <img src={deleteIcon} alt="delete" />
                </button>
              </article>
              <article className="node-viewer__list__item__content-wrap01">
                <div className="node-viewer__list__item__content-wrap01__item">
                  <p className="node-viewer__list__item__content-wrap01__item__title">
                    {t('Owned Nodes')}
                  </p>
                  <div className="node-viewer__list__item__content-wrap01__item__content">
                    <div className="node-viewer__list__item__content-wrap01__item__content__number">
                      0
                    </div>
                    <p className="node-viewer__list__item__content-wrap01__item__content__quantity">
                      {t('Quantity')}
                    </p>
                  </div>
                </div>
                <div className="node-viewer__list__item__content-wrap01__item">
                  <p className="node-viewer__list__item__content-wrap01__item__title">
                    {t('Activated Nodes')}
                  </p>
                  <div className="node-viewer__list__item__content-wrap01__item__content">
                    <div className="node-viewer__list__item__content-wrap01__item__content__number">
                      0
                    </div>
                    <p className="node-viewer__list__item__content-wrap01__item__content__quantity">
                      {t('Quantity')}
                    </p>
                  </div>
                </div>
              </article>
              <article className="node-viewer__list__item__content-wrap02">
                <div className="node-viewer__list__item__content-wrap02__item">
                  <p className="node-viewer__list__item__content-wrap02__item__title">
                    {t('My Balance')}
                  </p>
                  <div className="node-viewer__list__item__content-wrap02__item__content">
                    <div className="node-viewer__list__item__content-wrap02__item__content__number">
                      0.0000
                    </div>
                    <p className="node-viewer__list__item__content-wrap02__item__content__mob">
                      {t('MOB')}
                    </p>
                  </div>
                </div>
                <div className="node-viewer__list__item__content-wrap02__item">
                  <p className="node-viewer__list__item__content-wrap02__item__title">
                    {t('Earned this session')}
                  </p>
                  <div className="node-viewer__list__item__content-wrap02__item__content">
                    <div className="node-viewer__list__item__content-wrap02__item__content__number">
                      0.0000
                    </div>
                    <p className="node-viewer__list__item__content-wrap02__item__content__mob">
                      {t('MOB')}
                    </p>
                  </div>
                </div>
                <div className="node-viewer__list__item__content-wrap02__item">
                  <p className="node-viewer__list__item__content-wrap02__item__title">
                    {t('Unclaimed')}
                  </p>
                  <div className="node-viewer__list__item__content-wrap02__item__content">
                    <div className="node-viewer__list__item__content-wrap02__item__content__number">
                      0.0000
                    </div>
                    <p className="node-viewer__list__item__content-wrap02__item__content__mob">
                      {t('MOB')}
                    </p>
                  </div>
                </div>
              </article>
            </section>
          ))}
        </div>
      </div>
      {addNodeWalletModal && (
        <AddNodeWallet
          setAddNodeWalletModal={setAddNodeWalletModal}
          token={token}
          isError={isError}
          errorMessage={errorMessage}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
          onSuccess={handleAddWalletSuccess}
        />
      )}
      {deleteWalletModal && (
        <DeleteWallet
          setDeleteWalletModal={setDeleteWalletModal}
          token={token}
          deleteWalletId={deleteWalletId}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
          onSuccess={handleDeleteWalletSuccess}
        />
      )}
    </>
  );
}

export default NodeViewer;
