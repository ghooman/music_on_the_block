import { useRef, useState } from 'react';
import { useRanger, Ranger } from '@tanstack/react-ranger';
import { useTranslation } from 'react-i18next';

import ExpandedButton from './ExpandedButton';

import cancelIcon from '../../assets/images/icon/cancel.svg';

import './SelectItem.scss';

export const SelectItemWrap = ({
  children,
  dropdown,
  selectedLanguage,
  setSelectedLanguage,
  currentStep,
}) => {
  const [visible, setVisible] = useState(!dropdown);
  const { t } = useTranslation('song_create');
  // 언어 변경 함수
  const handleLanguage = lang => {
    if (currentStep === 'isMelodyPage') {
      return;
    } else {
      setSelectedLanguage(lang);
    }
  };

  return (
    <div className="create__select-components">
      <div className="tag-select-title">
        <h2 className="tag-select-title__text">{t('Select a Tags')}</h2>
        {dropdown && (
          <div
            className={`tag-select-title__dropdown-toggle ${visible ? 'visible' : ''}`}
            onClick={() => setVisible(prev => !prev)}
          >
            <div className={`tag-select-title__dropdown-thumb ${visible ? 'visible' : ''}`}></div>
          </div>
        )}
      </div>
      {selectedLanguage && setSelectedLanguage && (
        <div className="tag-select language-select">
          <div className="tag-title__block">
            <h3 className="tag-title">{t('Language')}</h3>
          </div>
          <h4 className="tag-sub-title">{t('Language Tags')}</h4>
          <div className="tag-preset">
            <button
              className={`tag-button presets ${selectedLanguage === 'KOR' ? 'enable' : ''}`}
              // onClick={() => setSelectedLanguage("KOR")}
              onClick={() => handleLanguage('KOR')}
            >
              {t('KOR')}
            </button>
            <button
              className={`tag-button presets ${selectedLanguage === 'ENG' ? 'enable' : ''}`}
              // onClick={() => setSelectedLanguage("ENG")}
              onClick={() => handleLanguage('ENG')}
            >
              {t('ENG')}
            </button>
          </div>
        </div>
      )}

      {visible ? children : null}
    </div>
  );
};

