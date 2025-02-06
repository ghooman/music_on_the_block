import SubBanner from './SubBanner';

import creatingIcon from '../../assets/images/icon/creating.svg';

import './AlbumCoverStudio.scss';

const AlbumCoverSudio = ({ children }) => {
    return (
        <div className="create__album-cover-studio">
            <SubBanner>
                <SubBanner.Title text="Generate Album Cover"></SubBanner.Title>
                <SubBanner.Message
                    text="If customization is OFF, the design will be based on your input from Steps 1 & 2.
With customization ON, the design will also reflect your additional settings."
                ></SubBanner.Message>
                <SubBanner.Button title="Generate"></SubBanner.Button>
            </SubBanner>
            <CoverCreate />
            {children}
        </div>
    );
};

export default AlbumCoverSudio;

const CoverCreate = () => {
    const images = new Array(9).fill(null);

    return (
        <div className="creating mb40">
            <div className="creating-list">
                <p className="creating-list__title">Album Cover Studio History</p>
                <div className="creating-list__items">
                    {images.map((item, index) => (
                        <div className="creating-list__items--item" key={index}>
                            <img src={creatingIcon} alt="creating" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="creating-select">
                <img src={creatingIcon} alt="creating" />
                <p className="creating-select__wait-text">Creating Your Album Cover...Please wait.</p>
            </div>
        </div>
    );
};
