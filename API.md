# API 명세서

## 개념 소개

1. 노래(Song) => (말 그대로 듣는 노래)
2. 릴리즈 => 생성한 노래에서 릴리즈 하였을 경우 (앨범 표시 및 NFT 생성이 가능합니다.)
3. NFT => (릴리즈 완료 된 노래)를 민팅(발행) 하였을 경우 NFT 노래가 됩니다.(컬렉션이 한개 이상 있어야 NFT를 발행 할 수 있습니다.)
4. 컬렉션 => NFT 들을 모아놓은 집합체 입니다.

## 1. 메인 NFT 목록 조회 API (GET /nfts/main)

### 1.1 기본 정보

- **URL**: /nfts/main
- **HTTP 메서드**: GET
- **설명**: 메인에서 보여지는 NFT 목록을 조회하는 API (인기 NFT 목록 5개 , 인기 컬렉션 5개)
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

- **URL**: /nfts/statistics
- **HTTP 메서드**: GET
- **설명**: NFT 거래 및 발행 관련 통계 데이터를 반환합니다. (14일 기준)

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
    "총 거래 금액 추이(14일기준)": {
      "mon": 1,
      "tue": 2,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    },
    "NFT 발행량 추이(14일기준)": {
      "mon": 1500,
      "tue": 1700,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500
    }
  }
}
```

## 3. NFT 리스트 조회 API (GET /nfts/list)

### 3.1 기본 정보

- **URL**: /nfts/list
- **HTTP 메서드**: GET
- **설명**: NFT 리스트를 조회하는 API (페이지네이션 적용) 보여지는 아이템 개수 12개

### 3.2 요청(Request)

- **파라미터**:
- '페이지 번호': 'number',
- '검색 키워드': 'string', (nft 아이템명기준)
- 'Ai Service 타입': 'number',
- '판매중인 상태' : '보관','판매중','판매완료',
- 'NFT 등급' : 1,2,3,4,5,
- '정렬 상태': '최신순', '오래된순', '최고가순', '최저가순', '좋아요 많은순','좋아요 적은순','조회수 높은 순', '조회요 낮은순','거래량 많은순',거래량 낮은순',

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
        "nft 소유자 이름": "string",
        "nft 소유자 아이디": "string",
        "nft 소유자 지갑주소": "string",
        "nft 연결된 컬렉션 이름": "string",
        "판매가": 1,
        "판매 토큰 종류": "string",
        "현재 판매 상태": "string"
      }
    ]
  }
}
```

# 4. 거래소 컬렉션 리스트 조회 API (GET /nfts/collections/list)

### 4.1 기본 정보

- **URL**: /nfts/collections/list
- **HTTP 메서드**: GET
- **설명**: 거래소 컬렉션 리스트를 조회하는 API (페이지네이션 적용) 보여지는 아이템 개수 9개

### 4.2 요청(Request)

- **쿼리 파라미터**:
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
        "컬렉션에 저장된 NFT 수": 1,
        "컬렉션 저장 상태": "string",
        "컬렉션 소유자 이름": "string",
        "컬렉션 소유자 프로필 이미지": "string",
        "최저가": 1,
        "최저가 토큰 종류": "string"
      }
    ]
  }
}
```

# 5. 컬렉션 상세 조회 API (GET /nfts/collections/:id)

### 5.1 기본 정보

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
    "컬렉션에 저장된 NFT 수": 1,
    "컬렉션 소유자 이름": "string",
    "컬렉션 소유자 아이디": "string",
    "컬렉션 소유자 지갑주소": "string",
    "컬렉션 소유자 프로필 이미지": "string",
    "최고가": 1,
    "최저가": 1,
    "최고가 토큰 종류": "string",
    "최저가 토큰 종류": "string",
    "총 거래 금액(달러 기준)": 1,
    "좋아요 받은 숫자": 1,
    "나의 컬렉션 여부": true
    "보낸 지갑주소로 좋아요 눌렀는지 여부": true,
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
    "NFT 저장된 갯수": 1,
    "거래건수": 1,
    "총 거래량": 1,
    "평균가(달러기준)": 1,
    "최고가": 1,
    "최고가 토큰 종류": "string",
    "최저가": 1,
    "최저가 토큰 종류": "string",
    "최근거래일": "string",
    "총 거래 금액 추이(14일기준)": {
      "mon": 1,
      "tue": 2,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    },
    "평균 거래가 추이(14일기준)": {
      "mon": 1500,
      "tue": 1700,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500
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

- **URL**: `/nfts/collections/{id}/nfts`
- **HTTP 메서드**: `GET`
- **설명**: 컬렉션 상세 NFT 목록 조회 API(페이지네이션 적용) 20개씩 보여줌

### 9.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',
- '페이지 번호': 'number',
- 'NFT 등급': 'number',
- '토큰 종류': 'string',
- 'Ai Service 타입': 'number',
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
          "NFT 소유자 아이디": "string",
          "NFT 생성날짜": "string",
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

- **URL**: `/nfts/collections/{id}/activities`
- **HTTP 메서드**: `GET`
- **설명**: 컬렉션 상세 활동 기록 조회 API(페이지네이션 적용) 10개씩 보여줌

### 10.2 요청(Request)

- **파라미터**:
- '컬렉션 아이디': 'number',
- 'NFT 이름': 'string', // NFT 이름 기준으로 검색
- 'NFT 등급': 'number',
- '페이지 번호': 'number',
- 'Ai Service 타입': 'number',
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
      "NFT 생성날짜[발행(민팅)된 기준]": "string",
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
      "NFT 곡 생성 날짜(노래 생성된 기준)": "string",
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
      "최근 거래일": "string",
      "거래 건수": 1,
      "총 거래 금액": 1,
      "평균 거래 가격": 1,
      "평균 거래 토큰 종류": "string",
      "최고 거래 가격": 1,
      "최고 거래 토큰 종류": "string",
      "최저 거래 가격": 1,
      "최저 거래 토큰 종류": "string"
    },
    "NFT 가격 변화 추이(14일기준)": {
      "mon": 1,
      "tue": 2,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500,
      "sat": 2300,
      "sun": 2200
    },
    "거래 건수(14일기준)": {
      "mon": 1500,
      "tue": 1700,
      "wed": 2000,
      "thu": 1800,
      "fri": 2500
    }
  }
  ```