export const SelectItem = ({
  mainTitle,
  subTitle,
  preset,
  setter,
  objKey,
  selected,
  multiple,
  add,
  color,
  className,
}) => {
  const [input, setInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const { t } = useTranslation('song_create');
  const addItem = () => {
    if (!input.trim()) return;
    setSelectedPreset(null);

    setter(prev => {
      let copy = { ...prev };
      if (multiple) {
        let set = Array.from(new Set([...copy[objKey], input]));
        if (set.length > 5) {
          set.shift();
        }
        copy[objKey] = set;
      } else {
        copy[objKey] = [input];
      }
      return copy;
    });
    setInput('');
  };

  const deleteItem = deleteItem => {
    setSelectedPreset(null);
    setter(prev => {
      let copy = { ...prev };
      copy[objKey] = copy[objKey].filter(item => item !== deleteItem);
      return copy;
    });
  };

  const handlePreset = (key, value) => {
    if (add && multiple) {
      setter(prev => {
        let copy = { ...prev };
        let set = Array.from(new Set([...copy[objKey], key]));
        if (set.length > 5) {
          set.shift();
        }
        copy[objKey] = set;
        return copy;
      });
    } else {
      setter(prev => {
        let copy = { ...prev };
        copy[objKey] = value;
        setSelectedPreset(key);
        return copy;
      });
    }
  };

  return (
    <div className={`tag-select ${className}`}>
      <div className="tag-title__block">
        <h3 className="tag-title">{mainTitle}</h3>
        {/* <p className="tag-title__notice">
          {multiple
            ? "You can enter up to 5 keywords"
            : " You can select only one option"}
        </p> */}
      </div>
      <h4 className="tag-sub-title">{subTitle}</h4>
      <div className="tag-preset">
        {preset &&
          Object.entries(preset).map(([key, value], index) => (
            <button
              className={`tag-button presets ${selectedPreset === key ? 'enable' : ''}`}
              key={`preset-${index}`}
              onClick={() => handlePreset(key, value)}
            >
              {key}
            </button>
          ))}
      </div>
      <div className="tag-input-box">
        <input
          value={input}
          className="tag-input"
          placeholder="Please enter your keyword here"
          maxLength={10}
          onChange={e => {
            setInput(e.target.value);
          }}
          onKeyPress={e => {
            if (e.key === 'Enter') addItem();
          }}
        ></input>
        <div className="tag-input-comment-button-wrap">
          {color && (
            <label className="tag-input-comment-button">
              {t('Select')}
              <input
                type="color"
                onChange={e => setInput(e.target.value)}
                onBlur={() => {
                  addItem();
                }}
              />
            </label>
          )}
          <button className="tag-input-comment-button" onClick={addItem}>
            {t('Add')}
          </button>
        </div>
      </div>
      <div className="tag-selected">
        {selected.map((item, index) => (
          <button
            className="tag-button selected"
            key={`selected-${index}`}
            onClick={() => deleteItem(item)}
          >
            <img src={cancelIcon} alt="close" />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SelectItemTempo = ({ tempo, setTempo }) => {
  const rangeRef = useRef(null);
  const { t } = useTranslation('song_create');
  const rangesInstance = useRanger({
    getRangerElement: () => rangeRef.current,
    values: tempo,
    min: 60,
    max: 120,
    stepSize: 1,
    onChange: instance => {
      setTempo(instance.sortedValues);
    },
  });

  return (
    <div className="tag-select">
      <div className="tag-title__block">
        <h3 className="tag-title">{t('Select a Tempo')}</h3>
      </div>
      <div
        className={`tag-title__tempos ${
          tempo >= 60 && tempo <= 80
            ? 'slow'
            : tempo > 80 && tempo <= 120
            ? 'medium'
            : tempo > 120
            ? 'fast'
            : ''
        }`}
      >
        {tempo >= 60 && tempo <= 80 && 'Slow : Calm and reflective (60-80 BPM)'}
        {tempo > 80 && tempo <= 120 && 'Medium: Balanced and versatile (81-120 BPM)'}
        {tempo > 120 && 'Fast: Energetic and upbeat (121-160 BPM)'}
      </div>
      <div className="tag-select__range" ref={rangeRef}>
        {rangesInstance?.getSteps().map((item, index) => {
          return (
            <div
              className="tag-select__range--applicable"
              style={{
                width: `${rangesInstance.getPercentageForValue(tempo)}%`,
              }}
              key={index}
            ></div>
          );
        })}
        {rangesInstance
          .handles()
          ?.map(({ value, onKeyDownHandler, onMouseDownHandler, onTouchStart }, i) => (
            <button
              className="tag-select__range--thumb"
              key={i}
              onKeyDown={onKeyDownHandler}
              onMouseDown={onMouseDownHandler}
              onTouchStart={onTouchStart}
              role="slider"
              aria-valuemin={rangesInstance.options.min}
              aria-valuemax={rangesInstance.options.max}
              aria-valuenow={value}
              style={{
                left: `${rangesInstance.getPercentageForValue(value)}%`,
              }}
            >
              <div className="tag-select__range--thumb-tick">
                <span>{value}</span> BPM
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export const SelectItemSongLength = ({ songLength, setSongLength }) => {
  const songLengthRef = useRef(null);
  const { t } = useTranslation('song_create');
  const songLengthRangesInstance = useRanger({
    getRangerElement: () => songLengthRef.current,
    values: songLength,
    min: 30,
    max: 240,
    stepSize: 1,
    onChange: instance => {
      setSongLength(instance.sortedValues);
    },
  });

  return (
    <div className="tag-select">
      <div className="tag-title__block">
        <h3 className="tag-title">{t('Select a Song Length')}</h3>
      </div>
      <div className="tag-select__range" ref={songLengthRef}>
        {songLengthRangesInstance?.getSteps().map((item, index) => {
          return (
            <div
              className="tag-select__range--applicable"
              key={index}
              style={{ width: `${songLengthRangesInstance.getPercentageForValue(songLength)}%` }}
            ></div>
          );
        })}
        {songLengthRangesInstance
          .handles()
          ?.map(({ value, onKeyDownHandler, onMouseDownHandler, onTouchStart }, i) => (
            <button
              className="tag-select__range--thumb"
              key={i}
              onKeyDown={onKeyDownHandler}
              onMouseDown={onMouseDownHandler}
              onTouchStart={onTouchStart}
              role="slider"
              aria-valuemin={songLengthRangesInstance.options.min}
              aria-valuemax={songLengthRangesInstance.options.max}
              aria-valuenow={value}
              style={{
                left: `${songLengthRangesInstance.getPercentageForValue(value)}%`,
              }}
            >
              <div className="tag-select__range--thumb-tick">
                <span>{value}</span> {t('Seconds')}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export const SelectItemInputOnly = ({ value, setter, title }) => {
  return (
    <div className="tag-select">
      <div className="tag-title__block">
        <h3 className="tag-title">{title}</h3>
        {/* <p className="tag-title__notice">You can enter up to 100 words</p> */}
      </div>
      <input
        className="tag-input"
        value={value}
        onChange={e => setter(e.target.value)}
        type="text"
        placeholder="Add a final mood or vibe, if you want."
      />
    </div>
  );
};
