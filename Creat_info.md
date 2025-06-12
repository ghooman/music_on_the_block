# 🎼 곡 생성 페이지 인수인계 문서 (`Create.jsx`, `GetStarted.jsx`, `LyricChatBot.js`, `MelodyChatBot.js`)

## 1. 개요

곡을 생성하는 전체 플로우를 담당하는 페이지 및 컴포넌트 구성에 대한 인수인계 문서입니다. 사용자는 **가사 생성 → 멜로디 생성 → 앨범 커버 → 최종 확인**의 단계를 거치며, `chatbot` 또는 `select` 모드 중 하나를 선택합니다.

---

## 2. 📂 주요 파일 경로 및 역할

| 파일명                                       | 설명                                            |
| -------------------------------------------- | ----------------------------------------------- |
| `pages/Create.jsx`                           | 전체 곡 생성 플로우 관리 컴포넌트               |
| `components/create/GetStarted.jsx`           | 시작 화면 컴포넌트 (언어/모드/버전 선택)        |
| `components/create/LyricLab.jsx`             | 가사 생성 라벨링 컴포넌트                       |
| `components/create/MelodyMaker.jsx`          | 멜로디 생성 라벨링 컴포넌트                     |
| `components/create/chatbot/LyricChatBot.js`  | GPT 기반 가사 생성 챗봇 컴포넌트                |
| `components/create/chatbot/MelodyChatBot.js` | GPT 기반 멜로디 생성 및 최종 생성 요청 컴포넌트 |

---

## 3. 🔁 페이지 플로우 요약

```text
1. GetStarted (시작화면) (chatbot or select mode 선택)
2. 가사 생성 (LyricChatBot 또는 LyricLab)
2.5 BGM 모드시 가사 생성 부분 스킵
3. 멜로디 생성 (MelodyChatBot 또는 MelodyMaker)
4. 멜로디 생성 파일에서 앨범 커버 및 최종 생성 요청이 진행됩니다.
```

---

## 4. 🔑 상태값 정리

### Create.jsx

- `pageNumber`, `createMode`, `selectedVersion`, `selectedPrivacy`, `selectedCreationMode`
- `lyricData`, `melodyData`, `generatedLyric`, `generatedMusicResult`
- `tempo`, `songLength`, `finalPrompt`, `albumCover`

### LyricChatBot.js

- `chatHistory`, `userInput`, `generatedLyric`, `isStatus`, `mode`

### MelodyChatBot.js

- `chatHistory`, `userInput`, `melodyData`, `finalPrompt`, `albumCover`

---

## 5. 컴포넌트별 기능 요약

### (챗봇모드 선택시) 🧠 LyricChatBot

- GPT 기반 가사 생성 (chatGPT API 사용)
- 대화형 UI로 사용자 입력 처리
- 가사 결과 확인 및 수정 모드 지원 (read/edit)
- `.txt`, `.pdf` 포맷으로 다운로드 기능 제공

### (챗봇모드 선택시) 🎶 MelodyChatBot

- 가사 기반 멜로디 정보 추출 및 입력 지원
- GPT 응답에서 주요 정보(태그, 장르, 템포 등) 파싱
- 프롬프트 생성 → 앨범 커버 생성 → 음악 생성 API 호출
- 생성 완료 시 앨범 ID를 localStorage에 저장

### (라벨링모드 선택시) 🎶 LyricLab

- 가사 생성 라벨링 컴포넌트

### (라벨링모드 선택시) 🎶 MelodyLab

- 멜로디 생성 라벨링 컴포넌트

---

## 6. 챗봇 모드 설명

### 챗봇 모드 선택

- GetStarted 화면에서 챗봇 모드 선택 시 챗봇 모드 파일들로 생성과정이 진행됩니다.

## 7. 주요 처리 로직 요약

### 공통 처리

- GPT 모델: `gpt-4.1-nano`
- 언어별 locale 적용 (KOR/ENG/IDN)
- 입력 → chatHistory → GPT 요청 → 응답 파싱

### MelodyChatBot.js 전용

1. `generateFinalPrompt()` : 영어 프롬프트 생성 (수노에서는 길이 제한 없지만 기본 200자 제한)
2. `generateAlbumCover()` : DALL·E 기반 이미지 생성
3. `musicGenerate()` : `/api/music/v2/album/` or `/api/music/v2/album/bgm/` API 호출

---

## 8. 예외 처리 및 제한 사항

| 항목           | 처리 방식                                       |
| -------------- | ----------------------------------------------- |
| 곡 생성 중복   | `checkUserCreatingStatus()` → ErrorModal 표시   |
| 생성 횟수 초과 | `createPossibleCount` 검사 후 버튼 비활성화     |
| 가사 길이 제한 | `selectedVersion !== 'V4_5'`일 경우 1000자 제한 |
| API 실패       | 콘솔 에러 로그 및 사용자 피드백 필요            |

---

## 9. 추가 설명 및 실전 참고

### 주요 변수 설명

| 변수명            | 설명                                     |
| ----------------- | ---------------------------------------- |
| `pageNumber`      | 현재 단계 (-1: 시작, 0: 가사, 1: 멜로디) |
| `createMode`      | chatbot/select 선택 모드                 |
| `selectedVersion` | AI 생성 엔진 선택 (예: V4_5)             |
| `finalPrompt`     | 영어 프롬프트 (음악 생성에 사용됨)       |
| `albumCover`      | DALL·E로 생성된 앨범 커버 이미지 URL     |

## 10. 환경변수 및 외부 API

| 변수명                        | 역할                  |
| ----------------------------- | --------------------- |
| `REACT_APP_OPENAI_API_KEY`    | OpenAI 사용 키        |
| `REACT_APP_CREATE_SERVER_API` | 곡 생성 API 서버 주소 |
| DALL·E API                    | 앨범 커버 이미지 생성 |
| jsPDF                         | 가사 PDF 변환 기능    |
