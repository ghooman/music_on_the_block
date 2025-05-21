// scripts/tempGenerateBgm.js

import axios from 'axios';

const API_KEY = process.env.REACT_APP_MUREKA_API_KEY; // 환경 변수에 API 키를 설정하세요.
if (!API_KEY) {
  console.error('❗ MUREKA_API_KEY 환경 변수가 설정되어 있지 않습니다.');
  process.exit(1);
}
const MUSIC_LIST_URL = 'https://api.useapi.net/v1/mureka/music/?expand=true';

async function fetchDownloadUrl(taskId) {
  const res = await axios.get(MUSIC_LIST_URL, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const entry = res.data.list.find(item => String(item.feed_id) === String(taskId));
  if (!entry || !Array.isArray(entry.songs) || !entry.songs[0]?.mp3_url) {
    throw new Error('생성된 음악을 찾을 수 없습니다.');
  }
  return entry.songs[0].mp3_url;
}
async function generateBgm() {
  try {
    // 1) BGM 생성 요청
    const generateRes = await axios.post(
      'https://api.mureka.ai/v1/instrumental/generate',
      {
        prompt: 'A K-pop love song at 90 BPM featuring guitar.',
        model: 'mureka-6',
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { id: taskId, status } = generateRes.data;
    console.log(`🔄 생성 요청 접수됨. Task ID: ${taskId}, 초기 상태: ${status}`);

    // 2) 상태 폴링
    const pollInterval = 5000; // 5초 간격
    const intervalId = setInterval(async () => {
      const { data: taskInfo } = await axios.get(
        `https://api.mureka.ai/v1/instrumental/query/${taskId}`,
        { headers: { Authorization: `Bearer ${API_KEY}` } }
      );

      // ↓↓↓ 전체 응답을 예쁘게 출력 ↓↓↓
      console.log('── 전체 응답 확인 ──');
      console.log(JSON.stringify(taskInfo, null, 2));

      if (taskInfo.status === 'succeeded' || taskInfo.status === 'failed') {
        clearInterval(intervalId);
        console.log(`✅ 처리 완료. 상태: ${taskInfo.status}`);
      }
    }, pollInterval);
  } catch (err) {
    console.error('❌ BGM 생성 요청 중 오류:', err.response?.data || err.message);
  }
}

generateBgm();
