# 🎵 곡 생성 기능 인수인계 문서

## ✅ 기능 개요

- **기능명**: 곡 생성 페이지 (`Create.jsx`)
- **기능 설명**:  
  사용자가 선택 혹은 챗봇 기반으로 **가사 생성 → 멜로디 생성 → 앨범 커버 → 미리보기/완성** 단계를 거쳐 곡을 생성하는 인터랙티브한 기능입니다.
  - `select` 모드: 사용자가 태그 및 데이터를 직접 선택
  - `chatbot` 모드: AI 챗봇을 통해 대화 기반으로 생성

---

## 🔧 주요 파일 및 컴포넌트

| 파일/컴포넌트                   | 설명                                                    |
| ------------------------------- | ------------------------------------------------------- |
| `pages/Create.jsx`              | 전체 곡 생성 기능의 컨테이너                            |
| `LyricLab`, `MelodyMaker`       | 직접 선택 기반의 UI 생성 모듈                           |
| `LyricChatBot`, `MelodyChatBot` | 챗봇 기반 곡 생성 UI                                    |
| `GetStarted`                    | 시작 화면                                               |
| `AlbumCoverStudio`, `Finalize`  | 앨범 커버 및 최종 단계 (현재 미사용 상태일 가능성 있음) |
| `useUserDetail`                 | 사용자 생성 가능 상태 확인용 훅                         |
| `getCreatePossibleCount`        | 남은 생성 가능 횟수 조회 API                            |

---

## 🔄 생성 단계 흐름

1. **초기화 상태**

   - `pageNumber = -1`: `GetStarted` 화면
   - 사용자의 곡 생성 중 상태 확인 후 진입 제한

2. **가사 생성 단계 (`pageNumber = 0`)**

   - 챗봇 모드: `LyricChatBot` 컴포넌트 사용
   - 셀프 선택 모드: `LyricLab` 사용
   - 사용자 선택한 태그와 스토리를 `lyricData`, `lyricStory`에 저장

3. **멜로디 생성 단계 (`pageNumber = 1`)**

   - 챗봇 모드: `MelodyChatBot` 컴포넌트 사용
   - 셀프 선택 모드: `MelodyMaker` 사용
   - 생성된 가사를 바탕으로 `melodyData`, `melodyDetail`, `generatedMusicResult` 등 관리

4. **앨범 커버 및 완료 단계 (향후 확장 고려)**
   - `pageNumber = 2`, `3` 은 아직 구현 중이거나 주석 처리됨

---

## 📌 주요 상태 변수

| 상태                                     | 용도                            |
| ---------------------------------------- | ------------------------------- |
| `pageNumber`                             | 생성 단계 흐름 관리             |
| `createMode`                             | `chatbot` or `select`           |
| `selectedCreationMode`                   | `song` or `bgm` 여부 결정       |
| `lyricData`, `melodyData`                | 각 단계별 사용자 선택 내용 저장 |
| `generatedLyric`, `generatedMusicResult` | 생성 결과 저장                  |
| `albumCover`                             | 앨범 커버 이미지 (선택사항)     |

---

## ⚠️ 주의사항 및 한계

- 현재 `pageNumber = 2, 3` 관련 컴포넌트는 연결되지 않았으며, 추후 확장 계획 존재할 수 있음
- `is_creating` 상태 확인 시 기존 생성 작업 중이면 에러 모달 출력
- 다국어 대응을 위해 `i18n.language` 기반으로 `selectedLanguage` 설정됨
- 멀티탭 생성 방지를 위해 `getCreatePossibleCount`, `refetch()` 사용

---

## 🧪 테스트 팁

- 챗봇 생성은 `chatbot` 모드 선택 후 각 단계별 입력 테스트
- select 생성은 `select` 모드 선택 후 필드 선택 테스트
- 모바일 환경에서 앨범 커버 커스터마이징 관련 부분은 디자인 비적용 상태일 수 있음

---

## 📎 관련 API 및 외부 연동

- `GET /getCreatePossibleCount`: 남은 생성 횟수 확인
- `useUserDetail`: 유저 생성 가능 상태 확인 (creating 중이면 생성 제한)

---

## 📮 후임자에게 당부

- 현재 앨범 커버 / 최종 미리보기는 추후 확장 예정 기능이므로 건드리지 않아도 무방
- 페이지 진입 조건(`walletAddress`, `isRegistered`) 만족하지 않으면 홈으로 이동됨
- 생성된 데이터 (`lyricData`, `melodyData`, `generatedMusicResult`)는 외부 DB 연동 또는 다운로드 기능 연계에 주의 필요

---
