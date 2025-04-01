import { Link } from 'react-router-dom';
import './ContentWrap.scss';

const ContentWrap = ({ children, title, link }) => {
    return (
        <div className="nft-content-wrap">
            <div className="nft-content-wrap__title">
                {title && <p className="nft-contnet-wrap__title--text">{title}</p>}
                {link && <Link className="nft-content-wrap__title--link">See More</Link>}
            </div>
            {children}
        </div>
    );
};

export default ContentWrap;

// 서브랩으로 갭 사이즈 수정 가능합니다.
ContentWrap.SubWrap = ({ gap = 16, children }) => {
    return <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>;
};
