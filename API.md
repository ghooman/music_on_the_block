# MOB NFT API 명세서

- 디자인 수정중이여서 피그마 기획된 내용으로 첨부합니다.

## 개념 소개

1. 노래(Song) => (말 그대로 듣는 노래)
2. 릴리즈 => 생성한 노래에서 릴리즈 하였을 경우 (앨범 표시 및 NFT 생성이 가능합니다.)
3. NFT => (릴리즈 완료 된 노래)를 민팅(발행) 하였을 경우 NFT 노래가 됩니다.(컬렉션이 한개 이상 있어야 NFT를 발행 할 수 있습니다.)
4. 컬렉션 => NFT 들을 모아놓은 집합체 입니다.
5. 예상 판매 토큰 종류 : MOB, POL, USDT, USDC
6. 페이지 네이션 갯수는 변경가능성 있습니다.

- 예외로 앨범은 노래를 담는 목록으로 여기서는 따로 사용되지 않습니다.

## 1. 메인 NFT 목록 조회 API (GET /nfts/main)

### 1.1 기본 정보

![스크린샷 2025-04-23 시간: 15.15.53](https://hackmd.io/_uploads/S1ToSZI1ll.png)

- **URL**: /nfts/main
- **HTTP 메서드**: GET
- **설명**: 메인에서 보여지는 NFT 목록을 조회하는 API (인기 NFT 목록 4개 , 인기 컬렉션 3개)
- **인기 NFT 기준** : 아직 정해지지 않았습니다.
- **인기 컬렉션 기준** : 각 컬렉션 소속된 NFT 아이템 거래가 많은 순

### 1.2 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "인기 NFT 목록": [
      {
        "nft 아이디": 1,
        "nft 아이템명": "string",
        "nft 이미지": "string",
        "nft 소유자 이름": "string",
        "nft 소유자 아이디": "string",
        "nft 소유자 지갑주소": "string",
        "nft 연결된 컬렉션 이름": "string",
        "nft 등급": 1,
        "판매가": 1,
        "판매 토큰 종류": "string"
      }
    ],
    "인기 컬렉션 목록": [
      {
        "컬렉션 아이디": 1,
        "컬렉션 이름": "string",
        "컬렉션 이미지": "string",
        "컬렉션에 저장된 NFT 수": 1,
        "최저가": 1,
        "최저가 토큰 종류": "string"
      }
    ]
  }
}
```

## 2. 통계 정보 조회 API (GET /nfts/statistics)

### 2.1 기본 정보

![스크린샷 2025-04-23 시간: 15.17.12](https://hackmd.io/_uploads/ry2eUbUylg.png)

- **URL**: /nfts/statistics
- **HTTP 메서드**: GET
- **설명**: NFT 거래 및 발행 관련 통계 데이터를 반환합니다. (7일 기준)

### 2.2 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "총거래금액 (달러)": 1,
    "평균거래가 (달러)": 1,
    "발행된 NFT 수": 1,
    "오늘 최고가 거래(달러)": 1,
    "총 거래 금액 추이(7일기준 달러기준)": {
      "mon": 1,
      "tue": 2,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    },
    "NFT 발행량 추이(7일기준)": {
      "mon": 1500,
      "tue": 1700,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    }
  }
}
```

## 3. 거래소 NFT 리스트 조회 API (GET /nfts/list)

### 3.1 기본 정보

