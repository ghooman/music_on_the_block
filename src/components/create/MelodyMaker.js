import { useState } from 'react';
import './MelodyMaker.scss';

const MelodyMaker = () => {
    const [bpm, setBpm] = useState(90);

    return (
        <div className="create__melody-maker">
            <BpmSelect bpm={bpm} setBpm={setBpm} />
        </div>
    );
};

export default MelodyMaker;

const BpmSelect = ({ bpm, setBpm }) => {
    const maxBpm = 220;

    return <div className="bpm-select"></div>;
};
