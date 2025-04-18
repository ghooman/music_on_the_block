import { Link } from 'react-router-dom';
import './ContentWrap.scss';

const ContentWrap = ({ children, title, link, border = true }) => {
    return (
        <div className="unit-component-content-wrap" style={{ border: border ? '1px solid #222' : '' }}>
            <div className="unit-component-content-wrap__title">
                <p className="unit-component-contnet-wrap__title--text">{title}</p>
                {link && (
                    <Link className="unit-component-content-wrap__title--link" to={link}>
                        See More
                    </Link>
                )}
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