![스크린샷 2025-04-23 시간: 15.17.46](https://hackmd.io/_uploads/Byb4IZ81le.png)

- **URL**: /nfts/list
- **HTTP 메서드**: GET
- **설명**: NFT 리스트를 조회하는 API (페이지네이션,검색,필터 사용) 보여지는 아이템 개수 12개

### 3.2 요청(Request)

- **파라미터**:
- '페이지 번호': 'number',
- '검색 키워드': 'string', (nft 아이템명기준)
- '판매중인 상태' : '보관','판매중','판매완료',
- 'Ai Service 타입': 'number',
- 'NFT 등급' : 1,2,3,4,5,
- '토큰 종류': 'string',
- '정렬 상태': '최신순', '오래된순', '최고가순', '최저가순', '좋아요 많은순','좋아요 적은순','재생수 높은순', '재생수 낮은순',

### 3.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "total_cnt": 1,
    "data_list": [
      {
        "nft 아이디": 1,
        "nft 이미지": "string",
        "nft 이름": "string",
        "nft 장르": "string",
        "nft 등급": 1,
        "nft 현재 판매 상태": "string",
        "nft 소유자 이름": "string",
        "nft 소유자 아이디": "string",
        "nft 소유자 지갑주소": "string",
        "nft 연결된 컬렉션 이름": "string",
        "nft 판매가": 1,
        "nft 판매 토큰 종류": "string"
      }
    ]
  }
}
```

# 4. 거래소 컬렉션 리스트 조회 API (GET /nfts/collections/list)

### 4.1 기본 정보

![스크린샷 2025-04-23 시간: 15.19.15](https://hackmd.io/_uploads/HySdIb8Jxx.png)

- **URL**: /nfts/collections/list
- **HTTP 메서드**: GET
- **설명**: 거래소 컬렉션 리스트를 조회하는 API (페이지네이션,검색,필터 사용) 보여지는 아이템 개수 9개

### 4.2 요청(Request)

- **파라미터**:
- '페이지 번호': 'number',
- '검색 키워드': 'string', (컬렉션 이름 기준)
- '정렬 상태': '최고가순', '최저가순', '좋아요 많은순','좋아요 적은순','NFT 갯수 많은순',NFT 갯수 적은순',

### 4.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "total_cnt": 1,
    "data_list": [
      {
        "컬렉션 아이디": 1,
        "컬렉션 이름": "string",
        "컬렉션 이미지": "string",
        "컬렉션 소유자 이름": "string",
        "컬렉션에 저장된 NFT 수": 1,
        "컬렉션 소유자 프로필 이미지": "string",
        "컬렉션 좋아요 상태": true,
        "최저가": 1,
        "최저가 토큰 종류": "string"
      }
    ]
  }
}
```

# 5. 컬렉션 상세 조회 API (GET /nfts/collections/:id)

### 5.1 기본 정보

![스크린샷 2025-04-25 시간: 15.39.44](https://hackmd.io/_uploads/Bk_SCs_kxg.png)

- **URL**: /nfts/collections/{id}
- **HTTP 메서드**: GET
- **설명**: 컬렉션 상세 정보를 조회하는 API

### 5.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',
- '지갑주소': 'string', // 나의 컬렉션 확인 , 컬렉션 좋아요 확인

### 5.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "컬렉션 아이디": 1,
    "컬렉션 이름": "string",
    "컬렉션 이미지": "string",
    "컬렉션 소유자 이름": "string",
    "컬렉션 소유자 아이디": "string",
    "컬렉션 소유자 지갑주소": "string",
    "컬렉션 소유자 프로필 이미지": "string",
    "좋아요 받은 숫자": 1,
    "보낸 지갑주소로 좋아요 눌렀는지 여부": true,
    "나의 컬렉션 여부": true
  }
}
```

# 6. 컬렉션 좋아요 누르기 API (POST /nfts/collections/{id}/like)

### 6.1 기본 정보

- **URL**: /nfts/collections/{id}/like
- **HTTP 메서드**: POST
- **설명**: 컬렉션 좋아요 누르기 API

### 6.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',
- '지갑주소': 'string',

### 6.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```

# 7. 컬렉션 좋아요 취소 API (POST /nfts/collections/{id}/like/cancel)

### 7.1 기본 정보

- **URL**: /nfts/collections/{id}/like/cancel
- **HTTP 메서드**: POST
- **설명**: 컬렉션 좋아요 취소 API

