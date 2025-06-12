# 🎼 곡 생성 페이지 인수인계 문서 (`Create.jsx`, `getStarted`,`LyricChatBot.js`, `MelodyChatBot.js`)

## 개요

곡을 생성하는 전체 플로우를 담당하는 페이지 및 컴포넌트 구성에 대한 인수인계 문서입니다. 사용자는 가사 생성 → 멜로디 생성 → 앨범 커버 → 최종 확인의 단계를 거치며, chatbot 또는 select 모드 중 선택할 수 있습니다.

---

## 📂 주요 파일 경로 및 역할

| 파일명                                       | 설명                                                      |
| -------------------------------------------- | --------------------------------------------------------- |
| `pages/Create.jsx`                           | 전체 곡 생성 플로우 관리 컴포넌트                         |
| `components/create/getStarted.js`            | 시작화면 컴포넌트                                         |
| `components/create/chatbot/LyricChatBot.js`  | GPT 기반 가사 생성 챗봇 컴포넌트                          |
| `components/create/chatbot/MelodyChatBot.js` | GPT 기반 멜로디 생성 및 최종 생성 요청 담당 챗봇 컴포넌트 |

---

## 📌 페이지 플로우 요약

```text
1. GetStarted (시작화면)
2. 가사 생성 (LyricChatBot 또는 LyricLab)
3. 멜로디 생성 (MelodyChatBot 또는 MelodyMaker)
4. 앨범 커버 생성 (AlbumCoverStudio - 선택적)
5. 최종 확인 및 제출 (Finalize)
```

---

## 🔁 주요 상태값

### Create.jsx

- `pageNumber`, `createMode`, `selectedVersion`, `selectedPrivacy`, `selectedCreationMode`
- `lyricData`, `melodyData`, `generatedLyric`, `generatedMusicResult`
- `tempo`, `songLength`, `finalPrompt`, `albumCover`

### LyricChatBot.js

- `chatHistory`, `userInput`, `generatedLyric`, `isStatus`, `mode`

### MelodyChatBot.js

- `chatHistory`, `userInput`, `melodyData`, `finalPrompt`, `albumCover`

---

## 💬 LyricChatBot 기능 요약

- 사용자의 입력을 기반으로 GPT를 통해 가사 생성
- 채팅 UI 기반 인터랙션 구현
- 완료 후 가사 확인 및 수정 모드 제공 (read/edit 모드)
- txt / pdf 다운로드 기능 제공 (`jsPDF` 및 한글 PDF 커스터마이징)
- 상태 `isStatus`에 따라 챗봇 뷰 ↔ 생성 가사 결과 뷰 전환

---

## 🎵 MelodyChatBot 기능 요약

- 이전에 생성한 가사를 기반으로 멜로디 데이터를 생성
- GPT 기반 추출: 태그, 장르, 보컬, 악기, 템포, 제목, 소개 등 다수 파싱
- 프롬프트 자동 생성 후 DALL·E API를 사용해 앨범 커버 생성
- 최종적으로 생성된 데이터를 바탕으로 곡 생성 요청 API 호출 (`/api/music/v2/album/`)
- 생성 후 로컬 스토리지에 앨범 ID 저장

---

## ⚙️ 주요 처리 로직

### 공통 사항

- GPT-4.1-nano 모델 사용
- 언어 설정에 따른 locale 파일 분기 (한영인니)
- 입력값 → chat history → GPT 요청 → 파싱 및 상태 업데이트

### 최종 곡 생성 절차 (MelodyChatBot.js)

1. `generateFinalPrompt()` : GPT로 prompt 생성
2. `generateAlbumCover()` : DALL·E API로 커버 이미지 생성
3. `musicGenerate()` : 생성 요청 API 호출 (최종 formData 전송)

---

## 🔐 예외처리 및 제한사항

- 중복 생성 방지: `checkUserCreatingStatus()` 활용
- 생성 제한 횟수 초과 시 `createPossibleCount` 확인
- `selectedVersion !== 'V4_5'`일 경우 가사 길이 제한 1000자

---
