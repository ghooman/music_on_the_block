import './SubBanner.scss';

const SubBanner = ({ children }) => {
    return <div className="create__sub-banner mb40">{children}</div>;
};

export default SubBanner;

SubBanner.Title = ({ text }) => {
    return <h3 className="sub-banner__title">{text}</h3>;
};

SubBanner.Message = ({ text }) => {
    return <p className="sub-banner__message">{text}</p>;
};

SubBanner.SubMessage = ({ text }) => {
    return <p className="sub-banner__sub-message">{text}</p>;
};

SubBanner.Button = ({ title, action }) => {
    return (
        <button className="sub-banner__buttons" onClick={action}>
            {title}
        </button>
    );
};
