import ExpandedButton from './ExpandedButton';

import './SubBanner.scss';

const SubBanner = ({ children }) => {
    return <div className="create__sub-banner mb40">{children}</div>;
};

export default SubBanner;

SubBanner.RightImages = ({ src }) => {
    return <img className="create__sub-banner-bg right" src={src} alt="" />;
};

SubBanner.LeftImages = ({ src }) => {
    return <img className="create__sub-banner-bg left" src={src} alt="" />;
};

SubBanner.Title = ({ text }) => {
    return <h3 className="sub-banner__title">{text}</h3>;
};

SubBanner.Message = ({ text }) => {
    return <p className="sub-banner__message">{text}</p>;
};

SubBanner.SubMessage = ({ text }) => {
    return <p className="sub-banner__sub-message">{text}</p>;
};

SubBanner.Button = ({ title, handler }) => {
    return (
        // <button className="sub-banner__buttons" onClick={handler}>
        //     {title}
        // </button>
        <ExpandedButton
            title={title}
            color="#1a1a1a"
            buttonColor="#00ffb3"
            borderRadius={12}
            style={{ padding: '8px 10px', zIndex: 3, fontFamily: 'orbitron600', width: 'fit-content' }}
            onClick={handler}
        ></ExpandedButton>
    );
};
