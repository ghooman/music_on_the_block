### 각 모델별 공식 docs 주소

topmediai : https://docs.topmediai.com/api-reference/ai-music-generator/ai-music-generator
mureka : https://platform.mureka.ai/docs/en/quickstart.html
suno : https://docs.api.box/suno-api/generate-music

### 1. 🔷 TopMediai (현재 사용중인 모델입니다.)

- **Endpoint**: `POST /v1/music`
- **Base URL**: `https://api.topmediai.com`
- **Authentication**: `x-api-key`
  // f47d348dc08d492492a7a5d546d40f4a
  // 5782c095bc8d49b485246e372f80f99a

#### 📤 Request

```json
Headers:
{
  "x-api-key": "f47d348dc08d492492a7a5d546d40f4a", // 또는 5782c095bc8d49b485246e372f80f99a
  "Content-Type": "application/json"
}
Body:
{
  "is_auto": 1,  // 무조건 1 고정
  "prompt": "",
  "lyrics": "",
  "title": "",
  "instrumental": 0 // 0 고정
}
```

#### 📥 Response

- `200 OK`
- Response 타입은 자유 형식(`any`)
- 생성된 음악의 오디오 파일 URL 또는 결과 데이터 반환

---

### 2. 🟩 Mureka

- **POST Endpoint**: `https://api.mureka.ai/v1/song/generate`
- **GET Endpoint**: `https://api.mureka.ai/v1/song/query/{taskId}`
- **Authentication**: `Authorization: Bearer op_mag4gx3uHbHKxB7NE5b8v8pbVuUmfT8`

#### 📤 Request (곡 생성)

```json
Headers:
{
  "Authorization": "Bearer op_mag4gx3uHbHKxB7NE5b8v8pbVuUmfT8",
  "Content-Type": "application/json"
}
Body:
{
  "lyrics": "",
  "prompt": "",
  "model": "auto"  // 또는 "mureka-5.5", "mureka-6" 총 세개중 하나로 모델을 보내겠습니다.
}
```

#### ⏳ 작업 처리 방식

- POST 요청 시 `taskId` 반환
- 이후 `GET /query/{taskId}` 로 주기적으로 상태 조회

  - status: `preparing`, `running`,`succeeded`, `completed`, `failed`
  - 성공 시 `choices` 배열 내에 음악 결과 존재

#### 📥 Get Response 예시