### 7.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',
- '지갑주소': 'string',

### 7.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```

# 8. 컬렉션 상세 오버뷰 API (GET /nfts/collections/{id}/overview)

![스크린샷 2025-04-23 시간: 15.21.30](https://hackmd.io/_uploads/rJAxv-8yee.png)

### 8.1 기본 정보

- **URL**: /nfts/collections/{id}/overview
- **HTTP 메서드**: GET
- **설명**: 컬렉션 상세 오버뷰 조회 API

### 8.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',

### 8.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "컬렉션 아이디": 1,
    "컬렉션에 저장된 NFT 수": 1,
    "최고가": 1,
    "최고가 토큰 종류": "string",
    "최고가 토큰 가격(달러기준)": 1,
    "최저가": 1,
    "최저가 토큰 종류": "string",
    "최저가 토큰 가격(달러기준)": 1,
    "총 거래 금액(달러 기준)": 1,
    "평균 거래 금액(달러 기준)": 1,
    "최근 거래일": "timestamp",
    "총 거래 금액 추이(7일기준)": {
      "mon": 1,
      "tue": 2,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    },
    "평균 거래가 추이(7일기준)": {
      "mon": 1500,
      "tue": 1700,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    },
    "해당 컬렉션의 인기 NFT 목록(거래량 많은 순으로 5개)": [
      {
        "nft 아이디": 1,
        "nft 이미지": "string",
        "nft 이름": "string",
        "nft 소유자 아이디": "string",
        "NFT 노래 장르": "string",
        "컬렉션 이름": "string",
        "판매가": 1,
        "판매 토큰 종류": "string"
      }
    ]
  }
}
```

# 9. 컬렉션 상세 NFT 목록 조회 API (GET /nfts/collections/{id}/nfts)

### 9.1 기본 정보

![스크린샷 2025-04-23 시간: 15.22.07](https://hackmd.io/_uploads/rk87w-81xe.png)

- **URL**: `/nfts/collections/{id}/nfts`
- **HTTP 메서드**: `GET`
- **설명**: 컬렉션 상세 NFT 목록 조회 API(페이지 네이션,필터,검색기능(NFT 이름 기준) 사용)

### 9.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',
- '페이지 번호': 'number',
- 'NFT 이름': 'string', // NFT 이름 기준으로 검색
- 'Ai Service 타입': 'number',
- 'NFT 등급': 'number',
- '토큰 종류': 'string',
- '정렬 상태': '최신순', '오래된순', '최고가순', '최저가순', '좋아요 많은순','좋아요 적은순','거래량 많은순',거래량 낮은순',

### 9.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "total_cnt": 1,
      "data_list": [
        {
          "NFT 아이디": 1,
          "NFT 이미지": "string",
          "NFT 이름": "string",
          "NFT 장르": "string",
          "NFT 등급": 1,
          "NFT 소유자 아이디": "string",
          "NFT 생성날짜": "timestamp",
          "컬렉션 이름": "string",
          "판매가": 1,
          "판매 토큰 종류": "string"
        }
      ]
    }
  }
  ```

# 10. 컬렉션 상세 활동 기록 조회 API (GET /nfts/collections/{id}/activities)

### 10.1 기본 정보

