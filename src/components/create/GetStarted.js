import ExpandedButton from './ExpandedButton';

import './GetStarted.scss';

const GetStarted = ({ handler }) => {
    return (
        <div className="create__get-started">
            <h1 className="create__get-started--title">Create Your Own Song With AI</h1>
            <h2 className="create__get-started--subtitle">
                Turn your ideas into beautiful lyrics and melodies with the power of AI
            </h2>
            <div className="create__get-started--features">
                <h3 className="create__get-started--features-title">Code Features</h3>
                <div className="create__get-started--features-items">
                    {['Lyric Generation', 'Melody Composition', 'Style Adaptation'].map((item, index) => (
                        <div className="create__get-started--features-item" key={index}>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
            <div className="create__get-started--features sequence">
                <div>
                    <h3 className="create__get-started--features-title">Cost</h3>
                    <p className="create__get-started--features-item">100 MOB</p>
                </div>
                <div>
                    <h3 className="create__get-started--features-title">Used</h3>
                    <p className="create__get-started--features-item">20,000</p>
                </div>
                <div>
                    <h3 className="create__get-started--features-title">Precision</h3>
                    <p className="create__get-started--features-item ">93%</p>
                </div>
            </div>
            <ExpandedButton
                title="Create"
                buttonColor="#cf0"
                borderRadius={12}
                color="#1a1a1a"
                style={{ float: 'right', fontFamily: 'orbitron600', padding: '8px 10px' }}
                onClick={handler}
            />
        </div>
    );
};

export default GetStarted;
