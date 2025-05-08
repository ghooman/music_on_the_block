import { Link } from 'react-router-dom';
import './LinksModal.scss';
import ModalWrap from './ModalWrap';

const LinksModal = ({ linkItems, setLinksModal }) => {
  const onClose = () => {
    setLinksModal(false);
  };

  const urlRegex = /^(https?|ftp):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

  return (
    <ModalWrap title="Links" onClose={onClose}>
      <div className="links-modal">
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
      </div>
    </ModalWrap>
  );
};

export default LinksModal;
