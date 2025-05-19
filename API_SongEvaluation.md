# MOB 노래 평가 API 명세서

## 0. 노래 평가 가능 횟수 조회 API

- **URL** :
- **HTTP 메서드** : GET
- **설명** : 노래 평가 가능 횟수를 가져오는 api 입니다. 잔여 횟수를 가져옵니다. 횟수 제한은 하루에 1회입니다.

### 0. 요청(Request)

- **파라미터**:
- 없음

- **요청헤더** :
- 토큰

### 0. 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "평가가능한횟수": "number"
  }
}
```

## 1. 노래 평가 결과 저장 API

- **URL**:
- **HTTP 메서드**: POST
- **설명** : 심사위원별 평가 점수 저장, 심사위원 별로 여러개의 평가 저장이 가능
- **제한사항** : 하루에 1회

- **피그마 참조** : https://www.figma.com/design/Qo984kgRjvPG7l4e6LAqn3/%EB%AE%A4%EC%A7%81%EC%98%A8%EB%8D%94%EB%B8%94%EB%9F%AD-PC-?node-id=2684-122122&m=dev

### 1. 요청(Request)

- **파라미터**:

```json
{
  "song_id": "곡의 아이디",
  "심사위원 ID": "number | string",
  "evaluation_dt": "yyyy-mm-dd",
  "feedback": "피드백",
  "emotioal impact": 0,
  "creativity_individuality": 0,
  "structure_composition": 0,
  "soundquality_mixing": 0,
  "relatibility_popularity": 0,
  "score": 0.0,
  "to_improve": "개선점에 대한 피드백",
  "why_this_score": "왜 이 점수가 나왔는지에 대한 피드백",
  "key_points": "키 포인트 피드백"
}
```

- **요청 헤더**:
- 토큰

### 1. 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```

## 2. 심사위원별 평가한 노래 리스트

- **URL**:
- **HTTP 메서드**: POST
- **설명**: 심사 페이지에서 나타나는 심사위원별 최신 평가 리스트 최대 6개, 평가 점수의 경우 가장 최근에 받은 평가 점수를 기준으로 함.

- **참조 URL** : https://www.figma.com/design/Qo984kgRjvPG7l4e6LAqn3/%EB%AE%A4%EC%A7%81%EC%98%A8%EB%8D%94%EB%B8%94%EB%9F%AD-PC-?node-id=2684-122122&m=dev

### 2. 요청(Request)

- **파라미터**:
- '심사위원 ID' : number | string

### 2. 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": [
    {
      "노래ID": "number",
      "노래커버이미지": "string",
      "노래이름": "string",
      "노래 아티스트": "string",
      "emotioal impact": "number",
      "creativity_individuality": "number",
      "structure_composition": "number",
      "soundquality_mixing": "number",
      "relatibility_popularity": "number"
    }
  ]
}
```

## 3. 곡의 노래 평가 목록 조회

- **URL**:
- **HTTP 메서드**: GET
- **설명** : 심사위원별 평가 기록 조회

### 3. 요청(Request)

- **파라미터**:
- song_id : 노래의 id 값
- sort_by : "Highest Score" (점수 높은 순) | "Lowest Score" (점수 낮은 순) | "Latest" (최신 순) | "Oldest" (오래된 순), 기본은 최신 순으로
- critic(심사위원 ID 또는 이름) :

### 3. 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": [
    {
      "id (심사ID)": "number | string",
      "song_id": "number",
      "심사위원ID": "number | string",
      "feedback": "string",
      "score": "number",
      "evaluation_dt": "date"
    }
  ]
}
```

## 4. 곡의 노래 평가 결과 상세 조회 API

- **URL**:
- **HTTP 메서드**: GET
- **설명** : 노래 평가 결과 상세 조회

- **피그마 참조** : https://www.figma.com/design/Qo984kgRjvPG7l4e6LAqn3/%EB%AE%A4%EC%A7%81%EC%98%A8%EB%8D%94%EB%B8%94%EB%9F%AD-PC-?node-id=2924-196620&m=dev

### 4. 요청(Request)

- **파라미터**:
- 심사ID : number

### 4. 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "심사위원 ID": "number",
    "evaluation_dt": "date",
    "feedback": "string",
    "emotioal_impact": "number",
    "creativity_individuality": "number",
    "structure_composition": "number",
    "soundquality_mixing": "number",
    "relatibility_popularity": "number",
    "score": "double",
    "to_improve": "string",
    "why_this_score": "string",
    "key_points": "string"
  }
}
```

## 5.노래 평가 리스트 (점수 기준)

- **URL**:
- **HTTP 메서드**: GET
- **설명** : 노래 평가 전체 및 심사위원별 리스트 조회
- **제한사항** : 페이지네이션 (개수 20개)

- **피그마 참조** : https://www.figma.com/design/Qo984kgRjvPG7l4e6LAqn3/%EB%AE%A4%EC%A7%81%EC%98%A8%EB%8D%94%EB%B8%94%EB%9F%AD-PC-?node-id=369-6731&p=f&m=dev

### 5. 요청(Request)

- **파라미터**:

-심사위원ID : number 값 없을 경우 All
-search_keyword : 검색어
-page : 페이지
-sort_by : Highest Score (점수 높은 순) | Lowest Score (점수 낮은 순) | Latest (최신 순) | Oldest (오래된 순)

### 5. 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "total_cnt": 0,
    "data_list": [
      {
        "id": "number",
        "evaluation_dt": "date (심사 날짜)",
        "song_id": "number",
        "심사위원ID": "number",
        "feedback": "string",
        "title": "string (곡의 제목)",
        "artist": "string (곡 만든이 이름)",
        "artist_profile": "string (곡 만든이의 프로필 이미지)",
        "score": "number (심사 점수)",
        "music_url": "string (음악 저장 경로)"
      }
    ]
  }
}
```
