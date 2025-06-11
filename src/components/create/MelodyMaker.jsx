// components/MelodyMaker.jsx
import './MelodyMaker.scss';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpenAI from 'openai';
import SubBanner from './SubBanner';
import {
  SelectItem,
  SelectItemTempo,
  SelectItemWrap,
  SelectItemInputOnly,
  SelectItemIntroInputOnly,
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

// localStorage에 앨범 id와 title 만료 시각을 저장하는 함수 (15분)
const albumIdStorageKey = 'generatedAlbumId';
const storeAlbumId = (id, title) => {
  const expires = Date.now() + 15 * 60 * 1000; // 15분 후
  localStorage.setItem(albumIdStorageKey, JSON.stringify({ id, title, expires }));
};

// ──────────────────────────
// 프리뷰 문자열의 각 라인에서 콜론(:) 뒤의 값에만 스타일을 적용하는 컴포넌트
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
const generateAlbumCoverPrompt = (lyricData, lyricStory) => {
  const { lyric_tag = [], lyric_genre = [] } = lyricData;
  return `
      [가사 데이터]
      태그: ${lyric_tag.join(', ')}
      장르: ${lyric_genre.join(', ')}
      
      [노래 제목]
      ${lyricData?.title}

      [노래 스토리]
      ${lyricStory}
      
      [디자인 요청]
      - 노래 제목이 있을 경우 (${lyricData?.title}) 그 제목을 포함할 것.
      - 주인공 및 스토리 요소 ("${lyricStory}")를 강조하여, 캐릭터와 분위기를 구체적으로 묘사할 것.
      앨범 커버 디자인 : 
      - 위에 태그 또는 장르, 스토리가 있을 경우 그에 대한 디자인 요소를 포함할 것.
      - 태그가 없을 경우, 일반적인 감정이나 주제를 반영한 디자인을 생성할 것.
      - 이미지에는 위의 키워들을 반영하여, 예를 들어 "${lyric_tag.join(
        ', '
      )}"와 "${lyric_genre.join(', ')}"의 느낌을 표현할 것.
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
    const refinedPrompt = generateAlbumCoverPrompt(lyricData, lyricStory);
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

  // 최종 프롬프트 생성 함수
  const generateFinalPrompt = async () => {
    try {
      // V4_5인지 여부에 따라 시스템 메시지를 분기
      const isV4_5 = selectedVersion === 'V4_5';
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

      // 공통: 불필요한 문구 제거
      promptText = promptText
        .replace(/['"]\s*입니다\.\s*이대로\s*곡을\s*생성하시겠습니까\s*[?]?\s*$/i, '')
        .replace(/입니다\.\s*이대로\s*곡을\s*생성하시겠습니까\s*[?]?\s*$/i, '');

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
  // 노래 생성 요청 함수
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
          ai_service: selectedCreationMode === 'bgm' ? 0 : 1,
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

  useEffect(() => {
    if (generatedMusicResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [generatedMusicResult]);

  const { t } = useTranslation('song_create');

  return (
    <div className="create__melody-maker">
      <RemainCountButton createPossibleCount={createPossibleCount} />
      <SubBanner>
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
      </SubBanner>

      <SelectItemWrap currentStep={'isMelodyPage'}>
        <SubBanner>
          <SubBanner.LeftImages src={subBg2} />
          <SubBanner.Title text={t('Select a Tags')} />
          <SubBanner.Message
            text={t(
              'Please select tags that can express the mood, emotion, and image of the song.'
            )}
          />
          <SelectItem
            subTitle={t('Popular Tags')}
            setter={setMelodyData}
            objKey="melody_tag"
            selected={melodyData?.melody_tag}
            preset={tagPreset}
            className="sub-banner__tags"
            multiple
            add
          />
        </SubBanner>
        <SelectItemInputOnly value={title} setter={setTitle} title={t('Title')} />
        <SelectItem
          mainTitle={t('Select a Genre')}
          subTitle={t('Popular Genre')}
          setter={setMelodyData}
          objKey="melody_genre"
          selected={melodyData?.melody_genre}
          preset={genrePreset}
        />
        {selectedCreationMode === 'song' && (
          <SelectItem
            mainTitle={t('Select a Gender')}
            subTitle={t('Popular Gender')}
            setter={setMelodyData}
            objKey="melody_gender"
            selected={melodyData?.melody_gender}
            preset={genderPreset}
          />
        )}
        <SelectItem
          mainTitle={t('Instrument')}
          subTitle={t('Instrument Tags')}
          preset={instrumentPreset}
          setter={setMelodyData}
          objKey="melody_instrument"
          selected={melody_instrument || []}
          multiple={true}
          add={true}
        />
        <SelectItemTempo tempo={tempo} setTempo={setTempo} />
        <SelectItemInputOnly
          value={melodyDetail}
          setter={setMelodyDetail}
          title={t('Music Detail')}
        />
        <SelectItemIntroInputOnly
          value={melody_introduction}
          setter={value => setMelodyData(prev => ({ ...prev, melody_introduction: value }))}
          title={t('Introduction')}
        />
        <div className="selected-tag-list">
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
        </div>
      </SelectItemWrap>
      <div className="mb40" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
      )}
      <div className="button-wrap">
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
      </div>
      {loading && <CreateLoading textTrue />}
      {showLyricsModal && (
        <LyricsModal setShowLyricsModal={setShowLyricsModal} generatedLyric={generatedLyric} />
      )}
    </div>
  );
};

export default MelodyMaker;
