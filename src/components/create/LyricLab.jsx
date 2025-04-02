import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import jsPDF from 'jspdf';

import SubBanner from './SubBanner';
import { SelectItem, SelectItemWrap, SelectItemInputOnly } from './SelectItem';

import subBg2 from '../../assets/images/create/subbanner-bg2.png';

import './LyricLab.scss';
import ExpandedButton from './ExpandedButton';
import CreateLoading from '../CreateLoading';

const tagPreset = {
    Love: ['passionate', 'romantic', 'tender', 'endearing', 'devoted'],
    Trable: ['chaotic', 'turbulent', 'unsettling', 'difficult', 'hectic'],
    Winter: ['frosty', 'chilly', 'serene', 'crisp', 'snowy'],
};

const genrePreset = {
    POP: ['POP'],
    Ballad: ['Ballad'],
    'R&B': ['R&B'],
    Rock: ['Rock'],
};

const stylePreset = {
    Happy: ['Happy'],
    Sad: ['Sad'],
    Excitement: ['Excitement'],
    Passionate: ['Passionate'],
};

const stylisticPreset = {
    Poetic: ['Poetic'],
    Emotional: ['Emotional'],
    Bold: ['Bold'],
    Soft: ['Soft'],
};

// OpenAI 클라이언트 초기화
const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // .env 파일 등에 저장된 API 키 사용
    dangerouslyAllowBrowser: true,
});

