import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import jsPDF from 'jspdf';

import SubBanner from './SubBanner';
import { SelectItem, SelectItemWrap, SelectItemInputOnly } from './SelectItem';

import subBg2 from '../../assets/images/create/subbanner-bg2.png';

import './LyricLab.scss';
import ExpandedButton from './ExpandedButton';
import CreateLoading from '../CreateLoading';
import { RemainCountButton } from '../unit/RemainCountButton';
import { generateKoreanPdf } from '../../utils/pdfGenerator';
const tagPreset = {
  Love: ['Love'],
  Moon: ['Moon'],
  Happy: ['Happy'],
  Sad: ['Sad'],
  Travel: ['Travel'],
  Winter: ['Winter'],
  Cafe: ['Cafe'],
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
  onSkip,
  setPageNumber,
  lyricStory,
  setLyricStory,
  melodyData,
  tempo,
  SelectedWrap,
  SelectedItem,
  isLyricPage,
  createPossibleCount,
  setAlbumCover,
}) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('read');
  // ================ 가사 생성 ================ //
  const [createdLyrics, setCreatedLyrics] = useState(generatedLyric || '');
  const instructions = `// system-prompt-example.txt

  You are a professional songwriter and lyricist. 
  Your task is to create original song lyrics based on the user's instructions. 
  Output only the lyrics themselves without any additional text such as introductions, conclusions, or remarks like "Sure!" or "Hope you like it!".
  
  Follow these rules and guidelines:
  
  1. Structure
     - Organize the lyrics into sections (e.g., Verse, Pre-Chorus, Chorus, Hook, Bridge) as appropriate.
     - Label each section clearly with headings like "Verse 1", "Chorus", "Hook" for readability.
     - If the user specifies a particular structure or number of verses, follow that structure exactly.
  
  2. Genre and Mood
     - The user may provide or imply specific genres (pop, rock, hip-hop, ballad, etc.) or moods (energetic, romantic, melancholic, etc.).
     - If the user does not specify a genre or mood, choose one that best fits the given theme (e.g., love, heartbreak, celebration).
  
  3. Creativity and Originality
     - Provide fresh, creative lyrics without copying existing songs or copyrighted material.
     - Incorporate any user-specified themes, keywords, or stories into the lyrics in a cohesive way.
  
  4. Language and Style
     - If the user specifies a language (e.g., Korean, English), use that language. Otherwise, default to a suitable language.
     - Maintain a coherent narrative or thematic flow throughout the sections.
  
  5. No Extra Text
     - Do not include any introduction, conclusion, or filler text like "Sure!" or "Hope you like it!".
     - Provide only the requested lyrics in the specified structure.
  
  6. Appropriateness
     - Avoid using explicit or offensive language unless explicitly requested by the user.
     - Ensure the final lyrics are well-formatted, with clear section labels and line breaks.
  
  7. Default Simplicity for Insufficient Tags
     - If the user does not select or provide sufficient tags or details, create simple, straightforward lyrics using a basic structure.
  
8. Lyrics Length  
   - The lyrics should be **limited to a maximum of 900 characters including spaces**.

  Your overall goal is to deliver engaging, well-structured song lyrics that align with the user's request, without any extra commentary.
  
`;

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
  const isAnyFieldFilled =
    (lyricData?.lyric_tag && lyricData.lyric_tag.length > 0) ||
    (lyricData?.lyric_genre && lyricData?.lyric_genre.length > 0 && lyricData.lyric_genre !== '') ||
    (lyricStory && lyricStory.trim() !== '');

  // 가사 생성 함수 (로딩 상태 관리는 외부에서 처리)
  const callGPT4oResponses = async () => {
    const response = await client.responses.create({
      model: 'gpt-4.1-nano',
      instructions,
      input: `출력원하는언어:${selectedLanguage},
        느낌:${lyricData?.lyric_tag.join(',')},
        장르:${lyricData?.lyric_genre},
        추가적인 나의 이야기:${lyricStory}
        `,
    });
    console.log('GPT Responses API 응답:', response.output_text);
    if (response.output_text.includes('이 요청에 대한 구체적인 정보가 부족합니다.')) {
      throw new Error('필수 정보가 부족합니다. 모든 항목을 채워주세요.');
    } else {
      setCreatedLyrics(response.output_text);
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

  // 가사 생성 전 단계 UI
  if (!createdLyrics)
    return (
      <div className="create__lyric-lab">
        <RemainCountButton createPossibleCount={createPossibleCount} />
        <SelectItemWrap
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        >
          <SubBanner>
            <SubBanner.LeftImages src={subBg2} />
            <SubBanner.Title text="Select a Tags" />
            <SubBanner.Message text="Please select tags that can express the mood, emotion, and image of the song." />
            <SelectItem
              subTitle="Popular Tags"
              setter={setLyricData}
              objKey="lyric_tag"
              selected={lyricData?.lyric_tag}
              preset={tagPreset}
              className="sub-banner__tags"
              multiple
              add
            />
          </SubBanner>
          <SelectItem
            mainTitle="Select a Genre"
            subTitle="Popular Genre"
            setter={setLyricData}
            objKey="lyric_genre"
            selected={lyricData?.lyric_genre}
            preset={genrePreset}
          />
          <SelectItemInputOnly value={lyricStory} setter={setLyricStory} title="Your Story" />
        </SelectItemWrap>

        <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SelectedWrap title="Lyrics Lab">
            <SelectedItem title="Tags" value={lyricData?.lyric_tag} multiple />
            <SelectedItem title="Genre" value={lyricData?.lyric_genre} />

            <div className="lyrics-lab__selected-item">
              <p className="lyrics-lab__selected-item--title">Your Story</p>
              <p className="lyrics-lab__selected-item--text">{lyricStory || '-'}</p>
            </div>
          </SelectedWrap>
        </div>

        <div className="button-wrap">
          <div className="button-wrap__left">{/* 필요 시 Skip 버튼 */}</div>
          <button
            className={!isAnyFieldFilled || loading ? 'next' : 'next enable'}
            onClick={handleGenerateLyrics}
            disabled={!isAnyFieldFilled || loading}
          >
            {loading ? 'Loading' : 'Generate'}
          </button>
          {loading && <CreateLoading textTrue2={true} />}
        </div>
      </div>
    );
  else
    return (
      <div ref={generatedLyricsRef} className="create__lyric-lab">
        <h2>Generated Lyrics</h2>
        {mode === 'read' && <pre className="generated-lyrics__lyrics">{createdLyrics}</pre>}
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
          <p
            className={`generated-lyrics__confirm-buttons--text ${
              createdLyrics?.length > 1000 ? 'disabled' : ''
            }`}
          >
            Lyrics Length : {createdLyrics?.length} / 1000
          </p>
          <div className="generated-lyrics__confirm-buttons--button-wrap">
            <button
              className="generated-lyrics__confirm-buttons--button edit"
              onClick={() => setMode(prev => (prev === 'edit' ? 'read' : 'edit'))}
            >
              EDIT
            </button>
            <button
              className={`generated-lyrics__confirm-buttons--button confirm ${
                createdLyrics?.length > 1000 ? 'disabled' : ''
              }`}
              disabled={createdLyrics?.length > 1000}
              onClick={() => {
                setGeneratedLyric(createdLyrics);
                setPageNumber(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              CONFIRM
            </button>
          </div>
        </div>
        <div className="generated-lyrics__download-buttons">
          <button
            className="generated-lyrics__download-buttons--button txt"
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
            Download as text (.txt)
          </button>
          <button
            className="generated-lyrics__download-buttons--button pdf"
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
            Download as pdf (.pdf)
          </button>
        </div>
      </div>
    );
};

export default LyricsLab;
