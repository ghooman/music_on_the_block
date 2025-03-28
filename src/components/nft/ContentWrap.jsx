import { Link } from 'react-router-dom';
import './ContentWrap.scss';

const ContentWrap = ({ children, title, link }) => {
    return (
        <div className="nft-content-wrap">
            <div className="nft-content-wrap__title">
                <p className="nft-contnet-wrap__title--text">{title}</p>
                {link && <Link className="nft-content-wrap__title--link">See More</Link>}
            </div>
            {children}
        </div>
    );
};

export default ContentWrap;
