// components/MelodyMaker.jsx
import './MelodyMaker.scss';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpenAI from 'openai';
import SubBanner from './SubBanner';

import melodyMaker from '../../assets/images/icons/melody-maker-icon.svg';

import {
  SelectItem,
  SelectItemTempo,
  SelectItemWrap,
  SelectItemInputOnly,
  SelectItemIntroInputOnly,
  TitleInputOnly,
} from './SelectItem';
import ExpandedButton from './ExpandedButton';
import CompleteModal from './../SingUpCompleteModal';
import subBg1 from '../../assets/images/create/subbanner-bg1.png';
import subBg2 from '../../assets/images/create/subbanner-bg2.png';
import CreateLoading from '../CreateLoading';
import { AuthContext } from '../../contexts/AuthContext';
import { RemainCountButton } from '../unit/RemainCountButton';
import LyricsModal from '../LyricsModal';
import { useTranslation } from 'react-i18next';

const tagPreset = {
  Love: ['Love'],
  Moon: ['Moon'],
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

const genderPreset = {
  Male: ['Male'],
  Female: ['Female'],
  // 'Mixed Gender': ['Mixed Gender'],
  // 'Male Group': ['Male Group'],
  // 'Female Group': ['Female Group'],
  // 'Mixed Gender Group': ['Mixed Gender Group'],
};

const instrumentPreset = {
  Guitar: ['Guitar'],
  Piano: ['Piano'],
  Drums: ['Drums'],
  Bass: ['Bass'],
  Violin: ['Violin'],
  Cello: ['Cello'],
  Flute: ['Flute'],
  Trumpet: ['Trumpet'],
  Harp: ['Harp'],
  Synthesizer: ['Synthesizer'],
};

// OpenAI 클라이언트 초기화
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // .env 파일 등에 저장된 API 키 사용
  dangerouslyAllowBrowser: true,
});

// localStorage에 앨범 id와 title 만료 시각을 저장하는 함수 (15분) 알람모달에서 사용
// 서버(소켓) 에서 노래 생성 정보를 유저 전체한테 보내주는데 자신이 만든 노래인지 확인후 해당유저만 알람을 보여주게 하기위해
const albumIdStorageKey = 'generatedAlbumId';
const storeAlbumId = (id, title) => {
  const expires = Date.now() + 15 * 60 * 1000; // 15분 후
  localStorage.setItem(albumIdStorageKey, JSON.stringify({ id, title, expires }));
};

// ──────────────────────────
// 프리뷰 문자열의 각 라인에서 콜론(:) 뒤의 값에만 스타일을 적용하는 컴포넌트
// 수노 외 프롬프트 제한길이 (200자) 때문에 길이체크를 유저에게 보여주기 위해 존재하는 기능
const StyledPromptPreview = ({ previewText, valueColor = '#cf0' }) => {
  // 줄바꿈을 기준으로 각 라인을 분리하고 빈 줄은 제거
  const lines = previewText.split('\n').filter(line => line.trim() !== '');
  return (
    <div className="styled-prompt-preview">
      {lines.map((line, index) => {
        // 첫 번째 콜론을 기준으로 왼쪽은 라벨, 오른쪽은 값
        const [label, ...rest] = line.split(':');
        const value = rest.join(':');
        return (
          <p key={index}>
            {label}:<span style={{ color: valueColor }}>{value}</span>
          </p>
        );
      })}
    </div>
  );
};
// ──────────────────────────

