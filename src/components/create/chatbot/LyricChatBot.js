import './LyricChatBot.scss';
import React, { useState, useRef, useEffect } from 'react';

import { useUserDetail } from '../../../hooks/useUserDetail';
import OpenAI from 'openai';
import jsPDF from 'jspdf';
import CreateLoading from '../../CreateLoading';
import { generateKoreanPdf } from '../../../utils/pdfGenerator'; // 한글 pdf저장시 텍스트 안깨지도록 존재하는 함수
import { SelectItem, SelectItemWrap, SelectItemInputOnly } from '../SelectItem';

import defaultCoverImg from '../../../assets/images/header/logo.svg';
import mobProfilerImg from '../../../assets/images/mob-profile-img01.svg';
import lyricsCreate from '../../../assets/images/icons/lyrics-create-icon.svg';
import lyricsEdit from '../../../assets/images/icons/lyrics-edit-icon.svg';
import chatSend from '../../../assets/images/icons/chat_send-icon.svg';

// 통일된 프롬프트 파일 불러오기
import lyricPrompts from '../../../locales/lyricPrompts';
import { useTranslation } from 'react-i18next';
const LyricChatBot = ({
  selectedLanguage,
  setSelectedLanguage,
  createLoading,
  lyricData,
  setLyricData,
  lyricStory,
  setLyricStory,
  generatedLyric,
  setGeneratedLyric,
  setPageNumber,
  selectedVersion,
  isConfirmLyricStatus,
  setIsConfirmLyricStatus,
}) => {
  const { t } = useTranslation('song_create');

  const scrollContainerRef = useRef(null);

  const { data: userData } = useUserDetail();
  const generatedLyricsRef = useRef(null);
  // 선택된 언어에 따라 초기 메시지 선택
  const getInitialMessage = () => {
    return (
      lyricPrompts.chatbot.initialMessage[selectedLanguage] ||
      lyricPrompts.chatbot.initialMessage['ENG']
    );
  };

  // 초기 chatHistory에 봇의 초기 메시지를 추가합니다.
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: getInitialMessage() },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState('edit');

  // 초기 가사 placeholder
  const initialKorLyricPlaceholder = [
    '고양이가 주인공인 밝은 분위기의 가사',
    '이별후 슬픔을 겪고 있는 애잔한 발라드',
    '공부할때 듣기 좋은 노래',
    '친구들과 함께 놀고 싶을때 들으면 좋을 노래',
  ];

  const initialEngLyricPlaceholder = [
    'A cheerful and positive lyric with a cat as the main character',
    'A sad ballad about heartbreak',
    'A song that is good to listen to while studying',
    'A song that is perfect for hanging out with friends',
  ];

  const initialJpnLyricPlaceholder = [
    '猫を主人公とした明るい雰囲気の歌詞',
    '別れ後に悲しみを感じている哀れなバラード',
    '勉強するときに聞くといい歌',
    '友達と一緒に遊ぶときに聞くといい歌',
  ];

  const initialIdnLyricPlaceholder = [
    'Lirik yang menyenangkan dan positif dengan kucing sebagai tokoh utama',
    'Lirik yang menyedihkan tentang patah hati',
    'Lirik yang cocok untuk didengarkan saat belajar',
    'Lirik yang cocok untuk didengarkan saat bersama teman',
  ];

  const initialVieLyricPlaceholder = [
    'Lời bài hát vui vẻ và tích cực với mèo là nhân vật chính',
    'Lời bài hát buồn về tình yêu đã mất',
    'Lời bài hát phù hợp để nghe khi học',
    'Lời bài hát phù hợp để nghe khi vui chơi với bạn bè',
  ];

  // 선택된 언어에 따라서 목록중 랜덤으로 하나
  const initialLyricPlaceholderList = {
    KOR: initialKorLyricPlaceholder[Math.floor(Math.random() * initialKorLyricPlaceholder.length)],
    ENG: initialEngLyricPlaceholder[Math.floor(Math.random() * initialEngLyricPlaceholder.length)],
    JPN: initialJpnLyricPlaceholder[Math.floor(Math.random() * initialJpnLyricPlaceholder.length)],
    IDN: initialIdnLyricPlaceholder[Math.floor(Math.random() * initialIdnLyricPlaceholder.length)],
    VIE: initialVieLyricPlaceholder[Math.floor(Math.random() * initialVieLyricPlaceholder.length)],
  };

  const initialLyricPlaceholder = initialLyricPlaceholderList[selectedLanguage];

  // 에러 메시지가 출력됐는지
  const [hasError, setHasError] = useState(false);

  const [hasStructure, setHasStructure] = useState(false);

  // OpenAI 클라이언트 초기화
  const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  /** 언어별 가사 구조 키워드 */
  const structureKeywords = {
    KOR: ['verse', '코러스', '후렴', '브릿지', '간주', 'interlude'],
    ENG: ['verse', 'chorus', 'hook', 'bridge', 'refrain', 'intro', 'outro'],
    JPN: ['ヴァース', 'コーラス', 'サビ', 'ブリッジ'],
    IDN: ['verse', 'chorus', 'bridge', 'reff'],
    VIE: ['verse', 'điệp khúc', 'chorus', 'bridge'],
  };

  /** 가사에 키워드가 하나라도 포함돼 있는지 검사 */
  const hasLyricStructure = (lyric, langKey) =>
    (structureKeywords[langKey] || []).some(word => new RegExp(`\\b${word}\\b`, 'i').test(lyric));
  /** 에러 메시지인지 판정하는 헬퍼 (컴포넌트 밖) */
  const isLyricError = (msg: string) => {
    const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();

    // 언어별 핵심 키워드만 넣어두면 문장 길이가 바뀌어도 잡아냄
    const snippets = [
      '가사를생성할수없어요', // KOR
      'too short to generate lyrics', // ENG
      '歌詞を作れません', // JPN
      'membuatlirik', // IDN
      'tạolờibàihát', // VIE
    ];

    const n = normalize(msg);
    return snippets.some(snippet => n.includes(snippet));
  };

  async function getChatResponse() {
    setLoading(true);
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content:
              lyricPrompts.chatbot.systemMessages[selectedLanguage] ||
              lyricPrompts.chatbot.systemMessages.ENG,
          },
          ...chatHistory,
          { role: 'user', content: userInput },
        ],
      });
      console.log('response', response);
      let botMessage = response.choices[0].message.content;
      botMessage = botMessage.replace(/\*\*/g, '');
      setHasStructure(hasLyricStructure(botMessage, selectedLanguage));

      // [가사 추출] 예외 경우 제외하고 가사저장
      // const errorMessages = [
      //   'The content is too short to generate lyrics..\nPlease provide a bit more detail!',
      //   '내용이 너무 짧아서 가사를 생성할 수 없어요..\n조금 더 정확하게 알려주세요!',
      //   '内容が短すぎて歌詞を作れません..\nもう少し具体的に教えてください！',
      //   'Isi ceritanya terlalu singkat untuk membuat lirik..\nTolong jelaskan dengan lebih detail!',
      //   'Nội dung quá ngắn để tạo lời bài hát..\nHãy cung cấp thông tin chi tiết hơn nhé!',
      // ];

      // const isErrorMessage = errorMessages.some(errorMsg => botMessage.includes(errorMsg));

      // if (!isErrorMessage) {
      //   setGeneratedLyric(botMessage);
      // }
      const isErrorMessage = isLyricError(botMessage);

      setHasError(isErrorMessage); // 1) 에러 여부 저장
      setGeneratedLyric(
        isErrorMessage
          ? '' // 2) 에러면 가사를 비워서 “잔여 가사” 문제 차단
          : botMessage
      );

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
    if (userInput?.trim()) {
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

  // 생성 버튼 허용 조건: 최종 가사가 비어있지 않고 로딩 중이 아닐 때
  const isGenerateButtonDisabled =
    loading || // 모델 응답 대기 중
    createLoading || // 페이지 전체 로딩 중
    !generatedLyric.trim() || // 가사 비어 있음
    !hasStructure; // Verse, Chorus 등이 없음

  const handleIsStatus = () => {
    setIsConfirmLyricStatus(true); // 가사 확정 플래그
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 화면 맨 위로
  };

  if (!isConfirmLyricStatus)
    return (
      <div className="chatbot__background">
        {createLoading && <CreateLoading />}
        <section className="chatbot chatbot-mode" ref={scrollContainerRef}>
          <SelectItemWrap
            mode="chatbot"
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            icon={isConfirmLyricStatus ? lyricsEdit : lyricsCreate}
            title={
              isConfirmLyricStatus
                ? t('You can click the lyrics to edit them.')
                : t(`I'm a lyrics-generating AI!`)
            }
            description={
              isConfirmLyricStatus
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
            {/* <div className="chatbot__header">
              <h2>{t('Chat bot')}</h2>
            </div> */}
            <div className="chatbot__messages">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="message__content">
                    {/* user가 아닌 경우에만 이미지 보여줌 */}
                    {msg.role !== 'user' && (
                      <div className="message__profile">
                        <img src={lyricsCreate} alt="profile" />
                      </div>
                    )}
                    <pre className="message__content--text">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {/* {loading && <div className="message bot">t('Loading...')</div>} */}
              {loading && (
                <div className="message assistant">
                  <div className="message__content">
                    <div className="message__profile">
                      <img src={lyricsCreate} alt="profile" />
                    </div>
                    <pre className="message__content--text">{t('Typing...')}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="chatbot__input">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              onKeyPress={handleKeyPress}
              // placeholder={initialLyricPlaceholder}
              placeholder={chatHistory.length > 1 ? '' : initialLyricPlaceholder}
            />
          </div> */}
            <div className="chatbot__textarea">
              <textarea
                type="text"
                value={userInput}
                onChange={handleUserInput}
                onKeyPress={handleKeyPress}
                // placeholder={initialLyricPlaceholder}
                placeholder={chatHistory.length > 1 ? '' : initialLyricPlaceholder}
              />
              {/* <button className="chatbot__button" onClick={handleSendMessage}>
                {t('Send')}
              </button> */}
              <img
                src={chatSend}
                alt="chat-send-icon"
                onClick={handleSendMessage}
                className={userInput.trim() ? 'send-icon active' : 'send-icon disabled'}
              />
            </div>
          </SelectItemWrap>
        </section>
        {/* <div className="music__information__buttons">
          <button
            className={`music__information__button ${isGenerateButtonDisabled ? 'disabled' : ''}`}
            disabled={isGenerateButtonDisabled}
            onClick={() => {
              handleIsStatus();
            }}
          >
            {t('Confirm')}
          </button>
        </div> */}
        {/* LyricChatBot.js – 기존 music__information__buttons 블록 교체 */}
        <div className="create__btn">
          <button
            type="button"
            className={`create__get-started--button ${isGenerateButtonDisabled ? 'disabled' : ''}`}
            disabled={isGenerateButtonDisabled}
            onClick={handleIsStatus}
          >
            {t('Go to Edit Lyrics')}
          </button>
          {createLoading && <CreateLoading />}
        </div>
      </div>
    );
  else
    return (
      <div ref={generatedLyricsRef} className="create__lyric-lab">
        <section className="chatbot">
          <SelectItemWrap
            mode="chatbot"
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            icon={isConfirmLyricStatus ? lyricsEdit : lyricsCreate}
            title={
              isConfirmLyricStatus
                ? t('You can click the lyrics to edit them.')
                : t(`I'm a lyrics-generating AI!`)
            }
            description={
              isConfirmLyricStatus
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
                className="generated-lyrics__download-buttons--button txt"
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([generatedLyric], { type: 'text/plain' });
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
                className="generated-lyrics__download-buttons--button pdf"
                onClick={() => {
                  // 가사 언어에 따라 pdf 생성 방식을 분기합니다.
                  if (selectedLanguage === 'KOR') {
                    // 한글일 경우 커스텀 pdf 생성 함수 호출
                    generateKoreanPdf(generatedLyric);
                  } else {
                    // 영어 등 다른 언어의 경우 기존 로직 사용
                    const doc = new jsPDF();
                    const lines = doc.splitTextToSize(generatedLyric, 180);
                    doc.text(lines, 10, 10);
                    doc.save('lyrics.pdf');
                  }
                }}
              >
                {t('Download as PDF (.pdf)')}
              </button>
            </div>
            {/* <h2>{t('Generated Lyrics')}</h2>
        {mode === 'read' && <pre className="generated-lyrics__lyrics">{generatedLyric}</pre>} */}
            {mode === 'edit' && (
              <pre className="generated-lyrics__lyrics">
                <textarea
                  className="generated-lyrics__lyrics"
                  value={generatedLyric}
                  // onChange={(e) => setCreatedLyrics(e.target.value)}
                  onChange={e => {
                    // 입력된 텍스트가 비어있을 경우 최소 한 줄의 공백을 유지하도록 설정
                    const newText = e.target.value.trim() === '' ? '\n' : e.target.value;
                    setGeneratedLyric(newText);
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

            {/* <div className="generated-lyrics__confirm-buttons">
            {selectedVersion !== 'V4_5' && (
              <p
                className={`generated-lyrics__confirm-buttons--text ${
                  selectedVersion !== 'V4_5' && generatedLyric?.length > 1000 ? 'disabled' : ''
                }`}
              >
                {t('Lyrics Length')} : {generatedLyric?.length} / 1000
              </p>
            )}

            <div className="generated-lyrics__confirm-buttons--button-wrap">
              <button
                className="generated-lyrics__confirm-buttons--button edit"
                onClick={() => setMode(prev => (prev === 'edit' ? 'read' : 'edit'))}
              >
                {t('EDIT')}
              </button>
              <button
                className={`generated-lyrics__confirm-buttons--button confirm ${
                  selectedVersion !== 'V4_5' && generatedLyric?.length > 1000 ? 'disabled' : ''
                }`}
                disabled={selectedVersion !== 'V4_5' && generatedLyric?.length > 1000}
                onClick={() => {
                  setGeneratedLyric(generatedLyric);
                  setPageNumber(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {t('CONFIRM')}
              </button>
            </div>
          </div> */}
          </SelectItemWrap>
        </section>
        <div className="generated-lyrics__confirm-buttons">
          {selectedVersion !== 'V4_5' && (
            <p
              className={`generated-lyrics__confirm-buttons--text ${
                isConfirmLyricStatus?.length > 1000 ? 'disabled' : ''
              }`}
            >
              {t('Lyrics Length')} : {isConfirmLyricStatus?.length} / 1000
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
                selectedVersion !== 'V4_5' && isConfirmLyricStatus?.length > 1000 ? 'disabled' : ''
              }`}
              disabled={selectedVersion !== 'V4_5' && isConfirmLyricStatus?.length > 1000}
              onClick={() => {
                // setGeneratedLyric(isConfirmLyricStatus);
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
      </div>
    );
};

export default LyricChatBot;
