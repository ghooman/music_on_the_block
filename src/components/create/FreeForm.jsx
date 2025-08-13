import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpenAI from 'openai';

import { AuthContext } from '../../contexts/AuthContext';
import lyricPromptsFreeform from '../../locales/lyricPromptsFreeform';
import { badwords } from '../../data/badwords';
import ErrorModal from '../modal/ErrorModal';
import CreateLoading from '../CreateLoading';

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

function FreeForm({
  createMode,
  setCreateMode,
  selectedLanguage,
  setSelectedLanguage,
  selectedVersion,
  selectedPrivacy,
  selectedCreationMode,
}) {
  const { t } = useTranslation('song_create');
  const { token } = useContext(AuthContext);
  const serverAPI = process.env.REACT_APP_CREATE_SERVER_API;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 프롬프트 입력
  const [promptText, setPromptText] = useState('');
  // 커스텀 모드 - 제목
  const [customTitle, setCustomTitle] = useState('');
  // 커스텀 모드 - 음악 스타일 및 디테일
  const [customStyleDetail, setCustomStyleDetail] = useState('');
  // 커스텀 모드 - 가사
  const [customLyrics, setCustomLyrics] = useState('');
  // 이미지 상태
  const [coverImageUrl, setCoverImageUrl] = useState('');
  // 음악 생성용 최종 프롬프트
  const [finalPrompt, setFinalPrompt] = useState('');

  // 커스텀모드 상태
  const [isCustomMode, setIsCustomMode] = useState(false);

  // -------------가사 모달 ----------------------------------------------------------------------
  // Modal open/close 상태
  const [isCustomLyricsModal, setIsCustomLyricsModal] = useState(false);
  // Custom Lyrics 입력
  const [lyrics, setLyrics] = useState('');
  // Custom Lyrics 저장 여부
  const [isLyricsSaved, setIsLyricsSaved] = useState(false);
  // Custom Lyrics 저장 후 다시 눌렀을 때 편집 가능 여부
  const [isEditing, setIsEditing] = useState(true);

  // -------------에러 모달 ------------------------------------------------------------------------
  // 가사 부적절한 단어 포함 시, 에러 모달 띄우기 위함
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // localStorage에 앨범 id와 title 만료 시각을 저장하는 함수 (15분) 알람모달에서 사용
  // 서버(소켓) 에서 노래 생성 정보를 유저 전체한테 보내주는데 자신이 만든 노래인지 확인후 해당유저만 알람을 보여주게 하기위해
  const albumIdStorageKey = 'generatedAlbumId';
  const storeAlbumId = (id, title) => {
    const expires = Date.now() + 15 * 60 * 1000; // 15분 후
    localStorage.setItem(albumIdStorageKey, JSON.stringify({ id, title, expires }));
  };

  // ✨ 가사 자동 생성 함수
  const generateLyricsFromPrompt = async (promptText, selectedLanguage) => {
    const languageAliasMap = {
      Korean: 'KOR',
      English: 'ENG',
      Japanese: 'JPN',
      Chinese: 'CHN',
      Indonesian: 'IDN',
      Vietnamese: 'VIE',
    };

    const shortLangCode = languageAliasMap[selectedLanguage] || 'ENG';
    const systemPrompt =
      lyricPromptsFreeform.systemMessages[selectedLanguage] ||
      lyricPromptsFreeform.systemMessages.ENG;

    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptText },
        ],
        model: 'gpt-4o',
        temperature: 0.7,
      });

      const generated = chatCompletion.choices?.[0]?.message?.content?.trim() || '';

      // ❌ 너무 짧거나 안내 메시지일 경우 실패 처리
      const invalidPhrases = [
        '내용이 너무 짧아서',
        '조금 더 정확하게 알려주세요',
        '더 구체적으로',
        '도와드릴게요',
        '무엇을 원하시나요',
      ];

      if (!generated || generated.length < 20 || invalidPhrases.some(p => generated.includes(p))) {
        console.warn('[⚠️ 가사 생성 실패 문구 감지]', generated);
        return null;
      }

      return generated;
    } catch (error) {
      console.error('[❌ 가사 생성 실패]', error);
      return null;
    }
  };

  // 앨범 커버 프롬프트 생성 함수
  const generateAlbumCoverPrompt = ({
    melodyTitle,
    melodyGenre,
    melodyTag,
    fullLyrics,
    finalPrompt,
  }) => {
    return `
[Song Metadata]
- Title: ${melodyTitle}
- Genre: ${melodyGenre.join(', ')}
- Tags: ${melodyTag.join(', ')}
- Lyrics: ${fullLyrics}
${finalPrompt ? `- User Prompt (Theme): ${finalPrompt}` : ''}
  
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
  const generateAlbumCover = async ({ metadata, fullLyrics, finalPrompt }) => {
    const prompt = generateAlbumCoverPrompt({
      melodyTitle: metadata?.title || '',
      melodyGenre:
        typeof metadata?.genre === 'string' ? metadata.genre.split(',').map(x => x.trim()) : [],
      melodyTag:
        typeof metadata?.tags === 'string' ? metadata.tags.split(',').map(x => x.trim()) : [],
      fullLyrics,
      finalPrompt,
    });

    console.log('📷 생성된 커버 이미지 프롬프트:', prompt);

    try {
      const response = await client.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      const imageUrl = response.data[0]?.url;
      setCoverImageUrl(imageUrl);
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
    case 'V4_5PLUS':
      create_ai_type = 'suno';
      ai_model = 'V4_5PLUS';
      break;
    default:
      create_ai_type = 'topmediai';
      ai_model = '';
      break;
  }

  // 음악 요소들(제목, 키워드, 장르, etc...) 생성 함수
  const generateMusicMetadata = async (promptText, selectedLanguage) => {
    const systemPrompt = `
You are an AI assistant that generates music metadata based on the user's free-form music theme.
Please write all of the following fields according to the selected language. The output **must** be in JSON format.

Requested language: ${selectedLanguage}

Output format example:
{
  "title": "",
  "detail": "",
  "genre": "",               // e.g., Pop, Hip-hop
  "gender": "",              // e.g., only Male or Female
  "musical_instrument": "", // e.g., Piano, Guitar, Synth
  "tempo": "",                // numeric only (BPM), must be between 60 and 120
  "tags": "",                // comma-separated keywords
  "introduction": ""         // a short description of the song
}

User input:
"${promptText}"
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

      // 🎛️ gender 보정
      let validatedGender = parsed.gender?.toLowerCase();
      if (validatedGender === 'male') validatedGender = 'Male';
      else if (validatedGender === 'female') validatedGender = 'Female';

      // 언어별 성별 변환
      const languageAliasMap = {
        Korean: 'KOR',
        English: 'ENG',
        Japanese: 'JPN',
        Chinese: 'CHN',
        Indonesian: 'IDN',
        Vietnamese: 'VIE',
      };
      const shortLangCode = languageAliasMap[selectedLanguage] || 'ENG';

      const genderMap = {
        KOR: { Male: '남성', Female: '여성' },
        ENG: { Male: 'Male', Female: 'Female' },
        JPN: { Male: '男性', Female: '女性' },
        CHN: { Male: '男性', Female: '女性' },
        IDN: { Male: 'Pria', Female: 'Wanita' },
        VIE: { Male: 'Nam', Female: 'Nữ' },
      };

      if (genderMap[shortLangCode] && genderMap[shortLangCode][validatedGender]) {
        parsed.gender = genderMap[shortLangCode][validatedGender];
      }

      const cleaned = {
        ...parsed,
      };

      console.log('[🎛️ 보정된 Metadata]', cleaned);
      return cleaned;
    } catch (err) {
      console.error('❌ Metadata generation failed', err);
      return null;
    }
  };

  // 음악 생성 함수
  const musicGenerate = async (finalLyrics, metadata) => {
    const {
      title,
      detail,
      genre,
      gender,
      musical_instrument,
      tempo,
      tags,
      introduction,
      cover_image,
    } = metadata;

    try {
      setLoading(true);
      const formData = {
        album: {
          title: title,
          detail: detail || '',
          language: selectedLanguage,
          genre: genre || '',
          style: '', // 현재 사용하지 않음!
          gender: gender || '',
          musical_instrument: musical_instrument || '',
          ai_service: selectedCreationMode === 'bgm' ? 0 : 1,
          ai_service_type: '',
          tempo: parseInt(tempo) || 90,
          song_length: '',
          lyrics: finalLyrics.trim() || '',
          mood: '', // 현재 사용하지 않음!
          tags: tags || '',
          cover_image: cover_image,
          prompt: finalPrompt,
          create_ai_type: create_ai_type,
          ai_model: ai_model,
          is_release: selectedPrivacy === 'release' ? true : false,
          introduction: introduction || '',
        },
        album_lyrics_info: {
          language: selectedLanguage,
          feelings: '',
          genre: '',
          form: 'Free',
          my_story: '',
        },
      };

      const url =
        selectedCreationMode === 'song'
          ? `${serverAPI}/api/music/v2/album/`
          : `${serverAPI}/api/music/v2/album/bgm`;

      const res = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[🎵 생성 성공]', res.data);
      return res;
    } catch (err) {
      console.error('[❌ 음악 생성 실패]', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 로직 확인 함수
  const handleMusicCreation = async () => {
    console.log('[🎯 START] Music creation triggered');
    setLoading(true); // ✅ 버튼 클릭 즉시 로딩 시작

    try {
      console.log('Prompt Text:', promptText);
      console.log('Custom Lyrics:', lyrics.trim() ? lyrics : '(no lyrics)');

      // ✍️ 1. 가사 생성 또는 자동 생성
      let finalLyrics = lyrics?.trim();

      // bgm일 경우는 가사 생성 안해도 됨
      if (selectedCreationMode === 'bgm') {
        finalLyrics = '';
      } else if (!finalLyrics) {
        console.log('[✍️ 자동 가사 생성 시작]');
        finalLyrics = await generateLyricsFromPrompt(promptText, selectedLanguage);

        if (!finalLyrics || finalLyrics.trim() === '') {
          console.error('❌ 가사 생성 실패');
          setErrorTitle('Music cannot be generated.');
          setErrorMessage('가사가 생성되지 않았어요. 입력을 조금 더 구체적으로 수정해 주세요.');
          setShowErrorModal(true);
          setLoading(false); // 실패 시 로딩 멈춤
          return;
        }

        setLyrics(finalLyrics);
        setIsLyricsSaved(true);
        setIsEditing(false);
      }

      console.log('[🎼 최종 가사 출력]', finalLyrics);

      // 🚫 2. 비속어 필터 검사
      const hasBadwords = (text = '') => {
        const normalizedText = text.replace(/\s+/g, '').toLowerCase();
        return badwords.some(word => normalizedText.includes(word));
      };

      if (hasBadwords(finalLyrics)) {
        console.error('❌ 부적절한 가사 탐지됨');
        setErrorTitle('Music cannot be generated.');
        setErrorMessage(
          'Inappropriate or offensive words were detected in the lyrics.\nPlease revise the lyrics and try again.'
        );
        setShowErrorModal(true);
        setLoading(false); // 실패 시 로딩 멈춤
        return;
      }

      // 3. 프롬프트 생성
      const final = await generateFinalPrompt();
      setFinalPrompt(final);
      console.log('[📦 최종 프롬프트]', final);

      // 4. 메타데이터 생성
      const metadata = await generateMusicMetadata(promptText, selectedLanguage);
      if (!metadata) {
        console.error('❌ 메타데이터 생성 실패');
        setLoading(false); // 실패 시 로딩 멈춤
        return;
      }
      console.table(metadata);

      // 5. 이미지 생성
      let imageUrl = null;
      let retries = 3;
      let attempt = 0;

      while (!imageUrl && attempt < retries) {
        imageUrl = await generateAlbumCover({
          metadata,
          fullLyrics: finalLyrics,
          finalPrompt: final,
        });

        if (!imageUrl) {
          attempt++;
          console.warn(`🎨 이미지 생성 재시도 (${attempt}/${retries})`);
          if (attempt < retries) {
            await new Promise(res => setTimeout(res, 2000)); // 2초 대기
          }
        }
      }

      if (!imageUrl) {
        console.error('[❌ 최종 이미지 생성 실패]');
        setErrorTitle('Music cannot be generated.');
        setErrorMessage('앨범 커버 이미지 생성에 실패했어요. 다시 시도해 주세요.');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      setCoverImageUrl(imageUrl);
      console.log('[🖼️ 최종 앨범 커버 URL]', imageUrl);

      // 6. 음악 생성
      const response = await musicGenerate(finalLyrics, {
        ...metadata,
        cover_image: imageUrl, // 여기서 직접 전달
      });
      if (response && response.data && response.data.id) {
        storeAlbumId(response.data.id, response.data.title);
        navigate('/');
      }
    } catch (err) {
      console.error('[❌ 음악 생성 도중 에러]', err);
    } finally {
      setLoading(false); // 마지막에 로딩 멈춤
    }
  };

  return (
    <>
      <section className="freeform-section">
        <div className="freeform-section__inner">
          <div className="freeform-section__inner__tit">
            <img src={freeModeIcon} alt="" />
            <h2>{t(`Freeform Music Creation`)}</h2>
            <p>
              <span>{t(`Write a prompt for your music.`)}</span>
            </p>
          </div>
          <div className={`freeform-section__inner__prompt-box ${isCustomMode ? 'is-custom-on' : ''}`}>
            {/* 자유형식 커스텀모드 토글 버튼 */}
            <div className={`custom-toggle ${isCustomMode ? 'is-on' : ''}`}>
              <label class="switch">
                <input type="checkbox" checked={isCustomMode} onChange={e => setIsCustomMode(e.target.checked)}/>
                <span class="slider round" aria-label='Custom Mode Button'></span>
              </label>
              <span className='custom-mode-txt'>{t('Custom Mode')}</span>
            </div>

            {/* 자유형식 기본 모드 (프롬프트 한 번에 입력) */}
            {!isCustomMode && (
              <div className='freeform-section__inner__normal textarea-content'>
                <textarea
                  className="freeform-section__inner__textarea"
                  placeholder={t('Feel free to enter traits, instruments, tempo, gender, and more.')}
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  maxLength={199}>
                </textarea>
                <div className="chat-count">
                  {promptText.length}/199
                </div>
              </div>
            )}

            {/* 자유형식 커스텀 모드 */}
            {isCustomMode && (
              <div className="freeform-section__inner__custom">
                <div className='custom-left'>
                  <div className='textarea-content custom-title'>
                    <label className='custom-tit'>{t('Title')}</label>
                    <input
                        type="text"
                        placeholder={t('Please enter the song title.')}
                        value={customTitle}
                        onChange={e => setCustomTitle(e.target.value)}
                      />
                  </div>
                  <div className='textarea-content'>
                    <label className='custom-tit'>{t('Music Style & Details')}</label>
                    <textarea
                      className="freeform-section__inner__textarea"
                      placeholder={t('Feel free to enter traits, instruments, tempo, gender, and more.')}
                      value={customStyleDetail}
                      onChange={e => setCustomStyleDetail(e.target.value)}
                      maxLength={1000}>
                    </textarea>
                    <div className="chat-count">
                      {customStyleDetail.length}/1000
                    </div>
                  </div>
                </div>
                <div className='custom-right textarea-content'>
                  <label className='custom-tit'>{t('Lyrics')}</label>
                  <textarea
                    className="freeform-section__inner__textarea"
                    placeholder={t('Please enter the desired lyrics.')}
                    value={customLyrics}
                    onChange={e => setCustomLyrics(e.target.value)}
                    maxLength={5000}>
                  </textarea>
                  <div className="chat-count">
                    {customLyrics.length}/5000
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* {selectedCreationMode === 'song' ? (
            <button
              type="button"
              className="btn-lyrics-modal"
              onClick={() => setIsCustomLyricsModal(true)}
            >
              <img src={plusIcon} alt="Plus Icon" />
              <span>{isLyricsSaved ? t('View & edit lyrics') : t('Custom Lyrics')}</span>
            </button>
          ) : (
            ''
          )} */}
        </div>
        {/* 제목, 음악 스타일&디테일, 가사 3항목 모두 1글자라도 입력 시 버튼 활성화 */}
        <div className="btn-full-box">
          <button
            className={`btn-full-primary ${
              promptText.length > 0 ? 'btn-full-primary--active' : 'btn-full-primary--disabled'
            }`}
            disabled={promptText.length === 0}
            onClick={handleMusicCreation}
          >
            {t(`Music Creation`)}
          </button>
          {loading && <CreateLoading textTrue />}
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
              <h3>{t(`Custom Lyrics`)}</h3>
              <button className="btn-close" onClick={() => setIsCustomLyricsModal(false)}>
                <img src={closeIcon} alt="Close" />
              </button>
            </div>

            <textarea
              className="custom-lyrics-modal__box__textarea"
              placeholder={t('Please add your own lyrics.')}
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
                {t(`Edit`)}
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
                {isEditing ? t(`Save`) : t(`Done`)}
              </button>
            )}
          </div>
        </div>
      )}
      {loading && <CreateLoading textTrue />}
      {showErrorModal && (
        <ErrorModal
          title={errorTitle}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}

export default FreeForm;