![스크린샷 2025-04-23 시간: 15.22.31](https://hackmd.io/_uploads/ryWSD-U1ex.png)

- **URL**: `/nfts/collections/{id}/activities`
- **HTTP 메서드**: `GET`
- **설명**: 컬렉션 상세 활동 기록 조회 API(페이지네이션,필터,검색기능 사용)

### 10.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',
- '페이지 번호': 'number',
- 'NFT 이름': 'string', // NFT 이름 기준으로 검색
- 'Ai Service 타입': 'number',
- 'NFT 등급': 'number',
- '토큰 종류': 'string',
- '정렬 상태': '최신순', '오래된순', '최고가순', '최저가순', '좋아요 많은순','좋아요 적은순','거래량 많은순',거래량 낮은순',

### 10.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "total_cnt": 1,
      "data_list": [
        {
          "활동 기록 아이디": 1,
          "Ai Service 타입": 1,
          "NFT 이름": "string",
          "NFT 아이디": 1,
          "NFT 등급": 1,
          "NFT 거래 단가": 1,
          "NFT 거래 단가 토큰 종류": "string",
          "아티스트 이름": "string",
          "아티스트 아이디": "string",
          "아티스트 지갑주소": "string",
          "아티스트 프로필 이미지": "string"
        }
      ]
    }
  }
  ```

# 11. NFT 아이템 상세 조회 API (GET /nfts/{id})

### 11.1 기본 정보

![스크린샷 2025-04-23 시간: 15.23.03](https://hackmd.io/_uploads/SkcODZI1le.png)

- **URL**: `/nfts/{id}`
- **HTTP 메서드**: `GET`
- **설명**: NFT 아이템 상세 조회 API

### 11.2 요청(Request)

- **파라미터**:
- 'NFT 아이디': 'number',
- '지갑주소': 'string', // NFT 소유 여부 확인시 필요

### 11.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "현재 판매 상태": "string",
      "NFT 이름": "string",
      "NFT 아이디": 1,
      "NFT 이미지": "string",
      "NFT 소유 여부 확인": true,
      "NFT 소유자 아이디": "string",
      "NFT 소유자 프로필 사진": "string",
      "NFT 생성날짜[발행(민팅)된 기준]": "timestamp",
      "NFT 음악 파일": "string",
      "NFT 음악 가사": "string",
      "NFT 장르": "string",
      "NFT 등급": 1,
      "컬렉션 이름": "string",
      "컬렉션 소유자": "string",
      "재생된 횟수": 1,
      "좋아요 받은 횟수": 1,
      "판매가": 1,
      "판매 토큰 종류": "string",
      "판매가 현재 달러 시세": 1,
      "여태껏 NFT 로 벌어들인 돈": 1 // 판매자가 변경되면 0원으로 변경된다고 합니다.
    }
  }
  ```

# 12. NFT 아이템 상세 조회 OVERVIEW API (GET /nfts/{id}/overview)

### 12.1 기본 정보

![스크린샷 2025-04-23 시간: 15.24.01](https://hackmd.io/_uploads/BJXqw-U1lg.png)

- **URL**: `/nfts/{id}/overview`
- **HTTP 메서드**: `GET`
- **설명**: NFT 아이템 상세 조회 OVERVIEW API

### 12.2 요청(Request)

- **파라미터**:
- 'NFT 아이디': 'number',

### 12.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "NFT 아이템 이름": "string",
      "NFT 아이템 아이디": 1,
      "NFT 태그 목록": ["string", "string"],
      "NFT Detail": "string",
      "NFT Ai Service": 1,
      "NFT Gender": "string",
      "NFT 악기": "string",
      "NFT 언어": "string",
      "NFT 템포": 1,
      "NFT 곡의 길이": 1,
      "NFT 곡 생성 날짜(노래 생성된 기준)": "timestamp",
      "추천된 NFT List(동일한 컬렉션에 소속된 NFT 4개)": [
        {
          "NFT 아이디": 1,
          "NFT 이미지": "string",
          "NFT 이름": "string",
          "컬렉션 이름": "string",
          "판매가": 1,
          "판매 토큰 종류": "string"
        }
      ]
    }
  }
  ```

# 13. NFT 아이템 상세 거래 통계 조회 API (GET /nfts/{id}/statistics)

![스크린샷 2025-04-23 시간: 15.24.17](https://hackmd.io/_uploads/SJv2DWIJgl.png)

### 13.1 기본 정보

- **URL**: `/nfts/{id}/statistics`
- **HTTP 메서드**: `GET`
- **설명**: NFT 거래 통계 조회 API

### 13.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',

### 13.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "NFT 아이디": 1,
      "현재 판매가": 1,
      "현재 판매가 토큰 종류": "string",
      "판매 상태": true,
      "최근 거래일": "timestamp",
      "거래 건수": 1,
      "총 거래 금액(거래 당시 달러기준)": 1,
      "평균 거래 가격(거래 당시 달러기준)": 1,
      "최고 거래 가격(거래 당시 달러기준)": 1,
      "최저 거래 가격(거래 당시 달러기준)": 1
    },
    "NFT 가격 변화 추이(7일기준,거래 당시 달러기준)": {
      "mon": 1,
      "tue": 2,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    },
    "거래 건수(7일기준)": {
      "mon": 1500,
      "tue": 1700,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500
    }
  }
  ```

