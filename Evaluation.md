# 곡 평가 인수인계 문서

## ✅ 기능 개요

- **기능명**: 곡 평가 (`Evaluation.jsx, EvaluationBegin.jsx`)
- **기능 설명**:  
  생성한 곡을 가상의 심사위원에게 평가를 의뢰하여 곡의 항목별 점수를 부여받고, 구체적 피드백을 받는 시스템

## 🔧 주요 파일 및 컴포넌트

| 파일/컴포넌트                                     | 설명                                       |
| ------------------------------------------------- | ------------------------------------------ |
| `pages/Evaluation.jsx`                            | 곡 평가 인트로 페이지                      |
| `pages/EvaluationBegin.jsx`                       | 평가 받을 곡 선택 및 평가 로직 실행 페이지 |
| `components/evaluation/EvaluationResultsComp.jsx` | 평가 결과를 보여주는 페이지                |
| `pages/EvaluationStage.jsx`                       | 평가 리스트를 나타내는 페이지              |
| `data/criticData`                                 | 심사위원 데이터를 담는 파일                |

## 🔄 평가 단계 로직 정리 (EvaluationBegin.jsx)

    ## EvaluationBegin.jsx 페이지의 경우 단순 setter 함수를 이용해 심사위원 및 평론가를 선택하지 않음
    ## searchParams, useSearchParams를 사용함
    ## 쿼리 파라미터로 곡 및 심사위원을 선택하므로 이 부분 유의!
    ## 위 방식으로 처리한 이유는 곡 디테일에서 '심사하러가기' 버튼 클릭시 해당 곡과 심사위원이 바로 선택될 수 있도록 하기 위함.

    서비스 로직
    1. Step1 컴포넌트에서 랜더링 된 곡 리스트중 원하는 곡을 선택하여 곡을 선택함 (쿼리 파라미터 song_id를 변경함 => useEffect를 통해 selectMusic 변경)
    2. Step2 컴포넌트에서 랜더링 된 심사위원 리스트 중 원하는 심사위원을 선택함 (쿼리 파라미터 critic => useEffect를 통해 selectCritic 변경)
    3. selectCritic 및 selectMusic 변경 시 선택된 곡이 선택된 심사위원에게 평가 받은 기록이 있는 확인하는 getPossibleCount 실행 (react-query)
    4. 'View Results' 버튼 클릭
    5. 모달창 뜨며 로딩
    6. 점수 평가 완료 시 /evaluation-result (EvaluationResults.jsx) 페이지로 이동

    평가 핵심 로직 (4번 순서)에 대한 세부 설명

    1. 버튼 클릭
    2. 유저의 의사를 묻는 모달 창이 랜더링 됨. EvaluationConfirmModal.jsx
    3. Start 버튼 클릭 시 로딩 상태로 변경 되며 다음 handleEvaluation 함수 실행됨.
    3. handleEvaluation 함수 내의 getAnalysisTaskId 함수 (파라미터 : 토큰, 곡 ID, 심사위원 이름) 실행하여 task_id 발급
    4. 발급된 task_id를 이용 하여 getAnalysisData (파라미터 : task_id) 함수 실행
        - getAnalysisData 함수는 서버에서 비동기로 처리됨 즉 지속적으로 보내 서비스 로직이 끝마쳤는지 확인이 필요함
        - 확인을 위해 3초마다 서버 요청을 보내 음원 분석 로직이 진행중인지 종료되었는지 확인
        - 음원 분석 로직이 종료된 경우 result : 'done'과 분석 데이터 오브젝트가 반환 됨.
        - 반환 즉시 resolve 하여 다음 로직으로 이동
    5. 반환된 음원 분석 데이터를 이용하여 getEvaluationResult 함수 실행
        - 해당 함수는 GPT를 이용하여 분석 데이터를 기반으로 점수를 산정하는 함수입니다.
        - GPT 요청 및 유효성 검사 로직은 해당 함수 내 request 함수가 담당합니다.
        - request 함수 내의 문자열로 길게 작성되어 있는 부분들이 프롬프트 부분입니다.
        - request 함수 내에 모든 데이터가 있는지 유효성 검사 또한 진행하는 로직이 포함되어 있습니다.
        - 밑의 while... 반복문을 사용하여 올바르지 않은 데이터를 GPT가 반환 할 경우 재시도를 하도록 코드를 정의하였습니다.
        - 5번의 시도 끝에도 유효한 데이터가 반환되지 않는 경우 에러를 발생시켜 로직을 중단시킵니다.
        - 유효한 정보가 반환될 시 산정된 평가를 반환합니다.
    6. 산정된 평가 데이터를 saveEvaluationScore 함수를 사용하여 저장합니다.
        - 해당 함수는 총점 정의 및 저장, 그리고 저장 한 값을 반환합니다.
    7. 반환된 데이터를 /evaluation-results 로 전달하며 페이지를 이동합니다.

    분석 데이터 및 어떤 필드가 분석에 사용되는지는 프롬프트 보시면 얼추 이해 되실겁니다~!

    심사위원별 가중치 등 정보는 data/criticData.js 에 포함되어 있습니다.

    현재 한글, 영어, 인도네시아어를 지원하고 있습니다.
    GPT를 통한 분석 데이터는 i18n을 이용한 번역이 불가능 하여
    평가 데이터를 반환받을 때 자연어 항목에 대해서는 지원 언어에 대한 데이터를 모두 받고 있습니다.
    즉, 언어가 추가될 때마다 서버에서 평가 테이블에 컬럼을 추가해 달라고 요청을 드려야 합니다.

    또한 언어가 추가될 경우 unit/EvaluationListItem.jsx 와 evaluation/EvaluationResult.jsx 에서 언어에 따른 필드 설정을 꼭 해주셔야 언어에 맞는 데이터가 송출됩니다.

---