const LyricLab = ({
    selectedLanguage,
    setSelectedLanguage,
    setLyricData,
    lylicData,
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
}) => {
    const [loading, setLoading] = useState(false);
    const [createdLyrics, setCreatedLyrics] = useState(generatedLyric || '');
    const [mode, setMode] = useState('read');

    const instructions = `// system-prompt-example.txt

  You are a professional songwriter and lyricist. 
  Your task is to create original song lyrics based on the user’s instructions. 
  Output only the lyrics themselves without any additional text such as introductions, conclusions, or remarks like “Sure!” or “Hope you like it!”. 
  
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
     - Do not include any introduction, conclusion, or filler text like “Sure!” or “Hope you like it!”.
     - Provide only the requested lyrics in the specified structure.
  
  6. Appropriateness
     - Avoid using explicit or offensive language unless explicitly requested by the user.
     - Ensure the final lyrics are well-formatted, with clear section labels and line breaks.
  
  Your overall goal is to deliver engaging, well-structured song lyrics that align with the user’s request, without any extra commentary.
  
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
        (lylicData?.lyric_tag && lylicData.lyric_tag.length > 0) ||
        (lylicData?.lyric_genre && lylicData.lyric_genre.length > 0 && lylicData.lyric_genre[0].trim() !== '') ||
        (lylicData?.lyric_style && lylicData.lyric_style.length > 0 && lylicData.lyric_style[0].trim() !== '') ||
        (lylicData?.lyric_stylistic &&
            lylicData.lyric_stylistic.length > 0 &&
            lylicData.lyric_stylistic[0].trim() !== '') ||
        (lyricStory && lyricStory.trim() !== '');

    // console.log('lylicData', lylicData);
    // 지피티4o API 호출 함수
    async function callGPT4oResponses() {
        try {
            setLoading(true);
            const response = await client.responses.create({
                model: 'gpt-4o-mini',
                instructions,
                input: `출력원하는언어:${selectedLanguage},
        느낌:${lylicData?.lyric_tag.join(',')},
                 장르:${lylicData?.lyric_genre.join(',')},
                 스타일:${lylicData?.lyric_style.join(',')},
                 양식:${lylicData?.lyric_stylistic.join(',')},
                 추가적인 나의 이야기:${lyricStory}
                `,
            });
            console.log('GPT Responses API 응답:', response.output_text);
            setCreatedLyrics(response.output_text);
        } catch (error) {
            console.error('Responses API 호출 중 오류 발생:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // 가사 생성완료 되었을 경우 스크롤 이동
    useEffect(() => {
        if (createdLyrics && generatedLyricsRef.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // generatedLyricsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [createdLyrics]);

    // 텍스트 파일(.txt) 다운로드 함수
    const downloadTxtFile = () => {
        const element = document.createElement('a');
        const file = new Blob([createdLyrics], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'lyrics.txt'; // 저장될 파일명
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // PDF 파일 다운로드 함수
    const downloadPdfFile = () => {
        const doc = new jsPDF();
        // 긴 텍스트의 경우, 자동으로 줄바꿈을 적용합니다.
        const lines = doc.splitTextToSize(createdLyrics, 180);
        doc.text(lines, 10, 10);
        doc.save('lyrics.pdf'); // 저장될 파일명
    };

    if (!createdLyrics)
        return (
            <div className="create__lyric-lab">
                <SelectItemWrap selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}>
                    <SelectItem
                        mainTitle="Selet a Tags"
                        subTitle="Popular Tags"
                        setter={setLyricData}
                        objKey="lyric_tag"
                        selected={lylicData?.lyric_tag}
                        preset={tagPreset}
                        multiple
                    />
                    <SelectItem
                        mainTitle="Select a Genre"
                        subTitle="Popular Genre"
                        setter={setLyricData}
                        objKey="lyric_genre"
                        selected={lylicData?.lyric_genre}
                        preset={genrePreset}
                    />
                    <SelectItem
                        mainTitle="Select a Style"
                        subTitle="Popular Style"
                        setter={setLyricData}
                        objKey="lyric_style"
                        selected={lylicData?.lyric_style}
                        preset={stylePreset}
                        multiple
                        add
                    />
                    <SelectItem
                        mainTitle="Select a Stylistic"
                        subTitle="Popular Stylistic"
                        setter={setLyricData}
                        objKey="lyric_stylistic"
                        selected={lylicData?.lyric_stylistic}
                        preset={stylisticPreset}
                        multiple
                        add
                    />
                    <SelectItemInputOnly value={lyricStory} setter={setLyricStory} title="Your Story" />
                </SelectItemWrap>
                <SubBanner>
                    <SubBanner.LeftImages src={subBg2} />
                    <SubBanner.Title text="What happens if I skip a step?" />
                    <SubBanner.Message text="You can choose to skip any step and still create a meaningful result. Complete both steps for a full song (lyrics + composition), or focus on just one to highlight your strengths." />
                    <SubBanner.SubMessage text="Skipped steps won’t affect your ability to create. Your result will adapt to the completed sections." />
                </SubBanner>

                <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {isLyricPage && (
                        <SelectedWrap title="Lyric Lab">
                            <SelectedItem title="Tags" value={lylicData?.lyric_tag} multiple />
                            <SelectedItem title="Genre" value={lylicData?.lyric_genre} />
                            <SelectedItem title="Style" value={lylicData?.lyric_style} />
                            <SelectedItem title="Stylistic" value={lylicData?.lyric_stylistic} />
                        </SelectedWrap>
                    )}
                </div>
                {/* =========================================================================== */}
                {/* =================================== 넥스트 버튼 ======================================== */}
                {/* =========================================================================== */}

                <div className="button-wrap">
                    <div className="button-wrap__left">
                        {/* <ExpandedButton className="skip" onClick={onSkip}>
              Skip
            </ExpandedButton> */}
                    </div>
                    <ExpandedButton
                        className={!isAnyFieldFilled || loading ? 'next' : 'next enable'}
                        onClick={() => {
                            callGPT4oResponses();
                        }}
                        disabled={!isAnyFieldFilled || loading}
                    >
                        {loading ? 'Loading' : 'Generate'}
                    </ExpandedButton>
                    {loading && <CreateLoading />}
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
                            onChange={(e) => setCreatedLyrics(e.target.value)}
                        />
                    </pre>
                )}
                <div className="generated-lyrics__confirm-buttons">
                    <ExpandedButton
                        className="generated-lyrics__confirm-buttons--button edit"
                        onClick={() =>
                            setMode((prev) => {
                                if (prev === 'edit') return 'read';
                                else return 'edit';
                            })
                        }
                    >
                        EDIT
                    </ExpandedButton>
                    <ExpandedButton
                        className="generated-lyrics__confirm-buttons--button confirm"
                        onClick={() => {
                            setGeneratedLyric(createdLyrics);
                            setPageNumber((prev) => prev + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        CONFIRM
                    </ExpandedButton>
                </div>
                <div className="generated-lyrics__download-buttons">
                    <ExpandedButton
                        className="generated-lyrics__download-buttons--button txt"
                        onClick={downloadTxtFile}
                    >
                        Download as text (.txt)
                    </ExpandedButton>
                    <ExpandedButton
                        className="generated-lyrics__download-buttons--button pdf"
                        onClick={downloadPdfFile}
                    >
                        Download as pdf (.pdf)
                    </ExpandedButton>
                </div>
            </div>
        );
};
export default LyricLab;
