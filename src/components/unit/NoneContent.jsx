import offImage from '../../assets/images/none-icon.svg';
import NoDataImage from '../../assets/images/mypage/albums-no-data.svg';
import loadingImg from '../../assets/images/loading-img.gif';

import './NoneContent.scss';
import { useTranslation } from 'react-i18next';

const NoneContent = ({
  height,
  image = NoDataImage,
  message,
  message2,
  style,
  loading = false,
  children,
}) => {
  if (loading) {
    image = loadingImg;
    message = 'Loading';
  }

  const { t } = useTranslation('module');

  return (
    <div className="unit-component-none-content" style={{ ...style, height: height }}>
      {image && <img className="unit-component-none-content__image" src={image} alt="icon" />}
      <p className="unit-component-none-content--text">{t(message)}</p>
      {message2 && <p className="unit-component-none-content--text">{message2}</p>}
      {children}
    </div>
  );
};

export default NoneContent;
