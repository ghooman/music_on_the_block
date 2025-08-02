import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpenAI from 'openai';

import { AuthContext } from '../../contexts/AuthContext';
import lyricPrompts from '../../locales/lyricPrompts';
import { badwords } from '../../data/badwords';
import ErrorModal from '../modal/ErrorModal';

// img
import freeModeIcon from '../../assets/images/icons/freemode-icon.svg';
import closeIcon from '../../assets/images/close.svg';
import plusIcon from '../../assets/images/icons/plus-icon.svg';
// style
import './FreeForm.scss';

// OpenAI 클라이언트 초기화
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function FreeForm({ selectedVersion, selectedPrivacy, selectedCreationMode }) {
  const { token } = useContext(AuthContext);
  const serverAPI = process.env.REACT_APP_CREATE_SERVER_API;

  const navigate = useNavigate();

  // 프롬프트 입력
  const [promptText, setPromptText] = useState('');
  // 이미지 상태
  const [coverImageUrl, setCoverImageUrl] = useState('');
  // 음악 생성용 최종 프롬프트
  const [finalPrompt, setFinalPrompt] = useState('');

  // -------------가사 모달 ----------------------------------------------------------------------
  // Modal open/close 상태
  const [isCustomLyricsModal, setIsCustomLyricsModal] = useState(false);
  // Custom Lyrics 입력
  const [lyrics, setLyrics] = useState('');
  // Custom Lyrics 저장 여부
  const [isLyricsSaved, setIsLyricsSaved] = useState(false);
  // Custom Lyrics 저장 후 다시 눌렀을 때 편집 가능 여부
  const [isEditing, setIsEditing] = useState(true);

  // localStorage에 앨범 id와 title 만료 시각을 저장하는 함수 (15분) 알람모달에서 사용
  // 서버(소켓) 에서 노래 생성 정보를 유저 전체한테 보내주는데 자신이 만든 노래인지 확인후 해당유저만 알람을 보여주게 하기위해
  const albumIdStorageKey = 'generatedAlbumId';
  const storeAlbumId = (id, title) => {
    const expires = Date.now() + 15 * 60 * 1000; // 15분 후
    localStorage.setItem(albumIdStorageKey, JSON.stringify({ id, title, expires }));
  };

  // ✨ 가사 자동 생성 함수
  const generateLyricsFromPrompt = async (promptText, language = 'KOR') => {
    const systemPrompt =
      lyricPrompts.chatbot.systemMessages[language] || lyricPrompts.chatbot.systemMessages.KOR;

    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText },
        ],
        model: 'gpt-4o',
        temperature: 0.7,
      });

      const generated = chatCompletion.choices?.[0]?.message?.content || '';
      return generated.trim();
    } catch (error) {
      console.error('[❌ 가사 생성 실패]', error);
      return null;
    }
  };

  // 앨범 커버 프롬프트 생성 함수
  const getAlbumCoverPrompt = ({ finalPrompt }) => {
    return `
  Create a realistic and emotionally resonant album cover based on the following theme:
  "${finalPrompt}"
  
  [Visual Prompt for Album Cover Generation]
  
  Realistic, Emotionally Resonant Album Cover
  
  Create a naturalistic, grounded illustration inspired by the song’s overall tone, story, and emotion.
  It should feel like a real-life moment — subtle, intimate, and deeply human — not a fantasy or stylized poster.
  
  Interpretation Guidelines:
  – Understand the emotional core (joy, longing, sorrow, hope, etc.)
  – Ask: What is the song really about? A relationship, place, or memory?
  – Depict a concrete scene — e.g., someone by a window, a farewell at a train station, a solo walk at dawn
  – Avoid abstract or symbolic imagery; use real places, people, and natural gestures
  
  Visual Direction:
  – Choose realistic indoor or outdoor settings (cafe, beach, street, bedroom)
  – Use natural light, weather, time of day, and background elements to tell the story
  – Focus on expression and posture for character-driven songs
  – Use wider, quiet shots for songs about place or mood
  
  Styling Notes:
  – Soft, painterly or photographic style — emotional, not dramatic
  – Color palette should reflect the song’s tone (warm for comfort, cool for solitude, muted for nostalgia)
  – No surrealism, fantasy, typography, or heroic poses
  
  Goal:
  The artwork should feel like a real memory — subtle, beautiful, and emotionally true — complementing the music without overpowering it.
  
  ⚠️ Do NOT include any text, letters, or graphic elements like logos or typography. The image should be purely visual and narrative-driven.
    `;
  };

  // 앨범 커버 생성 함수
  const generateAlbumCover = async finalPrompt => {
    const prompt = getAlbumCoverPrompt(finalPrompt);
    try {
      const response = await client.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      const imageUrl = response.data[0].url;
      console.log('[🖼️ 앨범 커버 URL]', imageUrl);
      setCoverImageUrl(imageUrl); // 결과 저장
      return imageUrl;
    } catch (err) {
      console.error('[❌ 앨범 커버 생성 실패]', err);
      return null;
    }
  };

  // 최종 생성 함수
  const generateFinalPrompt = async () => {
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content:
              'You are an AI assistant that helps convert user prompts into music metadata. Return a natural-sounding English prompt for AI music creation.',
          },
          {
            role: 'user',
            content: promptText,
          },
        ],
      });

      const prompt = response.choices[0].message.content.trim().replace(/\n/g, ' ');
      console.log('[✅ Final Prompt]', prompt);
      setFinalPrompt(prompt); // 결과 저장
      return prompt;
    } catch (err) {
      console.error('[❌ Final Prompt 생성 실패]', err);
      return promptText;
    }
  };

  // selectedVersion 에따라 create_ai_type 과 ai_model 구성
  let create_ai_type = '';
  let ai_model = '';
  switch (selectedVersion) {
    case 'topmediai':
      create_ai_type = 'topmediai';
      ai_model = '';
      break;
    case 'mureka-5.5':
      create_ai_type = 'mureka';
      ai_model = 'mureka-5.5';
      break;
    case 'mureka-6':
      create_ai_type = 'mureka';
      ai_model = 'mureka-6';
      break;
    case 'V3.5':
      create_ai_type = 'suno';
      ai_model = 'V3.5';
      break;
    case 'suno-V4':
      create_ai_type = 'suno';
      ai_model = 'V4';
      break;
    case 'V4_5':
      create_ai_type = 'suno';
      ai_model = 'V4_5';
      break;
    default:
      create_ai_type = 'topmediai';
      ai_model = '';
      break;
  }

  // 음악 요소들(제목, 키워드, 장르, etc...) 생성 함수
  const generateMusicMetadata = async promptText => {
    const systemPrompt = `
  당신은 AI 음악 제작 보조 도우미입니다.
  사용자가 입력한 자유 주제에 가장 어울리는 아래 항목들만 JSON 형식으로 추천해주세요.
  
  {
    "title": "",
    "detail": "",
    "language": "",
    "genre": "",
    "gender": "",
    "musical_instrument": "",
    "tags": ""
  }
  
  출력은 반드시 JSON 형식으로 해주세요.
  
  사용자 입력: "${promptText}"
    `;

    try {
      const res = await client.chat.completions.create({
        model: 'gpt-4',
        temperature: 0.8,
        messages: [{ role: 'system', content: systemPrompt }],
      });

      const content = res.choices[0].message.content;
      const jsonString = content.slice(content.indexOf('{'), content.lastIndexOf('}') + 1);
      const parsed = JSON.parse(jsonString);
      console.log('[🎛️ 메타데이터 추출]', parsed);
      return parsed;
    } catch (err) {
      console.error('❌ 메타데이터 생성 실패', err);
      return null;
    }
  };

  // 음악 생성 함수
  const musicGenerate = async finalLyrics => {
    try {
      //   setLoading(true); // 로딩 상태 표시 (추가 가능)

      const formData = {
        album: {
          title: promptText.slice(0, 30),
          detail: '', // 상세 설명 비워도 문자열이면 OK
          language: 'English',
          genre: 'Pop',
          style: 'Modern',
          gender: 'Mixed',
          musical_instrument: 'Synth',
          ai_service: selectedCreationMode === 'bgm' ? 0 : 1,
          ai_service_type: 'suno',
          tempo: 120,
          song_length: '2min',
          lyrics: finalLyrics.trim() || '',
          mood: 'Happy',
          tags: 'AI, Music, FreeForm',
          cover_image: coverImageUrl,
          prompt: finalPrompt,
          is_release: selectedPrivacy === 'release',
          create_ai_type: 'suno',
          ai_model: selectedVersion || 'V4_5',
          introduction: 'This song was created with AI inspiration.',
        },
        album_lyrics_info: {
          language: 'English',
          feelings: 'Joy',
          genre: 'Pop',
          style: 'Modern',
          form: 'Free',
          my_story: '',
        },
      };

      const res = await axios.post(`${serverAPI}/api/music/v2/album/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // AuthContext에서 받아온 토큰
          'Content-Type': 'application/json',
        },
      });

      console.log('[🎵 생성 성공]', res.data);
      return res;
    } catch (err) {
      console.error('[❌ 음악 생성 실패]', err);
      alert('음악 생성 중 오류가 발생했습니다.');
      return null;
    } finally {
      //   setLoading(false);
    }
  };

  // 로직 확인 함수
  const handleMusicCreation = async () => {
    console.log('[🎯 START] Music creation triggered');
    console.log('Prompt Text:', promptText);
    console.log('Custom Lyrics:', lyrics.trim() ? lyrics : '(no lyrics)');

    let finalLyrics = lyrics;

    // 1. 자동 가사 생성 조건
    if (!lyrics.trim()) {
      console.log('[✍️ 자동 가사 생성 시작]');
      finalLyrics = await generateLyricsFromPrompt(promptText);
      if (!finalLyrics) {
        console.error('❌ 가사 생성 실패');
        return;
      }
      setLyrics(finalLyrics);
      setIsLyricsSaved(true);
      setIsEditing(false);
    }

    console.log('[🎼 최종 가사 출력]');
    console.log(finalLyrics);

    const final = await generateFinalPrompt();
    setFinalPrompt(final);
    console.log('[📦 최종 프롬프트]', final);

    const imageUrl = await generateAlbumCover(final);
    setCoverImageUrl(imageUrl);
    console.log('[🖼️ 최종 앨범 커버 URL]', imageUrl);

    const response = await musicGenerate(finalLyrics);

    // ✅ localStorage에 저장하는 함수!
    if (response && response.data && response.data.id) {
      storeAlbumId(response.data.id, response.data.title); // 15분 저장
      alert('음악이 성공적으로 생성되었습니다!');
      navigate('/'); // 홈으로 이동
    } else {
      console.error('❌ 앨범 생성 실패');
      alert('음악 생성 중 오류가 발생했습니다.');
    }
  };

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
            onClick={handleMusicCreation}
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