```json
{
  "id": "72041034285057",
  "created_at": 1747030242,
  "finished_at": 1747030269,
  "model": "mureka-5.5",
  "status": "succeeded",
  "choices": [
    {
      "url": "https://cdn.mureka.ai/cos-prod/open/song/20250512/71306137567233-Coaqa1mva3MdC1GGzw1W4B.mp3",
      "flac_url": "https://cdn.mureka.ai/cos-prod/open/song/20250512/71306137567233-XyNntPwLHsHRky2TdvYrWL.flac",
      "duration": 91051,
      "lyrics_sections": [
        {
          "section_type": "intro",
          "start": 40,
          "end": 12080
        },
        {
          "section_type": "verse",
          "start": 12280,
          "end": 32720,
          "lines": [
            {
              "start": 12280,
              "end": 12600,
              "text": "\"Verse 1"
            },
            {
              "start": 12680,
              "end": 15280,
              "text": "길거리의 전설, 검은 그림자 속에서"
            },
            {
              "start": 15480,
              "end": 19840,
              "text": "수많은 싸움과 눈물, 오늘도 견디며 살아가"
            },
            {
              "start": 19960,
              "end": 22360,
              "text": "경험이 쌓인 눈빛은 깊고도 차갑게"
            },
            {
              "start": 22720,
              "end": 25760,
              "text": "모든 고난 이겨내며 강해진 내 모습 보여주지"
            },
            {
              "start": 25960,
              "end": 26320,
              "text": "Chorus"
            },
            {
              "start": 28480,
              "end": 30280,
              "text": "베테랑, 난 멈추지 않아"
            },
            {
              "start": 30440,
              "end": 32720,
              "text": "전설의 길 걸으며 빛나는 날개 펴"
            }
          ]
        },
        {
          "section_type": "chorus",
          "start": 34960,
          "end": 50880,
          "lines": [
            {
              "start": 34960,
              "end": 37160,
              "text": "거친 세상 속에서도 꿋꿋이 버텨"
            },
            {
              "start": 37320,
              "end": 40520,
              "text": "내 인생은 끝없이 도전하는 싸움"
            },
            {
              "start": 40560,
              "end": 41000,
              "text": "Verse 2"
            },
            {
              "start": 41280,
              "end": 43480,
              "text": "눈부신 아침과 어둠이 섞인 밤"
            },
            {
              "start": 43640,
              "end": 45040,
              "text": "끝없이 반복된 전쟁이 나를 단련시켰어"
            },
            {
              "start": 45280,
              "end": 47640,
              "text": "온몸에 새겨진 자국들, 기억의 흔적들"
            },
            {
              "start": 47800,
              "end": 50640,
              "text": "이 모든 걸 딛고 일어나, 난 또 한 번 일어서네"
            },
            {
              "start": 50680,
              "end": 50880,
              "text": "Chorus"
            }
          ]
        },
        {
          "section_type": "verse",
          "start": 51440,
          "end": 69680,
          "lines": [
            {
              "start": 51440,
              "end": 52880,
              "text": "베테랑, 난 멈추지 않아"
            },
            {
              "start": 53040,
              "end": 57400,
              "text": "전설의 길 걸으며 빛나는 날개 펴"
            },
            {
              "start": 57760,
              "end": 60280,
              "text": "거친 세상 속에서도 꿋꿋이 버텨"
            },
            {
              "start": 60440,
              "end": 63680,
              "text": "내 인생은 끝없이 도전하는 싸움"
            },
            {
              "start": 63720,
              "end": 63920,
              "text": "Bridge"
            },
            {
              "start": 64080,
              "end": 65400,
              "text": "길고 긴 여정, 포기란 없지"
            },
            {
              "start": 65480,
              "end": 67320,
              "text": "이겨낸 시간들이 내 힘이 돼"
            },
            {
              "start": 67480,
              "end": 69680,
              "text": "앞으로도 계속 달려가, 끝없는 이 길 위에"
            }
          ]
        },
        {
          "section_type": "chorus",
          "start": 70440,
          "end": 88280,
          "lines": [
            {
              "start": 70440,
              "end": 72680,
              "text": "나만이 할 수 있는 이야기를 써 내려가"
            },
            {
              "start": 72720,
              "end": 72960,
              "text": "Chorus"
            },
            {
              "start": 74560,
              "end": 76000,
              "text": "베테랑, 난 멈추지 않아"
            },
            {
              "start": 76160,
              "end": 80520,
              "text": "전설의 길 걸으며 빛나는 날개 펴"
            },
            {
              "start": 80880,
              "end": 83400,
              "text": "거친 세상 속에서도 꿋꿋이 버텨"
            },
            {
              "start": 83560,
              "end": 86320,
              "text": "내 인생은 끝없이 도전하는 싸움"
            },
            {
              "start": 86840,
              "end": 86880,
              "text": "Outro"
            },
            {
              "start": 87040,
              "end": 88280,
              "text": "이 무대 위, 마지막까지 달려가"
            }
          ]
        },
        {
          "section_type": "verse",
          "start": 89560,
          "end": 90840,
          "lines": [
            {
              "start": 89560,
              "end": 90840,
              "text": "내 이름 새기며 새 역사를 쓰리\""
            }
          ]
        }
      ]
    },
    {
      "index": 1,
      "url": "https://cdn.mureka.ai/cos-prod/open/song/20250512/71306137567233-Kd4qFN9Ps2VjBNC8fgjdzs.mp3",
      "flac_url": "https://cdn.mureka.ai/cos-prod/open/song/20250512/71306137567233-H2zwyLbYEK2uzDsahLTD4D.flac",
      "duration": 100451,
      "lyrics_sections": [
        {
          "section_type": "intro",
          "start": 5720,
          "end": 11640
        },
        {
          "section_type": "verse",
          "start": 11920,
          "end": 36000,
          "lines": [
            {
              "start": 11920,
              "end": 12400,
              "text": "\"Verse 1"
            },
            {
              "start": 12480,
              "end": 15880,
              "text": "길거리의 전설, 검은 그림자 속에서"
            },
            {
              "start": 17080,
              "end": 22320,
              "text": "수많은 싸움과 눈물, 오늘도 견디며 살아가"
            },
            {
              "start": 22480,
              "end": 25960,
              "text": "경험이 쌓인 눈빛은 깊고도 차갑게"
            },
            {
              "start": 26120,
              "end": 29280,
              "text": "모든 고난 이겨내며 강해진 내 모습 보여주지"
            },
            {
              "start": 29440,
              "end": 29760,
              "text": "Chorus"
            },
            {
              "start": 29960,
              "end": 32240,
              "text": "베테랑, 난 멈추지 않아"
            },
            {
              "start": 33400,
              "end": 36000,
              "text": "전설의 길 걸으며 빛나는 날개 펴"
            }
          ]
        },
        {
          "section_type": "chorus",
          "start": 36920,
          "end": 60960,
          "lines": [
            {
              "start": 36920,
              "end": 39360,
              "text": "거친 세상 속에서도 꿋꿋이 버텨"
            },
            {
              "start": 39560,
              "end": 42280,
              "text": "내 인생은 끝없이 도전하는 싸움"
            },
            {
              "start": 42320,
              "end": 43240,
              "text": "Verse 2"
            },
            {
              "start": 43400,
              "end": 45560,
              "text": "눈부신 아침과 어둠이 섞인 밤"
            },
            {
              "start": 46000,
              "end": 49040,
              "text": "끝없이 반복된 전쟁이 나를 단련시켰어"
            },
            {
              "start": 50160,
              "end": 53680,
              "text": "온몸에 새겨진 자국들, 기억의 흔적들"
            },
            {
              "start": 53840,
              "end": 60760,
              "text": "이 모든 걸 딛고 일어나, 난 또 한 번 일어서네"
            },
            {
              "start": 60800,
              "end": 60960,
              "text": "Chorus"
            }
          ]
        },
        {
          "section_type": "verse",
          "start": 61520,
          "end": 81800,
          "lines": [
            {
              "start": 61520,
              "end": 63640,
              "text": "베테랑, 난 멈추지 않아"
            },
            {
              "start": 64120,
              "end": 67280,
              "text": "전설의 길 걸으며 빛나는 날개 펴"
            },
            {
              "start": 67480,
              "end": 70080,
              "text": "거친 세상 속에서도 꿋꿋이 버텨"
            },
            {
              "start": 70240,
              "end": 72720,
              "text": "내 인생은 끝없이 도전하는 싸움"
            },
            {
              "start": 72960,
              "end": 73040,
              "text": "Bridge"
            },
            {
              "start": 73360,
              "end": 75600,
              "text": "길고 긴 여정, 포기란 없지"
            },
            {
              "start": 76000,
              "end": 78800,
              "text": "이겨낸 시간들이 내 힘이 돼"
            },
            {
              "start": 79000,
              "end": 81800,
              "text": "앞으로도 계속 달려가, 끝없는 이 길 위에"
            }
          ]
        },
        {
          "section_type": "chorus",
          "start": 82120,
          "end": 97960,
          "lines": [
            {
              "start": 82120,
              "end": 84520,
              "text": "나만이 할 수 있는 이야기를 써 내려가"
            },
            {
              "start": 84720,
              "end": 85440,
              "text": "Chorus"
            },
            {
              "start": 85560,
              "end": 87160,
              "text": "베테랑, 난 멈추지 않아"
            },
            {
              "start": 87520,
              "end": 90840,
              "text": "전설의 길 걸으며 빛나는 날개 펴"
            },
            {
              "start": 91000,
              "end": 93440,
              "text": "거친 세상 속에서도 꿋꿋이 버텨"
            },
            {
              "start": 93600,
              "end": 95920,
              "text": "내 인생은 끝없이 도전하는 싸움"
            },
            {
              "start": 96240,
              "end": 96400,
              "text": "Outro"
            },
            {
              "start": 96560,
              "end": 97960,
              "text": "이 무대 위, 마지막까지 달려가"
            }
          ]
        },
        {
          "section_type": "verse",
          "start": 98480,
          "end": 100400,
          "lines": [
            {
              "start": 98480,
              "end": 100400,
              "text": "내 이름 새기며 새 역사를 쓰리\""
            }
          ]
        }
      ]
    }
  ],
  "trace_id": "4c191f1916af9625cd647f141eeb1e56"
}
```

