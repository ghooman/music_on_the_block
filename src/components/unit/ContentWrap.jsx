import { Link } from 'react-router-dom';
import './ContentWrap.scss';
import { useTranslation } from 'react-i18next';

const ContentWrap = ({ children, title, link, border = true, className, style }) => {
  const { t } = useTranslation('module');

  return (
    <div
      // className="unit-component-content-wrap"
      className={`unit-component-content-wrap ${className}`}
      style={{ border: border ? '1px solid #222' : '' }}
    >
      {title && (
        <div className="unit-component-content-wrap__title">
          <p className="unit-component-contnet-wrap__title--text">{title}</p>
          {link && (
            <Link className="unit-component-content-wrap__title--link" to={link}>
              {t('See More')}
            </Link>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default ContentWrap;

// 서브랩으로 갭 사이즈 수정 가능합니다.
ContentWrap.SubWrap = ({ gap = 16, children }) => {
  return <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
};

ContentWrap.SubTitle = ({ subTitle }) => {
  return <p className="unit-component-content-wrap__sub-title">{subTitle}</p>;
};