# 14. NFT 아이템 상세 거래 활동 기록 조회 API (GET /nfts/{id}/activities)

![스크린샷 2025-04-23 시간: 15.25.05](https://hackmd.io/_uploads/S1SRvZ81lx.png)

### 14.1 기본 정보

- **URL**: `/nfts/{id}/activities`
- **HTTP 메서드**: `GET`
- **설명**: NFT 거래 활동 기록 조회 API(페이지네이션,필터,검색기능 사용)

### 14.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',
- '페이지 번호': 'number',
- '검색 키워드': 'string', // 구매한 유저 이름 기준으로 검색
- '토큰 종류': 'string',
- '정렬 상태': '최신순','오래된순','거래단가최고기준','거래단가최저기준'

### 14.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "total_cnt": 1,
      "data_list": [
        {
          "활동 기록 아이디": 1,
          "구매한 유저 이름": "string",
          "구매한 유저 아이디": "string",
          "구매한 유저 지갑주소": "string",
          "구매한 유저 프로필 이미지": "string",
          "거래 단가": 1,
          "거래 단가 토큰": "string",
          "거래 날짜": "timestamp"
        }
      ]
    }
  }
  ```

# 15. 민팅 가능한 노래(릴리즈가 완료된) 목록 조회 API (GET /nfts/mintable)

![스크린샷 2025-04-23 시간: 15.25.57](https://hackmd.io/_uploads/Syc-ubLkgg.png)

### 15.1 기본 정보

- **URL**: `/nfts/mintable`
- **HTTP 메서드**: `GET`
- **설명**: 민팅 가능한 노래(릴리즈가 완료된) 목록 조회 API(페이지네이션,필터,검색기능 사용)

### 15.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '페이지 번호': 'number',
- '정렬 상태': '재생수 많은순', '재생수 적은순', '좋아요 많은순', '좋아요 적은순',',
- '검색 키워드': 'NFT 이름',
- 'Ai Service 타입': 'number',

### 15.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "total_cnt": 1,
      "data_list": [
        {
          "NFT 아이디": 1,
          "NFT 이미지": "string",
          "NFT 이름": "string",
          "NFT 소유자 아이디": "string",
          "NFT 음악 재생 파일": "string",
          "NFT 플레이 된 횟수": 1,
          "NFT 좋아요 받은 횟수": 1,
          "NFT Ai Service": 1,
          "NFT 등급": 1
        }
      ]
    }
  }
  ```

# 16. NFT 아이템 민팅 API (POST /nfts/{song_id}/{collection_id}/mint)