// 앨범 커버 프롬프트 생성 함수
const generateAlbumCoverPrompt = ({ melodyTitle, melodyTag, melodyGenre, fullLyrics }) => {
  return `
[Song Metadata]
- Title: ${melodyTitle}
- Genre: ${melodyGenre.join(', ')}
- Tags: ${melodyTag.join(', ')}
- Lyrics: ${fullLyrics}

[Visual Prompt for Album Cover Generation]

Generate a single, natural-sounding English sentence that instructs an AI to design an album cover illustration.  
The sentence should be based on the song’s title, genre, tags, and lyrics, and describe a moment or feeling in a cinematic and emotionally expressive way.  
Adjust the wording to match the song’s tone — whether warm, nostalgic, vibrant, dreamy, or melancholic — while keeping the style grounded and story-driven.

Key Instructions:
– Focus on a **main character or characters**, expressing the emotion or action in the lyrics  
– Show a **clear situation or moment**, not just an abstract or symbolic representation  
– If possible, depict an actual **interaction, memory, or inner emotion** of the subject  
– The **background** should support the scene, but not overpower the narrative

Styling Notes:
– Use soft, natural lighting with realistic human expressions  
– Favor close-up or mid-shot compositions that highlight facial expressions or gestures  
– The color palette should match the emotion (e.g., warm for nostalgia, cool for loneliness, vibrant for excitement)  
– Avoid surreal or overly symbolic styles — aim for a grounded, story-driven visual  
– Think of it like a key frame from a movie scene

⚠️ Do NOT include any text, letters, or graphic elements like logos or typography. The image should be purely visual and narrative-driven.
  `;
};