# 14. NFT 아이템 상세 거래 활동 기록 조회 API (GET /nfts/{id}/activities)

### 14.1 기본 정보

- **URL**: `/nfts/{id}/activities`
- **HTTP 메서드**: `GET`
- **설명**: NFT 거래 활동 기록 조회 API(페이지네이션 적용) 10개씩 보여줌 , 필터 및 검색가능

### 14.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',
- '페이지 번호': 'number',
- '토큰 종류': 'string',
- '정렬 상태': '최신순','오래된순','거래단가최고기준','거래단가최저기준'
- '검색 키워드': 'string', // 구매한 유저 이름 기준으로 검색

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
          "거래 날짜": "string"
        }
      ]
    }
  }
  ```

# 15. 민팅 가능한 노래(릴리즈가 완료된) 목록 조회 API (GET /nfts/mintable)

### 15.1 기본 정보

- **URL**: `/nfts/mintable`
- **HTTP 메서드**: `GET`
- **설명**: 민팅 가능한 노래(릴리즈가 완료된) 목록 조회 API

### 15.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '페이지 번호': 'number',
- '정렬 상태': 'string',
- '검색 키워드': 'string',
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
          "NFT Ai Service": 1
        }
      ]
    }
  }
  ```

# 16. NFT 아이템 민팅 API (POST /nfts/{song_id}/{collection_id}/mint)

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

# 18. NFT 판매 가능한 목록 조회 API (GET /nfts/sellable)

### 18.1 기본 정보

- **URL**: `/nfts/sellable`
- **HTTP 메서드**: `GET`
- **설명**: NFT 판매 가능한 목록 조회 API

### 18.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '페이지 번호': 'number',
- '정렬 상태': 'string',
- 'Ai Service 타입': 'number',
- '검색 키워드': 'string',

### 18.3 응답(Response)

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
        "NFT Ai Service": 1
      }
    ]
  }
}
```

# 19. NFT 판매 등록 API (POST /nfts/{nft_id}/sell)

### 19.1 기본 정보

- **URL**: `/nfts/{nft_id}/sell`
- **HTTP 메서드**: `POST`
- **설명**: NFT 판매 등록 API

### 19.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',
- '판매 가격': 'number',
- '판매 토큰 종류': 'string',

### 19.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```

# 20. 나의 NFT 마켓 플라이스 NFT 목록 조회 API (GET /nfts/my/market/list)

### 20.1 기본 정보

- **URL**: `/nfts/my/market/list`
- **HTTP 메서드**: `GET`
- **설명**: 나의 NFT 마켓 플라이스 NFT 목록 조회 API (페이지 네이션 10개)
  (민팅 완료된건 전부만)

### 20.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '페이지 번호': 'number',
- '정렬 상태': 'string',
- 'Ai Service 타입': 'number',
- '검색 키워드': 'string',
- '판매 상태': 'string',

### 20.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success",
  "data": {
    "total_cnt": 1,
    "data_list": [
      {
        "NFT 아이디": 1,
        "NFT 발행일(민팅된 날짜)": "string",
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

# 21. 나의 NFT 마켓 플라이스 NFT 판매 등록 API (POST /nfts/my/market/sell/{nft_id})

### 21.1 기본 정보

- **URL**: `/nfts/my/market/sell/{nft_id}`
- **HTTP 메서드**: `POST`
- **설명**: 나의 NFT 마켓 플라이스 NFT 판매 등록 API

### 21.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',
- '판매 가격': 'number',
- '판매 토큰 종류': 'string',

### 21.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```

# 22. 나의 NFT 마켓 플라이스 NFT 판매 취소 API (POST /nfts/my/market/sell/{nft_id}/cancel)

### 22.1 기본 정보

- **URL**: `/nfts/my/market/sell/{nft_id}/cancel`
- **HTTP 메서드**: `POST`
- **설명**: 나의 NFT 마켓 플라이스 NFT 판매 취소 API

### 22.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- 'NFT 아이디': 'number',

### 22.3 응답(Response)

- **성공적인 응답 (200 OK)**:

```json
{
  "status": "success"
}
```

# 23. 나의 NFT 컬렉션 목록 조회 API (GET /nfts/my/collections)

### 23.1 기본 정보

- **URL**: `/nfts/my/collections`
- **HTTP 메서드**: `GET`
- **설명**: 나의 NFT 컬렉션 목록 조회 API

### 23.2 요청(Request)

- **Headers**
- '인증 토큰' : 'string',
- **파라미터**:
- '페이지 번호': 'number',
- '정렬 상태': 'string',
- '검색 키워드': 'string',

### 23.3 응답(Response)

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
        "컬렉션 생성 날짜": "string"
      }
    ]
  }
}
```
