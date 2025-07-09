import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import jsPDF from 'jspdf';

import SubBanner from './SubBanner';
import { SelectItem, SelectItemWrap, SelectItemInputOnly } from './SelectItem';

import subBg2 from '../../assets/images/create/subbanner-bg2.png';
import lyricsCreate from '../../assets/images/icons/lyrics-create-icon.svg';
import lyricsEdit from '../../assets/images/icons/lyrics-edit-icon.svg';

import './LyricLab.scss';
import ExpandedButton from './ExpandedButton';
import CreateLoading from '../CreateLoading';
import { RemainCountButton } from '../unit/RemainCountButton';
import { generateKoreanPdf } from '../../utils/pdfGenerator';
import { useTranslation } from 'react-i18next';
import lyricPrompts from '../../locales/lyricPrompts';

const tagPreset = {
  Love: ['Love'],
  Moon: ['Moon'],
  Happy: ['Happy'],
  Sad: ['Sad'],
  Cafe: ['Cafe'],
  Travel: ['Travel'],
  Winter: ['Winter'],
  School: ['School'],
  Space: ['Space'],
  Nature: ['Nature'],
  Cat: ['Cat'],
  Strawberry: ['Strawberry'],
};

const genrePreset = {
  'K-POP': ['K-POP'],
  POP: ['POP'],
  BALLAD: ['BALLAD'],
  'R&B': ['R&B'],
  SOUL: ['SOUL'],
  'HIP-HOP': ['HIP-HOP'],
  RAP: ['RAP'],
  ROCK: ['ROCK'],
  METAL: ['METAL'],
  FOLK: ['FOLK'],
  BLUES: ['BLUES'],
  COUNTRY: ['COUNTRY'],
  EDM: ['EDM'],
  CLASSICAL: ['CLASSICAL'],
  REGGAE: ['REGGAE'],
};
const stylePreset = {
  Happy: ['Happy'],
  Sad: ['Sad'],
  Excitement: ['Excitement'],
  Passionate: ['Passionate'],
};

// OpenAI 클라이언트 초기화
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // .env 파일 등에 저장된 API 키 사용
  dangerouslyAllowBrowser: true,
});

