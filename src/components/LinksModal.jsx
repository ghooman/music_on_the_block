import { Link } from 'react-router-dom';
import './LinksModal.scss';
import ModalWrap from './ModalWrap';
import { useTranslation } from 'react-i18next';

const LinksModal = ({ linkItems, setLinksModal }) => {
  const { t } = useTranslation('modal');

  const onClose = () => {
    setLinksModal(false);
  };

  const urlRegex = /^(https?|ftp):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

  return (
    <ModalWrap title={t('Links')} onClose={onClose}>
      {/* <div className="links-modal">
        {linkItems.map((item, index) => {
          return (
            <Link
              className={`links-modal__item ${!urlRegex.test(item) ? 'invalid' : ''}`}
              target="_b"
              rel="noopener noreferer"
              key={item + index}
              to={item}
            >
              {item}
            </Link>
          );
        })}
      </div> */}
      <div className="links-modal">
        {linkItems.slice(1).map((item, index) => (
          <Link
            className={`links-modal__item ${!urlRegex.test(item) ? 'invalid' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            key={`${item}-${index}`}
            to={item}
          >
            {item}
          </Link>
        ))}
      </div>

    </ModalWrap>
  );
};

export default LinksModal;
