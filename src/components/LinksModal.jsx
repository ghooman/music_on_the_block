import { Link } from 'react-router-dom';
import './LinksModal.scss';
import ModalWrap from './ModalWrap';

const LinksModal = ({ linkItems, setLinksModal }) => {
  const onClose = () => {
    setLinksModal(false);
  };

  return (
    <ModalWrap title="Links" onClose={onClose}>
      <div className="links-modal">
        {linkItems.map((item, index) => {
          return (
            <Link className="links-modal__item" key={item + index} to={item}>
              {item}
            </Link>
          );
        })}
      </div>
    </ModalWrap>
  );
};

export default LinksModal;
