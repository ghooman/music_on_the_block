import React, { useEffect, useState, useContext } from 'react';
import ContentWrap from '../components/unit/ContentWrap';
import { InfoRowWrap } from '../components/nft/InfoRow';
import '../styles/EvaluationBegin.scss';
import { Link, useNavigate } from 'react-router-dom';
import Filter from '../components/unit/Filter';
import Loading from '../components/IntroLogo2';

//이미지
import earnMicIcon from '../assets/images/evaluation/earnMicIcon.svg';
import algorithmIcon from '../assets/images/evaluation/algorithmIcon.svg';
import songValueIcon from '../assets/images/evaluation/songValueIcon.svg';
import newMusicIcon from '../assets/images/evaluation/newMusicIcon.svg';
import biggerRewardsIcon from '../assets/images/evaluation/biggerRewardsIcon.svg';

import judgeImg01 from '../assets/images/evaluation/judge-img01.png';
import judgeImg02 from '../assets/images/evaluation/judge-img02.png';
import judgeImg03 from '../assets/images/evaluation/judge-img03.png';

import step1Img from '../assets/images/evaluation/step1-img.png';
import step2Img from '../assets/images/evaluation/step2-img.png';
import step3Img from '../assets/images/evaluation/step3-img.png';
import step4Img from '../assets/images/evaluation/step4-img.png';

import SongsBar from '../components/unit/SongsBar';

const EvaluationBegin = () => {
  const songList = [101, 102, 103];
  const criticList = [
    { id: 0, name: 'Jinwoo Yoo', img: judgeImg01 },
    { id: 1, name: 'Drexx', img: judgeImg02 },
    { id: 2, name: 'Elara Moon', img: judgeImg03 },
  ];
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedCritic, setSelectedCritic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <ContentWrap title="AI Song Evaluation" border={false} className="none-padding">
      <ContentWrap title="Step 1">
        <Step1 songs={songList} selectedSong={selectedSong} onSelectSong={setSelectedSong} />
      </ContentWrap>

      <ContentWrap title="Step 2" border={false}>
        <Step2
          critics={criticList}
          selectedCritic={selectedCritic}
          onSelectCritic={setSelectedCritic}
        />
      </ContentWrap>

      <ContentWrap title="Step 3">
        <Step3 selectedSong={selectedSong} selectedCritic={selectedCritic} critics={criticList} />
      </ContentWrap>

      <ViewResults disabled={!selectedSong || selectedCritic === null} />
    </ContentWrap>
  );
};

export default EvaluationBegin;

const Step1 = ({ songs, selectedSong, onSelectSong }) => {
  return (
    <>
      <div className="step1">
        <p className="step1__title">
          Select your song.
          <br />
          Click the song, then tap "Select" below to continue.
        </p>
        <Filter songsSort={true} gradeFilter={true} tokenFilter={true} />
        <div className="step1__list">
          {songs.map(id => (
            <SongsBar
              key={id}
              songId={id}
              selected={selectedSong === id}
              onClick={() => onSelectSong(id)}
            />
          ))}
        </div>
        <button className="select-btn" onClick={() => selectedSong && onSelectSong(selectedSong)}>
          Select
        </button>
      </div>
    </>
  );
};

const Step2 = ({ critics, selectedCritic, onSelectCritic }) => {
  return (
    <>
      <div className="step2">
        <p className="step2__title">Choose your music critic.</p>
        <div className="step2__choose">
          {critics.map((critic, idx) => (
            <button
              key={critic.id}
              className={`step2__choose__item ${selectedCritic === critic.id ? 'active' : ''}`}
              onClick={() => onSelectCritic(critic.id)}
            >
              <img src={critic.img} alt={critic.name} />
              <dl className="step2__choose__item__title">
                <dt>
                  "
                  {idx === 0 ? (
                    <span>Soul</span>
                  ) : idx === 1 ? (
                    <span>flow?</span>
                  ) : (
                    <span>Melody</span>
                  )}
                  {idx === 0
                    ? ' first, sound second.'
                    : idx === 1
                    ? ' No mercy. Off-beat? Game over.'
                    : ' she finds the truth.'}
                  "
                </dt>
                <dd>{critic.name}</dd>
              </dl>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const Step3 = ({ selectedSong, selectedCritic, critics }) => {
  // 선택된 비평가 찾기
  const selectedCriticInfo = critics?.find(critic => critic.id === selectedCritic) || {};

  return (
    <>
      <div className="step3">
        <p className="step3__title">
          Please review your selected options.
          <br />
          If you would like to proceed with these choices, click "View Results" at the bottom of the
          screen.
        </p>
        <div className="step3__selected-song">
          <p className="step3__selected-song__title">Selected Song</p>
          {selectedSong && <SongsBar songId={selectedSong} />}
          <dl className="step3__selected-song__critic">
            <dt>Critic</dt>
            <dd>
              <p>{selectedCriticInfo.name || 'Not Selected'}</p>
              <span>
                Todays Left: <strong>1/1</strong>
              </span>
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
};

const ViewResults = () => {
  return (
    <>
      <Link to="/evaluation-results" className="view-results">
        View Results
      </Link>
    </>
  );
};