---

### 3. 🟠 Suno (apibox.erweima.ai)

- **Post Endpoint**: `POST https://apibox.erweima.ai/api/v1/generate`
- **Get Endpoint**: `GET https://apibox.erweima.ai/api/v1/record-info/{taskId}`
- **Authentication**: `Authorization: Bearer cc2c3bfbb452545d370711555221cfa0`

#### ⏳ 작업 처리 방식

- POST 요청 시 `taskId` 반환
- Query Parameters - `taskId` 반환된 taskId 를 넣어주면 됩니다. (필수값)

#### 📤 Request

```json
Headers:
{
  "Authorization": "Bearer cc2c3bfbb452545d370711555221cfa0",
  "Content-Type": "application/json"
}
Body:
{
  "prompt": "", // 기존 가사 데이터 들어가면 될꺼같습니다.
  "style": "", // 기존 prompt 데이터 들어가면 될꺼같습니다.
  "title": "", // 기존 타이틀 그대로 사용
  "customMode": true, // 무조건 true 고정
  "instrumental": false, // 일단 false 고정
  "model": "V3_5", // V3_5 , V4 , V4_5 중 하나 선택해서 보내겠습니다.
  "negativeTags": "", // 임시로 일단 빈값 고정
  "callBackUrl": "" // 콜백 받을 url 입력
}
```