const MelodyMaker = ({
  lyricData,
  lyricStory,
  melodyData,
  setMelodyData,
  melodyDetail,
  setMelodyDetail,
  tempo,
  setTempo,
  generatedLyric,
  setGeneratedLyric,
  generatedMusicResult,
  setGeneratedMusicResult,
  setPageNumber,
  onSkip,
  SelectedWrap,
  SelectedItem,
  isMelodyPage,
  selectedLanguage,
  setSelectedLanguage,
  createPossibleCount,
  albumCover,
  setAlbumCover,
  finalPrompt,
  setFinalPrompt,
  selectedVersion,
  selectedPrivacy,
  selectedCreationMode,
}) => {
  const { melody_tag, melody_genre, melody_gender, melody_instrument, melody_introduction } =
    melodyData || {};
  const serverApi = process.env.REACT_APP_CREATE_SERVER_API;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  // 타이틀은 무조건 필수이며, 추가 필드 중 하나 이상이 채워져야 하는 조건
  const isTitleFilled = title && title.trim() !== '';
  // 유효성 곡생성 되는 활성화 조건들 (필요시 추가 나 삭제)
  const isAdditionalFieldFilled =
    (melody_tag && melody_tag.length > 0) ||
    (melody_genre && melody_genre.length > 0 && melody_genre[0].trim() !== '') ||
    (melody_gender && melody_gender.length > 0 && melody_gender[0].trim() !== '') ||
    (melody_instrument && melody_instrument.length > 0 && melody_instrument[0].trim() !== '') ||
    (melodyDetail && melodyDetail.trim() !== '');

  // 최종적으로 타이틀이 채워져있고, 추가 필드 중 최소 한 개 이상 채워진 경우에만 폼이 유효함
  const isFormValid = isTitleFilled && isAdditionalFieldFilled;

  const promptPreview = `
      Language : ${selectedLanguage},
      ${melody_tag ? 'Tags : ' + melody_tag.join(', ') : ''}
      ${melody_genre ? 'Genre : ' + melody_genre.join(', ') : ''}
      ${melody_gender ? 'Gender : ' + melody_gender.join(', ') : ''} 
      ${melody_instrument ? 'Instrument : ' + melody_instrument.join(', ') : ''}
      Tempo : ${tempo},
      ${melodyDetail ? 'Detail : ' + melodyDetail + ',' : ''}
      ${
        melody_introduction && melody_introduction.length > 0
          ? 'Introduction : ' + melody_introduction + ','
          : ''
      }
      `;
  // 함수: promptPreview에서 밸류 부분(콜론(:) 다음의 텍스트만)을 추출하여 하나의 문자열로 만듭니다.
  function extractValues(str) {
    return str
      .split('\n') // 줄 단위로 분리
      .map(line => {
        // 줄의 콜론(:) 위치를 찾음
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          // 콜론 이후의 문자열이 밸류 부분입니다.
          return line.substring(colonIndex + 1).trim();
        }
        return '';
      })
      .filter(value => value.length > 0) // 빈 문자열 제거
      .join(''); // 모든 밸류를 하나의 문자열로 합침
  }

  // 밸류만 추출하여 새로운 문자열 생성
  const valuesOnly = extractValues(promptPreview);

  // console.log("valuesOnly:", valuesOnly);
  // console.log("valuesOnly length:", valuesOnly.length);

  const sunoPrompt = `장르 : ${melody_genre?.[0] || '임의의 장르'},
    태그 : ${melody_tag?.[0] || '임의의 태그'},
    성별 : ${melody_gender?.[0] || '임의의 성별'},
    악기 : ${melody_instrument?.[0] || '임의의 악기'},
    템포 : ${tempo},
    세부 설명 : ${melodyDetail || '없음'},
  `;

  // 앨범 커버 생성 함수
  const generateAlbumCover = async () => {
    console.log('=== 앨범 커버 생성 디버그 ===');
    console.log('melodyTitle:', title);
    console.log('melodyTag:', melodyData?.melody_tag);
    console.log('melodyGenre:', melodyData?.melody_genre);
    console.log('fullLyrics (generatedLyric):', generatedLyric);

    // 커버 생성 관련 프롬프트 요청 변수
    const refinedPrompt = generateAlbumCoverPrompt({
      melodyTitle: title || '',
      melodyTag: melodyData?.melody_tag || [],
      melodyGenre: melodyData?.melody_genre || [],
      fullLyrics: generatedLyric || '',
    });

    // gpt(dall-e-3) 달리모델에게 이미지 생성 부탁
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: refinedPrompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });
    console.log('generateAlbumCover:', response.data);
    return response.data[0].url;
  };

  // 최종 프롬프트 생성 함수 gpt 에 요청해서 노래 생성 할때 보내는 prompt 에 적절한 답을 요청하고 그걸 받아서 서버에 보냅니다.
  const generateFinalPrompt = async () => {
    try {
      // V4_5인지 여부에 따라 시스템 메시지를 분기
      const isV4_5 = selectedVersion === 'V4_5';
      // V4_5 (수노) 일경우 프롬프트 를 자연스럽게만 수정 시키게하고 아닐 경우 형식을 고정 시켜서 글자길이를 최대 200자 이내로 강제로 만들어서 프롬프트를 수정시킵니다
      const systemPrompt = isV4_5
        ? 'You are an AI assistant that transforms music metadata into an English sentence. Based on the provided metadata, create a natural-sounding sentence that describes the song'
        : `You are an AI assistant that converts music metadata into a concise English prompt. Take the provided music metadata and create a single natural-sounding sentence that describes the song, similar to: "A male and female duet pop song at 140 BPM, inspired by themes of travel. Featuring instruments such as violin, cello, flute, trumpet, and synthesizer." Your response MUST be less than 200 characters total.`;

      // 사용자 메시지(메타데이터)
      const userContent = `Create a concise English prompt based on these music parameters:
  - Title: ${title}
  - Tags: ${melody_tag?.join(', ') || ''}
  - Genre: ${(melody_genre?.[0] || '').toUpperCase()}
  - Voice/Gender: ${melody_gender?.[0] || ''}
  - Instruments: ${melody_instrument?.join(', ') || ''}
  - Tempo: ${tempo} BPM
  - Additional Details: ${melodyDetail || ''}
  - Introduction: ${melody_introduction || ''}`;

      // OpenAI 호출
      const response = await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      });

      let promptText = response.choices[0].message.content.trim();

      if (!isV4_5) {
        // V4_5가 아닐 때만 200자 초과 시 잘라내기
        if (promptText.length > 200) {
          promptText = promptText.substring(0, 197) + '...';
        }
      }

      // 1. 전처리: 줄바꿈 제거한 상태로 한 줄로 만듦
      promptText = promptText.replace(/\n/g, ' ').trim();

      // // 2. 첫 번째 블록만 사용 (사용자 프롬프트 내용)
      // promptText = parts[0];

      // 공통: 불필요한 문구 제거
      promptText = promptText
        .replace(/['"]\s*입니다\.\s*이대로\s*곡을\s*생성하시겠습니까\s*[?]?\s*$/i, '')
        .replace(/입니다\.\s*이대로\s*곡을\s*생성하시겠습니까\s*[?]?\s*$/i, '')
        .replace(/\s*혹시\s*더\s*수정하거나\s*추가하실\s*내용이\s*있나요[?]?\s*$/i, '')
        .replace(
          /(혹시\s*.*|이제\s*.*|도와드릴게요.*|시작해볼까요.*|기대해\s*주세요.*|진행할게요.*)/gi,
          ''
        );

      // 3. 결과 확인
      console.log('[promptText]', promptText);

      setFinalPrompt(promptText);
      return promptText;
    } catch (error) {
      console.error('Error generating final prompt:', error);

      // 실패 시 기본 형태로 대체 (여기서는 trimming 없이 간단 문장 반환)
      const basicPrompt = `A ${melody_gender?.[0]?.toLowerCase() || ''} ${(
        melody_genre?.[0] || ''
      ).toUpperCase()} song at ${tempo} BPM with ${melody_instrument?.join(', ') || ''}.`;
      setFinalPrompt(basicPrompt);
      return basicPrompt;
    }
  };
  // 노래 생성 요청 함수 ////
  const musicGenerate = async () => {
    try {
      setLoading(true);

      // 최종 프롬프트 생성 selectedVersion 에따라 분기

      // const finalPrompt = selectedVersion === 'V4_5' ? sunoPrompt : await generateFinalPrompt();
      const finalPrompt = await generateFinalPrompt();

      // 앨범 커버 생성 (앨범 커버가 없는 경우만)
      let coverImageUrl = albumCover;
      if (!coverImageUrl) {
        coverImageUrl = await generateAlbumCover();
        setAlbumCover(coverImageUrl);
      }

      console.log('[🚀 생성 직전 melody_introduction 확인]', melody_introduction);

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
      // API에 전달할 payload 구성
      const formData = {
        album: {
          title: title,
          detail: melodyDetail,
          language: selectedLanguage,
          genre: melody_genre?.[0] || '',
          style: '',
          gender: melody_gender?.[0] || '',
          musical_instrument: melody_instrument?.join(', ') || '',
          ai_service: selectedCreationMode === 'bgm' ? 0 : 1, // bgm 이면 0 , song이면 1
          ai_service_type: '',
          tempo: parseFloat(tempo),
          song_length: '',
          lyrics: generatedLyric,
          mood: '',
          tags: melody_tag ? melody_tag.join(', ') : '',
          cover_image: coverImageUrl,
          prompt: finalPrompt,
          create_ai_type: create_ai_type,
          ai_model: ai_model,
          is_release: selectedPrivacy === 'release' ? true : false,
          introduction: melody_introduction || '',
        },
        album_lyrics_info: {
          language: selectedLanguage,
          feelings: '',
          genre: lyricData?.lyric_genre?.[0] || '',
          form: lyricData?.lyric_tag ? lyricData.lyric_tag.join(', ') : '',
          my_story: lyricStory,
        },
      };
      console.log('formData', formData);
      // axios를 통한 POST 요청
      const url =
        selectedCreationMode === 'song'
          ? `${serverApi}/api/music/v2/album/`
          : `${serverApi}/api/music/v2/album/bgm`;

      const res = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      storeAlbumId(res.data.id, res.data.title);
      setGeneratedMusicResult(res.data);
      console.log('보낸 url', url);
      console.log('handleSubmit', res);
      console.log('storeAlbumId', res.data.id, res.data.title);
      navigate(`/`);
    } catch (err) {
      alert('에러 발생');
      console.error('musicGenerate error', err);
    } finally {
      setLoading(false);
    }
  };
  ///////////
  useEffect(() => {
    if (generatedMusicResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [generatedMusicResult]);

  useEffect(() => {
    if (melody_introduction) {
      console.log('[🎯 melody_introduction 업데이트됨]', melody_introduction);
    }
  }, [melody_introduction]);

  const { t } = useTranslation('song_create');

  console.log(typeof melody_introduction, melody_introduction);

  return (
    <div className="create__melody-maker">
      {/* <SubBanner>
        <SubBanner.RightImages src={subBg1} />
        <SubBanner.Title text={t('View Lyrics Lab Results')} />
        <SubBanner.Message text={t('These lyrics were previously written by AI in Lyrics Lab.')} />
        <SubBanner.Message
          text={t(
            'Based on these lyrics, AI composition is currently in progress in Melody Maker.'
          )}
        />
        <SubBanner.Button
          title={t('View Lyrics')}
          handler={() => {
            setShowLyricsModal(true);
          }}
        ></SubBanner.Button>
      </SubBanner> */}

      {/* <SelectItemWrap currentStep={'isMelodyPage'}> */}
      <SelectItemWrap
        currentStep={'isMelodyPage'}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        icon={melodyMaker}
        title={t('I am a melody generation AI!')}
        description={t(
          `Shall we create the melody and instruments for the song this time?
Choose a genre that fits the lyrics, select the tempo and instruments to complete the song’s sound!`
        )}
      >
        <SubBanner>
          {/* <SubBanner.LeftImages src={subBg2} /> */}
          <SubBanner.Title
            text={t('What kind of mood, emotion, or imagery should the melody express?')}
          />
          <SubBanner.Message text={t('You can select up to 5 tags.')} />
          <SelectItem
            subTitle={t('Popular Tags')}
            setter={setMelodyData}
            objKey="melody_tag"
            selected={melodyData?.melody_tag}
            preset={tagPreset}
            className="sub-banner__tags"
            multiple
            add
            placeholder={t('You can also enter your desired keywords manually.')}
          />
        </SubBanner>

        <SubBanner>
          <SubBanner.Title text={t('What genre of melody would you like to create?')} />
          <SubBanner.Message text={t('You can choose or add only one.')} />
          <SelectItem
            // subTitle={t('Popular Tags')}
            setter={setMelodyData}
            objKey="melody_genre"
            selected={melodyData?.melody_genre}
            preset={genrePreset}
            className="sub-banner__genre"
            placeholder={t('You can also enter your desired genre manually.')}
          />
        </SubBanner>

        <SubBanner>
          <SubBanner.Title text={t('Which instruments would you like to use?')} />
          <SubBanner.Message text={t('You can select up to 5 tags.')} />
          <SelectItem
            mainTitle={t('Instrument')}
            subTitle={t('Instrument Tags')}
            setter={setMelodyData}
            objKey="melody_instrument"
            selected={melody_instrument || []}
            preset={instrumentPreset}
            className="sub-banner__genre"
            multiple
            add
            placeholder={t('You can also enter your desired instruments manually.')}
          />
        </SubBanner>

        {selectedCreationMode === 'song' && (
          <SubBanner>
            <SubBanner.Title text={t('What gender of voice would you like to use?')} />
            <SelectItem
              mainTitle={t('Select a Gender')}
              subTitle={t('Popular Gender')}
              setter={setMelodyData}
              objKey="melody_gender"
              selected={melodyData?.melody_gender}
              preset={genderPreset}
              className="sub-banner__gender"
              // placeholder={t('원하는 악기를 직접 입력할 수 있어요')}
              hideInput={true}
              blockStyle={true}
            />
          </SubBanner>
        )}

        <SubBanner>
          <SubBanner.Title text={t('What tempo (BPM) should the song have?')} />
          <SelectItemTempo tempo={tempo} setTempo={setTempo} />
        </SubBanner>

        <SubBanner>
          <SelectItemInputOnly
            value={melodyDetail}
            setter={setMelodyDetail}
            title={t('Are there any detailed melody elements you want to include?')}
            placeholder={t(
              'Please write any specific elements like wind sounds or vocal pitch changes.'
            )}
          />
        </SubBanner>

        <SubBanner>
          <SubBanner.Title text={t('Please enter the song title.')} />
          <TitleInputOnly
            value={title}
            setter={setTitle}
            placeholder={t('Write a title for this song.')}
          />
        </SubBanner>

        <SubBanner>
          <SelectItemInputOnly
            value={melody_introduction}
            setter={value => setMelodyData(prev => ({ ...prev, melody_introduction: value }))}
            title={t('Please write a description of the song.')}
            placeholder={t('Write an introduction for this song.')}
          />
        </SubBanner>

        {/* <div className="selected-tag-list">
          <div className="selected-tag-list__title">
            <h3>
              {t('Selected Tags')}
              {selectedVersion !== 'V4_5' && '(max_length : 200)'}
            </h3>
            <span>
              {t('Current length')} :{' '}
              <span
                style={{
                  color: selectedVersion !== 'V4_5' && valuesOnly?.length > 200 ? 'red' : 'inherit',
                }}
              >
                {valuesOnly?.length}
              </span>
            </span>
          </div>
          <div className="selected-tag-list__tags">
            <StyledPromptPreview previewText={promptPreview} valueColor="#cf0" />
          </div>
        </div> */}
        {/* <div className="button-wrap">
          <div className="button-wrap__left">
            <button className="back" onClick={() => setPageNumber(prev => prev - 1)}>
              {t('Back')}
            </button>
            <button className="skip" onClick={onSkip} style={{ display: 'none' }}>
              {t('Skip')}
            </button>
          </div>
          <button
            className={
              loading || (!selectedVersion !== 'V4_5' && valuesOnly.length > 200) || !isFormValid
                ? 'next'
                : 'next enable'
            }
            onClick={() => musicGenerate()}
            disabled={
              loading || (selectedVersion !== 'V4_5' && valuesOnly.length > 200) || !isFormValid
            }
          >
            {loading ? t('Loading') : t('Generate')}
          </button>
        </div> */}
        <div className="create__btn">
          <button
            className={`create__get-started--button ${
              loading || (!selectedVersion !== 'V4_5' && valuesOnly.length > 200) || !isFormValid
                ? 'disabled'
                : ''
            }`}
            onClick={() => musicGenerate()}
            disabled={
              loading || (selectedVersion !== 'V4_5' && valuesOnly.length > 200) || !isFormValid
            }
          >
            {loading ? t('Loading') : t('Create your own music')}
          </button>

          {loading && <CreateLoading textTrue />}
        </div>
      </SelectItemWrap>
      {/* <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SelectedWrap title={t('Lyrics Lab')}>
          <SelectedItem title={t('Tags')} value={lyricData?.lyric_tag} multiple />
          <SelectedItem title={t('Genre')} value={lyricData?.lyric_genre} />

          <div className="lyrics-lab__selected-item">
            <p className="lyrics-lab__selected-item--title">{t('Story')}</p>
            <p className="lyrics-lab__selected-item--text">{lyricStory || '-'}</p>
          </div>
        </SelectedWrap>
      </div>
      {isMelodyPage && (
        <SelectedWrap title={t('Melody Maker')}>
          <SelectedItem title={t('Tags')} value={melodyData?.melody_tag} multiple />
          <SelectedItem title={t('Genre')} value={melodyData?.melody_genre} />
          <SelectedItem title={t('Gender')} value={melodyData?.melody_gender} />
          <SelectedItem
            title={
              <>
                {t('Musical')}
                <br />
                {t('Instrument')}
              </>
            }
            value={melodyData?.melody_instrument}
          />
          <SelectedItem title={t('Tempo')} value={tempo} />
        </SelectedWrap>
      )} */}

      {loading && <CreateLoading textTrue />}
      {showLyricsModal && (
        <LyricsModal
          setShowLyricsModal={setShowLyricsModal}
          generatedLyric={generatedLyric}
          onSave={newLyric => setGeneratedLyric(newLyric)} // ← 추가
        />
      )}
    </div>
  );
};

export default MelodyMaker;
