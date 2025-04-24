// components/MelodyMaker.jsx
import './MelodyMaker.scss';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpenAI from 'openai';
import SubBanner from './SubBanner';
import { SelectItem, SelectItemTempo, SelectItemWrap, SelectItemInputOnly } from './SelectItem';
import ExpandedButton from './ExpandedButton';
import CompleteModal from './../SingUpCompleteModal';
import subBg1 from '../../assets/images/create/subbanner-bg1.png';
import subBg2 from '../../assets/images/create/subbanner-bg2.png';
import CreateLoading from '../CreateLoading';
import { AuthContext } from '../../contexts/AuthContext';
import { RemainCountButton } from '../unit/RemainCountButton';
import LyricsModal from '../LyricsModal';

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
      
      [노래 스토리]
      ${lyricStory}
      
      [디자인 요청]
      앨범 커버 디자인 : 
      - 위에 태그 또는 장르, 스토리가 있을 경우 그에 대한 디자인 요소를 포함할 것.
      - 태그가 없을 경우, 일반적인 감정이나 주제를 반영한 디자인을 생성할 것.
      - 이미지에는 위의 키워드들을 반영하여, 예를 들어 "${lyric_tag.join(
        ', '
      )}"와 "${lyric_genre.join(', ')}"의 느낌을 표현할 것.
      - 주인공 및 스토리 요소 ("${lyricStory}")를 강조하여, 캐릭터와 분위기를 구체적으로 묘사할 것.
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
}) => {
  const { melody_tag, melody_genre, melody_gender, melody_instrument } = melodyData || {};
  const serverApi = process.env.REACT_APP_SERVER_API;
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
      // Genre를 대문자로 변환
      const standardizedGenre = melody_genre?.[0]?.toUpperCase() || '';

      const response = await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that converts music metadata into a concise English prompt. Take the provided music metadata and create a single natural-sounding sentence that describes the song, similar to: "A male and female duet pop song at 140 BPM, inspired by themes of travel. Featuring instruments such as violin, cello, flute, trumpet, and synthesizer." Your response MUST be less than 200 characters total.`,
          },
          {
            role: 'user',
            content: `Create a concise English prompt based on these music parameters:
            - Title: ${title}
            - Tags: ${melody_tag?.join(', ') || ''}
            - Genre: ${standardizedGenre}
            - Voice/Gender: ${melody_gender?.[0] || ''}
            - Instruments: ${melody_instrument?.join(', ') || ''}
            - Tempo: ${tempo} BPM
            - Additional Details: ${melodyDetail || ''}`,
          },
        ],
      });

      let promptText = response.choices[0].message.content.trim();

      if (promptText.length > 200) {
        promptText = promptText.substring(0, 197) + '...';
      }

      console.log('Generated promptText:', promptText);
      console.log('promptText length:', promptText.length);
      setFinalPrompt(promptText);
      return promptText;
    } catch (error) {
      console.error('Error generating final prompt:', error);
      const standardizedGenre = melody_genre?.[0]?.toUpperCase() || '';
      const basicPrompt = `A ${
        melody_gender?.[0]?.toLowerCase() || ''
      } ${standardizedGenre} song at ${tempo} BPM with ${
        melody_instrument?.join(', ') || ''
      }.`.substring(0, 200);
      setFinalPrompt(basicPrompt);
      return basicPrompt;
    }
  };

  // 노래 생성 요청 함수
  const musicGenerate = async () => {
    try {
      setLoading(true);

      // 최종 프롬프트 생성
      const finalPrompt = await generateFinalPrompt();

      // 앨범 커버 생성 (앨범 커버가 없는 경우만)
      let coverImageUrl = albumCover;
      if (!coverImageUrl) {
        coverImageUrl = await generateAlbumCover();
        setAlbumCover(coverImageUrl);
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
          ai_service: '',
          ai_service_type: '',
          tempo: parseFloat(tempo),
          song_length: '',
          lyrics: generatedLyric,
          mood: '',
          tags: melody_tag ? melody_tag.join(', ') : '',
          cover_image: coverImageUrl,
          prompt: finalPrompt,
        },
        album_lyrics_info: {
          language: selectedLanguage,
          feelings: '',
          genre: lyricData?.lyric_genre?.[0] || '',
          form: lyricData?.lyric_tag ? lyricData.lyric_tag.join(', ') : '',
          my_story: lyricStory,
        },
      };

      // axios를 통한 POST 요청
      const res = await axios.post(`${serverApi}/api/music/album/lyrics`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': 'f47d348dc08d492492a7a5d546d40f4a',
          'Content-Type': 'application/json',
        },
      });

      storeAlbumId(res.data.id, res.data.title);
      setGeneratedMusicResult(res.data);
      console.log('handleSubmit', res);
      console.log('storeAlbumId', res.data.id, res.data.title);
      navigate(`/main`);
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

  return (
    <div className="create__melody-maker">
      <RemainCountButton createPossibleCount={createPossibleCount} />
      <SubBanner>
        <SubBanner.RightImages src={subBg1} />
        <SubBanner.Title text="View Lyrics Lab Results" />
        <SubBanner.Message text="These lyrics were previously written by AI in Lyrics Lab." />
        <SubBanner.Message text="Based on these lyrics, AI composition is currently in progress in Melody Maker." />
        <SubBanner.Button
          title="View Lyrics"
          handler={() => {
            setShowLyricsModal(true);
          }}
        ></SubBanner.Button>
      </SubBanner>

      <SelectItemWrap currentStep={'isMelodyPage'}>
        <SubBanner>
          <SubBanner.LeftImages src={subBg2} />
          <SubBanner.Title text="Select a Tags" />
          <SubBanner.Message text="Please select tags that can express the mood, emotion, and image of the song." />
          <SelectItem
            subTitle="Popular Tags"
            setter={setMelodyData}
            objKey="melody_tag"
            selected={melodyData?.melody_tag}
            preset={tagPreset}
            className="sub-banner__tags"
            multiple
            add
          />
        </SubBanner>
        <SelectItemInputOnly value={title} setter={setTitle} title="Title" />
        <SelectItem
          mainTitle="Select a Genre"
          subTitle="Popular Genre"
          setter={setMelodyData}
          objKey="melody_genre"
          selected={melodyData?.melody_genre}
          preset={genrePreset}
        />
        <SelectItem
          mainTitle="Select a Gender"
          subTitle="Popular Gender"
          setter={setMelodyData}
          objKey="melody_gender"
          selected={melodyData?.melody_gender}
          preset={genderPreset}
        />

        <SelectItem
          mainTitle="Select a Musical Instrument"
          subTitle="Popular Musical Instrument"
          setter={setMelodyData}
          objKey="melody_instrument"
          selected={melodyData?.melody_instrument}
          preset={instrumentPreset}
          multiple
          add
        />
        <SelectItemTempo tempo={tempo} setTempo={setTempo} />
        <SelectItemInputOnly value={melodyDetail} setter={setMelodyDetail} title="Detail" />
        <div className="selected-tag-list">
          <div className="selected-tag-list__title">
            <h3>Selected Tags (max_length : 200)</h3>
            <span>
              current length :{' '}
              <span
                style={{
                  color: valuesOnly?.length > 200 ? 'red' : 'inherit',
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
        <SelectedWrap title="Lyrics Lab">
          <SelectedItem title="Tags" value={lyricData?.lyric_tag} multiple />
          <SelectedItem title="Genre" value={lyricData?.lyric_genre} />

          <div className="lyrics-lab__selected-item">
            <p className="lyrics-lab__selected-item--title">Story</p>
            <p className="lyrics-lab__selected-item--text">{lyricStory || '-'}</p>
          </div>
        </SelectedWrap>
      </div>
      {isMelodyPage && (
        <SelectedWrap title="Melody Maker">
          <SelectedItem title="Tags" value={melodyData?.melody_tag} multiple />
          <SelectedItem title="Genre" value={melodyData?.melody_genre} />
          <SelectedItem title="Gender" value={melodyData?.melody_gender} />
          <SelectedItem
            title={
              <>
                Musical
                <br />
                Instrument
              </>
            }
            value={melodyData?.melody_instrument}
          />
          <SelectedItem title="Tempo" value={tempo} />
        </SelectedWrap>
      )}
      <div className="button-wrap">
        <div className="button-wrap__left">
          <button className="back" onClick={() => setPageNumber(prev => prev - 1)}>
            Back
          </button>
          <button className="skip" onClick={onSkip} style={{ display: 'none' }}>
            Skip
          </button>
        </div>
        <button
          className={loading || valuesOnly.length > 200 || !isFormValid ? 'next' : 'next enable'}
          onClick={() => musicGenerate()}
          disabled={loading || valuesOnly.length > 200 || !isFormValid}
        >
          {loading ? 'Loading' : 'Generate'}
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