#### 📥 Get Response 예시

```json
{
  "code": 200,
  "data": {
    "callbackType": "complete",
    "data": [
      {
        "audio_url": "https://apiboxfiles.erweima.ai/NTdmYmNiNjMtMDM3My00MTE1LTlmYWItYjBhYWY1ZTQxMDEx.mp3",
        "createTime": 1747026351679,
        "duration": 167.04,
        "id": "57fbcb63-0373-4115-9fab-b0aaf5e41011",
        "image_url": "https://apiboxfiles.erweima.ai/NTdmYmNiNjMtMDM3My00MTE1LTlmYWItYjBhYWY1ZTQxMDEx.jpeg",
        "model_name": "chirp-auk",
        "prompt": "\"**Verse 1**\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n별들이 반짝이며 나를 감싸\n트랄라레오 트랄랄라\n하늘을 날아가는 기분, oh yeah\n**Pre-Chorus**\n소리 없이 다가오는 너의 미소\n떨림을 안고 나는 꿈을 꿔\n이리 저리 흔들리는 우리의 발끝\n리듬에 맞춰 우린 노래해\n**Chorus**\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n이 순간을 느껴\n트랄라레오 트랄랄라 즐거운 시간\n모두 함께 춤을 춰, 이 밤이 끝나기 전에\n소중한 기억으로 간직할 거야\n**Hook**\n트랄라레오 트랄랄라, 바다를 건너\n우리의 꿈은 멈추지 않아\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n이 순간, 영원히 살아 숨쉬게\n**Bridge**\n빛나는 별들 속에 우리 담아\n서로의 손을 잡고 날아가\n추억이 되는 이 밤의 이야기를\n영원히 간직해, 함께 할 거야\n**Chorus**\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n이 순간을 느껴\n트랄라레오 트랄랄라 즐거운 시간\n모두 함께 춤을 춰, 이 밤이 끝나기 전에\n소중한 기억으로 간직할 거야\"",
        "source_audio_url": "https://cdn1.suno.ai/57fbcb63-0373-4115-9fab-b0aaf5e41011.mp3",
        "source_image_url": "https://cdn2.suno.ai/image_57fbcb63-0373-4115-9fab-b0aaf5e41011.jpeg",
        "source_stream_audio_url": "https://cdn1.suno.ai/57fbcb63-0373-4115-9fab-b0aaf5e41011.mp3",
        "stream_audio_url": "https://mfile.erweima.ai/NTdmYmNiNjMtMDM3My00MTE1LTlmYWItYjBhYWY1ZTQxMDEx",
        "tags": "80s synthwave, dreamy, atmospheric, female vocals ",
        "title": "밈 - 퉁퉁퉁퉁퉁퉁퉁퉁퉁 사후루, 트랄라레오 트랄랄라"
      },
      {
        "audio_url": "https://apiboxfiles.erweima.ai/ZDMyNTAwOWUtMTYzYi00NDNiLThjZjQtNmY5YjNlNWJmZjc4.mp3",
        "createTime": 1747026351679,
        "duration": 192.76,
        "id": "d325009e-163b-443b-8cf4-6f9b3e5bff78",
        "image_url": "https://apiboxfiles.erweima.ai/ZDMyNTAwOWUtMTYzYi00NDNiLThjZjQtNmY5YjNlNWJmZjc4.jpeg",
        "model_name": "chirp-auk",
        "prompt": "\"**Verse 1**\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n별들이 반짝이며 나를 감싸\n트랄라레오 트랄랄라\n하늘을 날아가는 기분, oh yeah\n**Pre-Chorus**\n소리 없이 다가오는 너의 미소\n떨림을 안고 나는 꿈을 꿔\n이리 저리 흔들리는 우리의 발끝\n리듬에 맞춰 우린 노래해\n**Chorus**\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n이 순간을 느껴\n트랄라레오 트랄랄라 즐거운 시간\n모두 함께 춤을 춰, 이 밤이 끝나기 전에\n소중한 기억으로 간직할 거야\n**Hook**\n트랄라레오 트랄랄라, 바다를 건너\n우리의 꿈은 멈추지 않아\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n이 순간, 영원히 살아 숨쉬게\n**Bridge**\n빛나는 별들 속에 우리 담아\n서로의 손을 잡고 날아가\n추억이 되는 이 밤의 이야기를\n영원히 간직해, 함께 할 거야\n**Chorus**\nTung Tung Tung Tung Tung Tung Tung Tung Tung SAHUR!\n이 순간을 느껴\n트랄라레오 트랄랄라 즐거운 시간\n모두 함께 춤을 춰, 이 밤이 끝나기 전에\n소중한 기억으로 간직할 거야\"",
        "source_audio_url": "https://cdn1.suno.ai/d325009e-163b-443b-8cf4-6f9b3e5bff78.mp3",
        "source_image_url": "https://cdn2.suno.ai/image_d325009e-163b-443b-8cf4-6f9b3e5bff78.jpeg",
        "source_stream_audio_url": "https://cdn1.suno.ai/d325009e-163b-443b-8cf4-6f9b3e5bff78.mp3",
        "stream_audio_url": "https://mfile.erweima.ai/ZDMyNTAwOWUtMTYzYi00NDNiLThjZjQtNmY5YjNlNWJmZjc4",
        "tags": "80s synthwave, dreamy, atmospheric, female vocals ",
        "title": "밈 - 퉁퉁퉁퉁퉁퉁퉁퉁퉁 사후루, 트랄라레오 트랄랄라"
      }
    ],
    "task_id": "5b2af1356aba3ea37eecf4aa2d868201"
  },
  "msg": "All generated successfully."
}
```

---
