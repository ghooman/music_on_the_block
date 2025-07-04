import { useRef, useState } from 'react';
import { useRanger, Ranger } from '@tanstack/react-ranger';
import { useTranslation } from 'react-i18next';

import ExpandedButton from './ExpandedButton';

import cancelIcon from '../../assets/images/icon/cancel.svg';

import './SelectItem.scss';

import lyricsCreate from '../../assets/images/icons/lyrics-create-icon.svg';
import lyricsEdit from '../../assets/images/icons/lyrics-edit-icon.svg';
import closeIcon from '../../assets/images/icons/close-icon.svg';
import bpmThumbIcon from '../../assets/images/icons/BPM-thumb-icon.svg';

export const SelectItemWrap = ({
  children,
  dropdown,
  selectedLanguage,
  setSelectedLanguage,
  currentStep,
  icon = lyricsCreate,
  title = '저는 가사 생성 AI예요!',
  description = '음악의 가사를 먼저 생성해볼까요?\n특별한 이야기를 기반으로 당신만의 가사를 만들어보세요',
  mode = 'default',
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
    <div className={`create ${mode === 'chatbot' ? 'chatbot-mode' : ''}`}>
      <div className={`create__select-components`}>
        <div className="tag-select-title">
          <img src={icon} alt="create-icon" />
          <div className="tag-select-title--group">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {/* {dropdown && (
          <div
            className={`tag-select-title__dropdown-toggle ${visible ? 'visible' : ''}`}
            onClick={() => setVisible(prev => !prev)}
          >
            <div className={`tag-select-title__dropdown-thumb ${visible ? 'visible' : ''}`}></div>
          </div>
        )} */}
        </div>
        {/* {selectedLanguage && setSelectedLanguage && (
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
      )} */}

        {visible ? children : null}
      </div>
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
  placeholder,
  color,
  className,
  hideInput,
  blockStyle,
}) => {
  const [input, setInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const { t } = useTranslation('song_create');
  const addItem = () => {
    const trimmed = input.trim(); // ⭐ 추가됨
    if (!trimmed) return;

    setter(prev => {
      const copy = { ...prev };
      if (copy[objKey].length >= 5) return prev; // ✅ 5개 이상이면 입력도 막기
      if (multiple) {
        const set = Array.from(new Set([...copy[objKey], trimmed])); // ⭐ 중복 제거
        copy[objKey] = set;
      } else {
        copy[objKey] = [trimmed];
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
    setter(prev => {
      const copy = { ...prev };
      const alreadySelected = copy[objKey].includes(key);

      if (multiple) {
        if (alreadySelected) {
          // 선택 해제
          copy[objKey] = copy[objKey].filter(item => item !== key);
        } else {
          if (copy[objKey].length >= 5) return prev; // ✅ 5개 이상이면 추가 막기
          copy[objKey] = [...copy[objKey], key];
        }
      } else {
        copy[objKey] = alreadySelected ? [] : [key];
      }

      return copy;
    });
  };

  return (
    <div className={`tag-select ${className}`}>
      {/* <div className="tag-title__block">
        <h3 className="tag-title">{mainTitle}</h3>
        <p className="tag-title__notice">
          {multiple
            ? "You can enter up to 5 keywords"
            : " You can select only one option"}
        </p>
      </div> */}
      {/* <h4 className="tag-sub-title">{subTitle}</h4> */}
      <div className={`tag-preset ${blockStyle ? 'preset-horizontal' : ''}`}>
        {/* ⭐ 프리셋 버튼 안에서 X 아이콘이 선택된 경우만 표시 */}
        {preset &&
          Object.entries(preset).map(([key, value], index) => {
            const isSelected = selected.includes(key); // ⭐ 추가
            return (
              <button
                className={`tag-button presets 
                        ${isSelected ? 'enable' : ''} 
                        ${!isSelected && selected.length >= 5 ? 'disabled-button' : ''}
                        ${blockStyle ? 'block-style' : ''}
                      `}
                key={`preset-${index}`}
                onClick={() => {
                  if (isSelected || selected.length < 5) {
                    handlePreset(key, value);
                  }
                }}
              >
                {t(key)}
                {/* ❌ blockStyle일 땐 cancel-icon(X) 숨김 */}
                {!blockStyle && isSelected && (
                  <img src={closeIcon} alt="cancel" className="cancel-icon" />
                )}
              </button>
            );
          })}

        {/* ⭐ 직접 입력한 키워드는 preset에 없는 것만 걸러서 함께 렌더링 */}
        {selected
          .filter(item => !preset || !preset[item]) // ⭐ 프리셋 외 항목만 필터링
          .map((item, index) => (
            <button
              className="tag-button selected"
              key={`input-${index}`}
              onClick={() => deleteItem(item)}
            >
              {item}
              <img src={closeIcon} alt="cancel" className="cancel-icon" /> {/* ⭐ X 아이콘 표시 */}
            </button>
          ))}
      </div>
      {/* ✅ hideInput이 false일 때만 input 박스 렌더 */}
      {!hideInput && (
        <div className="tag-input-box">
          <input
            value={input}
            className="tag-input"
            placeholder={placeholder || '직접 입력할 수 있어요'}
            maxLength={20} // 200자 안넘게 잘적어야합니다
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && selected.length < 5) {
                addItem();
              }
            }}
            disabled={selected.length >= 5} // ✅ 입력창 자체 비활성화
          />
        </div>
      )}
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
        {/* <h3 className="tag-title">{t('Select a Tempo')}</h3> */}
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
        {tempo >= 60 && tempo <= 80 && t('느림 60-80 BPM은 차분하고 사색적인 곡으로 적당해요.')}
        {tempo > 80 && tempo <= 120 && t('중간 81-120 BPM은 보통의 다용도 곡으로 적당해요.')}
        {tempo > 120 && t('Fast: Energetic and upbeat (121-160 BPM)')}
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
            <div
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
              <img src={bpmThumbIcon} alt="bpm-thumb" draggable={false} />
              <div className="tag-select__range--thumb-tick">
                <span className="thumb-value">{value}</span> <span className="thumb-bpm">BPM</span>
              </div>
            </div>
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

export const SelectItemInputOnly = ({ value, setter, title, placeholder }) => {
  const { t } = useTranslation('song_create');
  return (
    <div className="tag-select">
      <div className="tag-title__block">
        <h3 className="tag-title">{title}</h3>
        {/* <p className="tag-title__notice">You can enter up to 100 words</p> */}
      </div>
      <textarea
        className="tag-textarea"
        value={value}
        onChange={e => setter(e.target.value)}
        // type="text"
        placeholder={placeholder}
        // maxLength={100}
      />
    </div>
  );
};

export const TitleInputOnly = ({ value, setter, title, placeholder }) => {
  const { t } = useTranslation('song_create');
  return (
    <div className="tag-select">
      <div className="tag-title__block">
        <h3 className="tag-title">{title}</h3>
      </div>
      <input
        className="tag-input"
        value={value}
        onChange={e => setter(e.target.value)}
        type="text"
        placeholder={placeholder}
        // maxLength={100}
      />
    </div>
  );
};

export const SelectItemIntroInputOnly = ({ value, setter, title }) => {
  const { t } = useTranslation('song_create');
  return (
    <div className="tag-select">
      <div className="tag-title__block">
        <h3 className="tag-title">{title}</h3>
      </div>
      <input
        className="tag-input"
        value={value}
        onChange={e => setter(e.target.value)}
        type="text"
        placeholder={t('Please provide a description of the song you are creating.')}
      />
    </div>
  );
};