const LyricsLab = ({
  selectedLanguage,
  setSelectedLanguage,
  setLyricData,
  lyricData,
  generatedLyric,
  setGeneratedLyric,
  setPageNumber,
  lyricStory,
  setLyricStory,
  SelectedWrap,
  SelectedItem,
  createPossibleCount,
  selectedVersion,
  onSkip,
  isLyricPage,
  melodyData,
  tempo,
  setAlbumCover,
  setIsConfirmLyricStatus,
}) => {
  const { t } = useTranslation('song_create');

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('edit');
  // ================ 가사 생성 ================ //
  const [createdLyrics, setCreatedLyrics] = useState(generatedLyric || '');

  /**
   * GPT Responses API를 사용하여 GPT-4o 모델에 요청합니다.
   * 기본적으로 텍스트 생성을 위한 주요 API입니다.
   *
   * @param {string} instructions - 모델에 전달할 지시사항 (System Message 개념)
   * @param {string} input - 모델에 입력할 텍스트 (User Prompt 개념)
   * @returns {Promise<string>} 모델의 응답 텍스트
   */

  const generatedLyricsRef = useRef(null);
  // 버튼 활성화 조건 계산
  // 각 배열에 대해 길이 체크 후 값이 있는지 확인
  // const isAnyFieldFilled =
  //   (lyricData?.lyric_tag && lyricData.lyric_tag.length > 0) ||
  //   (lyricData?.lyric_genre && lyricData?.lyric_genre.length > 0 && lyricData.lyric_genre !== '') ||
  //   (lyricStory && lyricStory.trim() !== '');
  const isRequiredFieldsFilled =
    Array.isArray(lyricData?.lyric_tag) &&
    lyricData.lyric_tag.length > 0 &&
    Array.isArray(lyricData?.lyric_genre) &&
    lyricData.lyric_genre.length === 1;

  // 가사 생성 함수 (로딩 상태 관리는 외부에서 처리)
  const callGPT4oResponses = async () => {
    const targetLanguage = lyricPrompts.languageMap[selectedLanguage] || 'English';

    const response = await client.responses.create({
      model: 'gpt-4.1-nano',
      instructions: lyricPrompts.main.instructions,
      input: `Language: ${targetLanguage}
Tags/Mood: ${lyricData?.lyric_tag?.join(', ') || 'Not specified'}
Genre: ${lyricData?.lyric_genre || 'Not specified'}
Additional Story: ${lyricStory || 'Not specified'}`,
    });
    console.log('GPT Responses API 응답:', response.output_text);
    if (response.output_text.includes('이 요청에 대한 구체적인 정보가 부족합니다.')) {
      throw new Error('필수 정보가 부족합니다. 모든 항목을 채워주세요.');
    } else {
      setCreatedLyrics(response.output_text);
      setIsConfirmLyricStatus(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 가사 생성 전용 함수
  const handleGenerateLyrics = async () => {
    setLoading(true);
    try {
      await callGPT4oResponses();
    } catch (error) {
      console.error('생성 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  // 가사 생성 전 단계 UI createdLyrics 없을때
  if (!createdLyrics)
    return (
      <div className="create__lyric-lab">
        <SelectItemWrap
          mode="default"
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          icon={createdLyrics ? lyricsEdit : lyricsCreate}
          title={
            createdLyrics
              ? t('You can click the lyrics to edit them.')
              : t(`I'm a lyrics-generating AI!`)
          }
          description={
            createdLyrics
              ? t(
                  `Use the generated lyrics as-is or customize them as you like.
You can generate a melody based on the edited lyrics.`
                )
              : t(
                  `Shall we start by creating song lyrics?
Create your own lyrics based on a special story`
                )
          }
        >
          <SubBanner>
            {/* <SubBanner.LeftImages src={subBg2} /> */}
            <SubBanner.Title
              text={t('What are the main keywords for the lyrics you want to create?')}
            />
            <SubBanner.Message text={t('You can select up to 5 tags.')} />
            <SelectItem
              // subTitle={t('Popular Tags')}
              setter={setLyricData}
              objKey="lyric_tag"
              selected={lyricData?.lyric_tag}
              preset={tagPreset}
              className="sub-banner__tags"
              multiple
              add
              placeholder={t('You can also enter your desired keywords manually.')}
            />
          </SubBanner>
          <SubBanner>
            {/* <SubBanner.LeftImages src={subBg2} /> */}
            <SubBanner.Title text={t('What genre/style of lyrics would you like to create?')} />
            <SubBanner.Message text={t('You can choose or add only one.')} />
            <SelectItem
              // subTitle={t('Popular Tags')}
              setter={setLyricData}
              objKey="lyric_genre"
              selected={lyricData?.lyric_genre}
              preset={genrePreset}
              className="sub-banner__genre"
              placeholder={t('You can also enter your desired genre manually.')}
            />
          </SubBanner>

          <SubBanner>
            <SelectItemInputOnly
              value={lyricStory}
              setter={setLyricStory}
              title={t('Do you have your own story for the lyrics?')}
              placeholder={t('Feel free to share your ideas!')}
            />
          </SubBanner>

          <div className="create__btn">
            {/* <div className="button-wrap__left">필요 시 Skip 버튼</div> */}

            <button
              className={`create__get-started--button ${
                !isRequiredFieldsFilled || loading ? 'disabled' : ''
              }`}
              onClick={handleGenerateLyrics}
              disabled={!isRequiredFieldsFilled || loading}
            >
              {loading ? t('Loading') : t('Go to Edit Lyrics')}
            </button>

            {loading && <CreateLoading textTrue2={true} />}
          </div>
        </SelectItemWrap>
      </div>
    );
  else
    return (
      // 가사 생성후 수정 모드 createdLyrics 있을때
      <div ref={generatedLyricsRef} className="create__lyric-lab">
        <SelectItemWrap
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          icon={createdLyrics ? lyricsEdit : lyricsCreate}
          title={
            createdLyrics
              ? t('You can click the lyrics to edit them.')
              : t(`I'm a lyrics-generating AI!`)
          }
          description={
            createdLyrics
              ? t(
                  `Use the generated lyrics as-is or customize them as you like.
You can generate a melody based on the edited lyrics.`
                )
              : t(
                  `Shall we start by creating song lyrics?
Create your own lyrics based on a special story`
                )
          }
        >
          <div className="generated-lyrics__download-buttons">
            <button
              className="generated-lyrics__download-buttons--button"
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([createdLyrics], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = 'lyrics.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              {t('Download as text (.txt)')} (.txt)
            </button>
            <button
              className="generated-lyrics__download-buttons--button"
              onClick={() => {
                // 가사 언어에 따라 pdf 생성 방식을 분기합니다.
                if (selectedLanguage === 'KOR') {
                  // 한글일 경우 커스텀 pdf 생성 함수 호출
                  generateKoreanPdf(createdLyrics);
                } else {
                  // 영어 등 다른 언어의 경우 기존 로직 사용
                  const doc = new jsPDF();
                  const lines = doc.splitTextToSize(createdLyrics, 180);
                  doc.text(lines, 10, 10);
                  doc.save('lyrics.pdf');
                }
              }}
            >
              {t('Download as PDF (.pdf)')}
            </button>
          </div>
          {/* <h2>{t('Generated Lyrics')}</h2> */}
          {/* {mode === 'read' && <pre className="generated-lyrics__lyrics">{createdLyrics}</pre>} */}
          {mode === 'edit' && (
            <pre className="generated-lyrics__lyrics">
              <textarea
                className="generated-lyrics__lyrics"
                value={createdLyrics}
                // onChange={(e) => setCreatedLyrics(e.target.value)}
                onChange={e => {
                  // 입력된 텍스트가 비어있을 경우 최소 한 줄의 공백을 유지하도록 설정
                  const newText = e.target.value.trim() === '' ? '\n' : e.target.value;
                  setCreatedLyrics(newText);
                }}
                onKeyDown={e => {
                  // 엔터키를 눌렀을 때 화면이 내려가는 것을 방지
                  if (e.key === 'Enter') {
                    const currentScroll = e.target.scrollTop;
                    setTimeout(() => {
                      e.target.scrollTop = currentScroll; // 화면 스크롤 픽스
                    }, 0);
                  }
                }}
              />
            </pre>
          )}
          <div className="generated-lyrics__confirm-buttons">
            {selectedVersion !== 'V4_5' && (
              <p
                className={`generated-lyrics__confirm-buttons--text ${
                  createdLyrics?.length > 1000 ? 'disabled' : ''
                }`}
              >
                {t('Lyrics Length')} : {createdLyrics?.length} / 1000
              </p>
            )}

            {/* <button
              className={`generated-lyrics__confirm-buttons--button confirm ${
                selectedVersion !== 'V4_5' && createdLyrics?.length > 1000 ? 'disabled' : ''
              }`}
              disabled={selectedVersion !== 'V4_5' && createdLyrics?.length > 1000}
              onClick={() => {
                setGeneratedLyric(createdLyrics);
                setPageNumber(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {t('CONFIRM')}
            </button> */}
            <div className="create__btn">
              <button
                className={`create__get-started--button ${
                  selectedVersion !== 'V4_5' && createdLyrics?.length > 1000 ? 'disabled' : ''
                }`}
                disabled={selectedVersion !== 'V4_5' && createdLyrics?.length > 1000}
                onClick={() => {
                  setGeneratedLyric(createdLyrics);
                  setPageNumber(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {t('Go to Melody Creation')}
              </button>
            </div>

            {/* <div className="generated-lyrics__confirm-buttons--button-wrap">
              <button
                className="generated-lyrics__confirm-buttons--button edit"
                onClick={() => setMode(prev => (prev === 'edit' ? 'read' : 'edit'))}
              >
                {t('EDIT')}
              </button>
            </div> */}
          </div>
        </SelectItemWrap>
      </div>
    );
};

export default LyricsLab;