![스크린샷 2025-04-23 시간: 15.26.29](https://hackmd.io/_uploads/Syerd-8kel.png)

### 16.1 기본 정보

- **URL**: `/nfts/{song_id}/{collection_id}/mint`
- **HTTP 메서드**: `POST`
- **설명**: NFT 아이템 민팅 API (생성했던 노래 중 하나를 컬렉션에 넣어서 NFT 발행시킵니다.)

### 16.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '컬렉션 아이디': 'number',
- '노래 아이디': 'number',

### 16.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "완료후 민팅 아이디": 1
    }
  }
  ```

# 17. 컬렉션 생성 API (POST /nfts/collections)

![스크린샷 2025-04-23 시간: 15.28.15](https://hackmd.io/_uploads/r1rqubIyex.png)

### 17.1 기본 정보

- **URL**: `/nfts/collections`
- **HTTP 메서드**: `POST`
- **설명**: 컬렉션 생성 API

### 17.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '컬렉션 이름': 'string',
- '컬렉션 이미지': 'string',

### 17.3 응답(Response)

- **성공적인 응답 (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "컬렉션 아이디": 1
    }
  }
  ```

# 18. 나의 Collection 목록 조회 API (GET /nfts/my/collections)

![스크린샷 2025-04-23 시간: 15.28.46](https://hackmd.io/_uploads/rJN2dWLJgl.png)

### 18.1 기본 정보

- **URL**: `/nfts/my/collections`
- **HTTP 메서드**: `GET`
- **설명**: 나의 Collection 목록 조회 API(페이지네이션,필터,검색기능 사용)

### 18.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '페이지 번호': 'number',
- '정렬 상태': '최저가 높은순', '최저가 낮은순', 'NFT 담긴 수 많은순', 'NFT 담긴 수 적은순', '좋아요 많은순', '좋아요 적은순',
- '검색 키워드': '컬렉션 이름',

### 18.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "total_cnt": 1,
    "data_list": [
      {
        "컬렉션 아이디": 1,
        "컬렉션 이름": "string",
        "컬렉션 소유자 아이디": "string",
        "컬렉션 NFT 담긴 수": 1,
        "컬렉션 소유자 프로필 이미지": "string",
        "컬렉션 최저가": 1,
        "컬렉션 최저가 토큰 종류": "string"
      }
    ]
  }
}
```

# 19. 나의 판매 가능한 NFT 목록 조회 API (GET /nfts/my/sellable)

![스크린샷 2025-04-23 시간: 15.29.43](https://hackmd.io/_uploads/HJikt-Iygx.png)

### 19.1 기본 정보

- **URL**: `/nfts/my/sellable`
- **HTTP 메서드**: `GET`
- **설명**: 나의 판매 가능한 NFT 목록 조회 API (페이지 네이션,필터,검색기능 사용)

### 19.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '페이지 번호': 'number',
- '정렬 상태': 'string',
- 'Ai Service 타입': 'number',
- '검색 키워드': 'string',
- '판매 상태': 'string',

### 19.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "total_cnt": 1,
    "data_list": [
      {
        "NFT 아이디": 1,
        "NFT 발행일(민팅된 날짜)": "timestamp",
        "NFT 이름": "string",
        "NFT 소유자 아이디": "string",
        "NFT 소유자 지갑주소": "string",
        "NFT 판매 상태": "string",
        "NFT 판매 가격": "string",
        "NFT 판매 토큰 종류": "string"
      }
    ]
  }
}
```

# 20. 나의 NFT 판매 등록 API (POST /nfts/my/sell/{nft_id})

![스크린샷 2025-04-23 시간: 15.30.08](https://hackmd.io/_uploads/H1vWt-8kgl.png)

### 20.1 기본 정보

- **URL**: `/nfts/my/sell/{nft_id}`
- **HTTP 메서드**: `POST`
- **설명**: 나의 NFT 판매 등록 API

### 20.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',
- '판매 가격': 'number',
- '판매 토큰 종류': 'string',

### 20.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```

# 21. 나의 NFT 판매 취소 API (POST /nfts/my/sell/{nft_id}/cancel)

### 21.1 기본 정보

- **URL**: `/nfts/my/sell/{nft_id}/cancel`
- **HTTP 메서드**: `POST`
- **설명**: 나의 NFT 판매 취소 API

### 21.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',

### 21.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```
