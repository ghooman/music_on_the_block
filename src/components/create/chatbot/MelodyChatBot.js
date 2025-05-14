// components/create/chatbot/MelodyChatBot.js
import '../../../styles/ChatBot.scss';
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';
import CreateLoading from '../../CreateLoading';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import { useUserDetail } from '../../../hooks/useUserDetail';
import LyricsModal from '../../LyricsModal';
import SubBanner from '../../create/SubBanner';
import defaultCoverImg from '../../../assets/images/header/logo.svg';
import mobProfilerImg from '../../../assets/images/mob-profile-img01.svg';
import subBg1 from '../../../assets/images/create/subbanner-bg1.png';
// 언어별 리소스 파일 불러오기
import koMelody from '../../../locales/koMelody';
import enMelody from '../../../locales/enMelody';
const MelodyChatBot = ({
  createLoading,
  setCreateLoading,
  lyricData,
  lyricStory,
  generatedLyric,
  setGeneratedLyric,
  setPageNumber,
  melodyData,
  setMelodyData,
  selectedLanguage, // "KOR" 또는 "ENG"
  albumCover,
  setAlbumCover,
  finalPrompt,
  setFinalPrompt,
  selectedVersion,
}) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { token } = useContext(AuthContext);
  const { data: userData } = useUserDetail();
  const navigate = useNavigate();
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  // 선택된 언어에 따라 리소스 파일 선택
  const locale = selectedLanguage === 'ENG' ? enMelody : koMelody;
  const {
    melody_tag = [],
    melody_genre = '',
    melody_gender = '',
    melody_instrument = [],
    melody_tempo = '',
    melody_detail = '',
    melody_title = '',
  } = melodyData || {};

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

  // 장르 변환 함수 (한글/영어 -> 영어 대문자)
  const convertGenreToPreset = genre => {
    if (!genre) return '';

    // 1. 이미 genrePreset 키와 일치하는 경우
    if (genrePreset[genre.toUpperCase()]) {
      return genre.toUpperCase();
    }

    // 2. 한글 장르를 영어로 매핑
    const genreMapping = {
      케이팝: 'K-POP',
      '케이-팝': 'K-POP',
      '케이 팝': 'K-POP',
      팝: 'POP',
      팝송: 'POP',
      발라드: 'BALLAD',
      알앤비: 'R&B',
      알엔비: 'R&B',
      '알 앤 비': 'R&B',
      소울: 'SOUL',
      힙합: 'HIP-HOP',
      '힙-합': 'HIP-HOP',
      '힙 합': 'HIP-HOP',
      랩: 'RAP',
      록: 'ROCK',
      락: 'ROCK',
      메탈: 'METAL',
      포크: 'FOLK',
      블루스: 'BLUES',
      컨트리: 'COUNTRY',
      이디엠: 'EDM',
      클래식: 'CLASSICAL',
      레게: 'REGGAE',
    };

    const mappedGenre = genreMapping[genre];
    if (mappedGenre) {
      return mappedGenre;
    }

    // 3. 매핑되지 않은 경우 원본 대문자 반환
    return genre.toUpperCase() || genre;
  };

  // ======= 유저 대화용 챗봇 =======
  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: locale.chatbot.initialMessage },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // OpenAI 클라이언트 초기화
  const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // 예시: getChatResponse 함수 내에서 프롬프트 관련 내용을 각각의 상태로 저장하는 부분
  async function getChatResponse() {
    setLoading(true);
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: locale.chatbot.systemMessage,
          },
          ...chatHistory,
          { role: 'user', content: userInput },
        ],
      });
      let botMessage = response.choices[0].message.content;
      botMessage = botMessage.replace(/\*\*/g, '');

      // 디버깅을 위한 로그 추가
      console.log('Bot message:', botMessage);

      // 프롬프트/생성 키워드가 포함되어 있는지 확인
      const hasPromptKeyword = /(?:최종 프롬프트|프롬프트|생성|Final Prompt|Prompt|generate)/i.test(
        botMessage
      );
      console.log('Contains prompt keyword:', hasPromptKeyword);

      if (hasPromptKeyword) {
        console.log('Attempting to extract from prompt format...');
      }

      // [태그 추출]
      if (locale.extraction.tagRegex.test(botMessage)) {
        const tagMatch = botMessage.match(locale.extraction.tagRegex);
        console.log('Tag match (standard):', tagMatch);
        if (tagMatch && tagMatch[1]) {
          const extractedTags = tagMatch[1]
            .trim()
            .split(',')
            .map(tag => tag.trim());
          console.log('Extracted tags (standard):', extractedTags);
          setMelodyData(prevData => ({
            ...prevData,
            melody_tag: extractedTags,
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 태그 추출
      else if (
        locale.extraction.promptTagRegex &&
        locale.extraction.promptTagRegex.test(botMessage)
      ) {
        const tagMatch = botMessage.match(locale.extraction.promptTagRegex);
        console.log('Tag match (prompt):', tagMatch);
        if (tagMatch && tagMatch[1]) {
          const extractedTags = tagMatch[1]
            .trim()
            .split(',')
            .map(tag => tag.trim());
          console.log('Extracted tags (prompt):', extractedTags);
          setMelodyData(prevData => ({
            ...prevData,
            melody_tag: extractedTags,
          }));
        }
      }

      // [곡의 타이틀 추출]
      if (locale.extraction.titleRegex.test(botMessage)) {
        const titleMatch = botMessage.match(locale.extraction.titleRegex);
        console.log('Title match (standard):', titleMatch);
        if (titleMatch && titleMatch[1]) {
          console.log('Extracted title (standard):', titleMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_title: titleMatch[1].trim(),
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 타이틀 추출
      else if (
        locale.extraction.promptTitleRegex &&
        locale.extraction.promptTitleRegex.test(botMessage)
      ) {
        const titleMatch = botMessage.match(locale.extraction.promptTitleRegex);
        console.log('Title match (prompt):', titleMatch);
        if (titleMatch && titleMatch[1]) {
          console.log('Extracted title (prompt):', titleMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_title: titleMatch[1].trim(),
          }));
        }
      }

      // [장르 추출]
      if (locale.extraction.genreRegex.test(botMessage)) {
        const genreMatch = botMessage.match(locale.extraction.genreRegex);
        console.log('Genre match (standard):', genreMatch);
        if (genreMatch && genreMatch[1]) {
          console.log('Extracted genre (standard):', genreMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_genre: genreMatch[1].trim(),
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 장르 추출
      else if (
        locale.extraction.promptGenreRegex &&
        locale.extraction.promptGenreRegex.test(botMessage)
      ) {
        const genreMatch = botMessage.match(locale.extraction.promptGenreRegex);
        console.log('Genre match (prompt):', genreMatch);
        if (genreMatch && genreMatch[1]) {
          console.log('Extracted genre (prompt):', genreMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_genre: genreMatch[1].trim(),
          }));
        }
      }

      // [보이스 추출]
      if (locale.extraction.voiceRegex.test(botMessage)) {
        const voiceMatch = botMessage.match(locale.extraction.voiceRegex);
        console.log('Voice match (standard):', voiceMatch);
        if (voiceMatch && voiceMatch[1]) {
          console.log('Extracted voice (standard):', voiceMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_gender: voiceMatch[1].trim(),
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 보이스 추출
      else if (
        locale.extraction.promptVoiceRegex &&
        locale.extraction.promptVoiceRegex.test(botMessage)
      ) {
        const voiceMatch = botMessage.match(locale.extraction.promptVoiceRegex);
        console.log('Voice match (prompt):', voiceMatch);
        if (voiceMatch && voiceMatch[1]) {
          console.log('Extracted voice (prompt):', voiceMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_gender: voiceMatch[1].trim(),
          }));
        }
      }

      // [악기 추출]
      // 영어의 경우 'Instruments ('를 사용하도록 업데이트합니다.
      if (locale.extraction.instrumentRegex.test(botMessage)) {
        const instrumentMatch = botMessage.match(locale.extraction.instrumentRegex);
        console.log('Instrument match (standard):', instrumentMatch);
        console.log('Full message:', botMessage);

        if (instrumentMatch && instrumentMatch[1]) {
          const instrumentStr = instrumentMatch[1].trim();
          // 괄호 안의 내용만 추출하는 패턴을 추가
          const bracketsMatch = instrumentStr.match(/\((.*?)\)/);
          const instrumentArray = bracketsMatch
            ? bracketsMatch[1].split(/,\s*/).map(item => item.trim())
            : instrumentStr.split(/,\s*/).map(item => item.trim());

          console.log('Extracted instruments (standard):', instrumentArray);
          setMelodyData(prevData => ({
            ...prevData,
            melody_instrument: instrumentArray,
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 악기 추출
      else if (
        locale.extraction.promptInstrumentRegex &&
        locale.extraction.promptInstrumentRegex.test(botMessage)
      ) {
        const instrumentMatch = botMessage.match(locale.extraction.promptInstrumentRegex);
        console.log('Instrument match (prompt):', instrumentMatch);
        console.log('Full message for prompt match:', botMessage);

        if (instrumentMatch && instrumentMatch[1]) {
          const instrumentStr = instrumentMatch[1].trim();
          // 괄호 안의 내용만 추출하는 패턴을 추가
          const bracketsMatch = instrumentStr.match(/\((.*?)\)/);
          const instrumentArray = bracketsMatch
            ? bracketsMatch[1].split(/,\s*/).map(item => item.trim())
            : instrumentStr.split(/,\s*/).map(item => item.trim());

          console.log('Extracted instruments (prompt):', instrumentArray);
          setMelodyData(prevData => ({
            ...prevData,
            melody_instrument: instrumentArray,
          }));
        }
      } else {
        // 직접 악기 부분을 찾는 시도
        console.log('Trying direct instrument extraction');
        const directMatch =
          botMessage.match(/악기\s*\(([\s\S]*?)\)/i) ||
          botMessage.match(/Instruments\s*\(([\s\S]*?)\)/i);

        if (directMatch && directMatch[1]) {
          const instrumentArray = directMatch[1].split(/,\s*/).map(item => item.trim());
          console.log('Direct instrument extraction:', instrumentArray);
          setMelodyData(prevData => ({
            ...prevData,
            melody_instrument: instrumentArray,
          }));
        }
      }

      // [템포 추출]
      if (locale.extraction.tempoRegex.test(botMessage)) {
        const tempoMatch = botMessage.match(locale.extraction.tempoRegex);
        console.log('Tempo match (standard):', tempoMatch);
        if (tempoMatch && tempoMatch[1]) {
          console.log('Extracted tempo (standard):', tempoMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_tempo: tempoMatch[1].trim(),
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 템포 추출
      else if (
        locale.extraction.promptTempoRegex &&
        locale.extraction.promptTempoRegex.test(botMessage)
      ) {
        const tempoMatch = botMessage.match(locale.extraction.promptTempoRegex);
        console.log('Tempo match (prompt):', tempoMatch);
        if (tempoMatch && tempoMatch[1]) {
          console.log('Extracted tempo (prompt):', tempoMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_tempo: tempoMatch[1].trim(),
          }));
        }
      }

      // [추가 요소/스토리 추출]
      if (locale.extraction.detailRegex.test(botMessage)) {
        const detailMatch = botMessage.match(locale.extraction.detailRegex);
        console.log('Detail match (standard):', detailMatch);
        if (detailMatch && detailMatch[1]) {
          console.log('Extracted detail (standard):', detailMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_detail: detailMatch[1].trim(),
          }));
        }
      }
      // 프롬프트나 생성 키워드가 포함된 경우의 추가 요소/스토리 추출
      else if (
        locale.extraction.promptDetailRegex &&
        locale.extraction.promptDetailRegex.test(botMessage)
      ) {
        const detailMatch = botMessage.match(locale.extraction.promptDetailRegex);
        console.log('Detail match (prompt):', detailMatch);
        if (detailMatch && detailMatch[1]) {
          console.log('Extracted detail (prompt):', detailMatch[1].trim());
          setMelodyData(prevData => ({
            ...prevData,
            melody_detail: detailMatch[1].trim(),
          }));
        }
      }

      // 추출 결과 종합 로그
      console.log('Extraction complete. Current melody data:', melodyData);

      setChatHistory(prevHistory => [...prevHistory, { role: 'assistant', content: botMessage }]);
      console.log('response', response);
    } catch (error) {
      console.error('Error fetching chat response:', error);
    } finally {
      setLoading(false);
    }
  }

  // 사용자 입력 처리
  const handleUserInput = e => {
    setUserInput(e.target.value);
  };

  // 사용자 메시지 전송 처리
  const handleSendMessage = () => {
    if (userInput.trim()) {
      setChatHistory(prevHistory => [...prevHistory, { role: 'user', content: userInput }]);
      getChatResponse();
      setUserInput('');
    }
  };

  // Enter 키 이벤트 처리
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 최종 프롬프트 변형 함수
  // gpt를 이용하여서 데이터를 받고 "예시 형식으로 프롬프트를 전환합니다."

  const generateFinalPrompt = async () => {
    try {
      // Genre를 대문자로 변환 (genrePreset 기반)
      const standardizedGenre = convertGenreToPreset(melody_genre);
      const instrumentsString = Array.isArray(melody_instrument)
        ? melody_instrument.join(', ')
        : melody_instrument;

      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that converts music metadata into a concise English prompt. Take the provided music metadata and create a single natural-sounding sentence that describes the song, similar to: "A male and female duet pop song at 140 BPM, inspired by themes of travel. Featuring instruments such as violin, cello, flute, trumpet, and synthesizer." Your response MUST be less than 200 characters total.`,
          },
          {
            role: 'user',
            content: `Create a concise English prompt based on these music parameters:\n            - Title: ${melody_title}\n            - Tags: ${melody_tag.join(
              ', '
            )}\n            - Genre: ${standardizedGenre}\n            - Voice/Gender: ${melody_gender}\n            - Instruments: ${instrumentsString}\n            - Tempo: ${melody_tempo} BPM\n            - Additional Details: ${melody_detail}`,
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
      const standardizedGenre = convertGenreToPreset(melody_genre);
      const basicPrompt =
        `A ${melody_gender.toLowerCase()} ${standardizedGenre} song at ${melody_tempo} BPM with ${melody_instrument}.`.substring(
          0,
          200
        );
      setFinalPrompt(basicPrompt);
      return basicPrompt;
    }
  };
  // ====== 앨범 커버 생성 함수 (앨범 커버 URL 반환) ======
  // 앨범커버프롬프트

  const generateAlbumCover = async () => {
    try {
      const instrumentsString = Array.isArray(melody_instrument)
        ? melody_instrument.join(', ')
        : melody_instrument;

      const response = await client.images.generate({
        model: 'dall-e-3',
        prompt: `
        [멜로디 데이터]
        타이틀: ${melody_title}
        태그: ${melody_tag.join(', ')}
        장르: ${melody_genre}
        성별: ${melody_gender}
        악기: ${instrumentsString}
        템포: ${melody_tempo}

        [노래 스토리]
        ${lyricStory}
        
        [디자인 요청]
        앨범 커버 디자인 : 
        - 위에 태그 또는 장르, 스토리가 있을 경우 그에 대한 디자인 요소를 포함할 것.
        - 태그가 없을 경우, 일반적인 감정이나 주제를 반영한 디자인을 생성할 것.
        - 주인공 및 스토리 요소 ("${lyricStory}")를 강조하여, 캐릭터와 분위기를 구체적으로 묘사할 것.
        - 타이틀("${melody_title}")을 강조하여, 타이틀을 포함한 디자인을 생성할 것.
        - 멜로디 태그("${melody_tag.join(', ')}")가 있을 경우 그에 대한 디자인 요소를 포함할 것.
        - 멜로디 장르("${melody_genre}")가 있을 경우 그에 대한 디자인 요소를 포함할 것.
        - 멜로디 세부 사항("${melody_detail}")이 있을 경우 그에 대한 디자인 요소를 포함할 것.
      `,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });
      console.log('prompt', prompt);
      console.log('generateAlbumCover:', response.data);
      const cover = response.data[0].url;
      setAlbumCover(cover);
      return cover;
    } catch (error) {
      console.error('앨범 커버 생성 오류:', error);
      return null;
    }
  };

  // ====== 음악 생성 함수 ========
  // localStorage에 앨범 id와 title 만료 시각을 저장하는 함수 (15분)
  const albumIdStorageKey = 'generatedAlbumId';
  const storeAlbumId = (id, title) => {
    const expires = Date.now() + 15 * 60 * 1000; // 15분 후
    localStorage.setItem(albumIdStorageKey, JSON.stringify({ id, title, expires }));
  };

  // musicGenerate 함수 수정: generatedPrompt 인자를 받도록 변경
  const musicGenerate = async (coverUrl, generatedPrompt) => {
    const standardizedGenre = convertGenreToPreset(melody_genre);

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

    try {
      const formData = {
        album: {
          title: melody_title,
          detail: melody_detail,
          language: selectedLanguage,
          genre: standardizedGenre,
          style: '',
          gender: melody_gender,
          musical_instrument: Array.isArray(melody_instrument)
            ? melody_instrument.join(', ')
            : melody_instrument,
          ai_service: 1,
          ai_service_type: '',
          tempo: parseInt(melody_tempo),
          song_length: '',
          lyrics: generatedLyric,
          mood: '',
          tags: melody_tag?.join(', ') || '',
          cover_image: coverUrl,
          prompt: generatedPrompt,
          create_ai_type: create_ai_type,
          ai_model: ai_model,
        },
        album_lyrics_info: {
          language: selectedLanguage,
          feelings: '',
          genre: '',
          style: lyricData?.lyric_stylistic || '',
          form: lyricData?.lyric_tag ? lyricData.lyric_tag.join(', ') : '',
          my_story: lyricStory,
        },
      };
      console.log('formData being sent:', formData);
      const res = await axios.post(`${serverApi}/api/music/v2/album/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': 'f47d348dc08d492492a7a5d546d40f4a',
          'Content-Type': 'application/json',
        },
      });

      storeAlbumId(res.data.id, res.data.title);
      console.log('handleSubmit success:', res);
      navigate(`/`);
    } catch (err) {
      console.error('handleSubmit error', err);
    } finally {
      // setLoading(false) in handleGenerateSong should handle this
    }
  };

  // ====== Generate Song 버튼 클릭 핸들러 ======
  const handleGenerateSong = async () => {
    setCreateLoading(true);
    try {
      // 최종 프롬프트 생성하고 결과 받기
      const generatedPrompt = await generateFinalPrompt();

      // 앨범 커버 생성 후 URL 반환
      const cover = await generateAlbumCover();
      if (cover) {
        // 생성된 cover와 prompt를 인자로 전달하여 musicGenerate 함수 호출
        await musicGenerate(cover, generatedPrompt);
      } else {
        console.error('앨범 커버 생성에 실패하였습니다.');
      }
    } catch (error) {
      console.error('Error during song generation process:', error);
    } finally {
      setCreateLoading(false);
    }
  };
  // 생성 버튼 허용 여부 Melody Title 값이 있을 경우 통과
  const isGenerateButtonDisabled =
    melodyData?.melody_title === '' || melodyData?.melody_title?.length === 0;

  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(prev => !prev);
  };

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatHistory, loading]);
  return (
    <div className="chatbot__background">
      {createLoading && <CreateLoading />}
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
      <section className="chatbot">
        <div className="chatbot__header">
          <h2>Melody Maker</h2>
        </div>
        <div className="chatbot__messages" ref={scrollContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message__content">
                <img
                  src={
                    msg.role === 'assistant' ? mobProfilerImg : userData?.profile || defaultCoverImg
                  }
                  alt="profile"
                />
                <p className="message__content--text">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="message bot">Loading...</div>}
        </div>
        <div className="chatbot__textarea">
          <textarea
            type="text"
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
        </div>
        <button className="chatbot__button" onClick={handleSendMessage}>
          Send
        </button>
      </section>
      <section className={`music__information ${isActive ? 'active' : ''}`}>
        <div className="music__information__header" onClick={handleToggle}>
          <h2>Music Information</h2>
        </div>
        <div className="music__information__tags">
          <h3>Melody Tags</h3>
          <input
            type="text"
            value={melodyData?.melody_tag}
            placeholder="Enter tags separated by commas"
            readOnly
          />
        </div>
        <div className="music__information__genre">
          <h3>Melody Title</h3>
          <input type="text" value={melodyData?.melody_title} placeholder="Enter" readOnly />
        </div>
        <div className="music__information__genre">
          <h3>Melody Genre</h3>
          <input type="text" value={melodyData?.melody_genre} placeholder="Enter" readOnly />
        </div>
        <div className="music__information__gender">
          <h3>Melody Gender</h3>
          <input type="text" value={melodyData?.melody_gender} placeholder="Enter" readOnly />
        </div>
        <div className="music__information__instrument">
          <h3>Melody Instrument</h3>
          <input
            type="text"
            value={
              Array.isArray(melodyData?.melody_instrument)
                ? melodyData?.melody_instrument.join(', ')
                : melodyData?.melody_instrument
            }
            placeholder="Enter"
            readOnly
          />
        </div>
        <div className="music__information__tempo">
          <h3>Melody Tempo</h3>
          <input type="text" value={melodyData?.melody_tempo} placeholder="Enter" readOnly />
        </div>
        <div className="music__information__detail">
          <h3>Melody Detail</h3>
          <input type="text" value={melodyData?.melody_detail} placeholder="Enter" readOnly />
        </div>
      </section>
      <div className="music__information__buttons">
        <button
          className={`music__information__button ${isGenerateButtonDisabled ? 'disabled' : ''}`}
          onClick={handleGenerateSong}
          disabled={isGenerateButtonDisabled} // 버튼 비활성화 조건 추가
        >
          Generate Song
        </button>
      </div>
      {showLyricsModal && (
        <LyricsModal setShowLyricsModal={setShowLyricsModal} generatedLyric={generatedLyric} />
      )}
    </div>
  );
};

export default MelodyChatBot;
