import React, { useState } from 'react';
// img
import freeModeIcon from '../../assets/images/icons/freemode-icon.svg';
import closeIcon from '../../assets/images/close.svg';
import plusIcon from '../../assets/images/icons/plus-icon.svg';
// style
import './FreeForm.scss';

function FreeForm() {
  // 프롬프트 입력
  const [promptText, setPromptText] = useState('');
  // Modal open/close 상태
  const [isCustomLyricsModal, setIsCustomLyricsModal] = useState(false);
  // Custom Lyrics 입력
  const [lyrics, setLyrics] = useState('');
  // Custom Lyrics 저장 여부
  const [isLyricsSaved, setIsLyricsSaved] = useState(false);
  // Custom Lyrics 저장 후 다시 눌렀을 때 편집 가능 여부
  const [isEditing, setIsEditing] = useState(true);

  return (
    <>
      <section className="freeform-section">
        <div className="freeform-section__inner">
          <div className="freeform-section__inner__tit">
            <img src={freeModeIcon} alt="" />
            <h2>Freeform Music Creation</h2>
            <p>
              <span>Write a prompt for your music.</span>
              <span>To add your own lyrics, tap [Custom Lyrics].</span>
            </p>
          </div>
          <textarea
            className="freeform-section__inner__textarea"
            placeholder="Feel free to enter traits, instruments, tempo, gender, and more."
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            readOnly={!isEditing}
          />
          <button
            type="button"
            className="btn-lyrics-modal"
            onClick={() => setIsCustomLyricsModal(true)}
          >
            <img src={plusIcon} alt="Plus Icon" />
            <span>{isLyricsSaved ? 'View & edit lyrics' : 'Custom Lyrics'}</span>
          </button>
        </div>
        <div className="btn-full-box">
          <button
            className={`btn-full-primary ${
              promptText.length > 0 ? 'btn-full-primary--active' : 'btn-full-primary--disabled'
            }`}
            disabled={promptText.length === 0}
          >
            Music Creation
          </button>
        </div>
      </section>

      {/* Custom Lyrics(커스텀 가사) 선택 시 Modal 노출 */}
      {isCustomLyricsModal && (
        <div className={`custom-lyrics-modal ${isCustomLyricsModal ? 'open' : ''}`}>
          {/* modal-background-wrapper */}
          <div
            className="custom-lyrics-modal__bg"
            onClick={() => setIsCustomLyricsModal(false)}
          ></div>
          <div className="custom-lyrics-modal__box">
            <div className="custom-lyrics-modal__box__tit">
              <h3>Custom Lyrics</h3>
              <button className="btn-close" onClick={() => setIsCustomLyricsModal(false)}>
                <img src={closeIcon} alt="Close" />
              </button>
            </div>

            <textarea
              className="custom-lyrics-modal__box__textarea"
              placeholder="Please add your own lyrics."
              value={lyrics}
              onChange={e => setLyrics(e.target.value)}
              readOnly={!isEditing}
            />

            {/* 버튼 조건부 렌더링 */}
            {isLyricsSaved && !isEditing ? (
              <button
                className="lyrics-modal__btn lyrics-modal__btn--editing"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className={`lyrics-modal__btn ${lyrics.trim() ? 'lyrics-modal__btn--active' : ''}`}
                onClick={() => {
                  setIsLyricsSaved(!!lyrics.trim());
                  setIsEditing(false);
                  setIsCustomLyricsModal(false);
                }}
                disabled={!lyrics.trim()}
              >
                {isEditing ? 'Save' : 'Done'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FreeForm;
