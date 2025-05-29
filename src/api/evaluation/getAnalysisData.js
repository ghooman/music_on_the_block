import axios from 'axios';

const serverApi = process.env.REACT_APP_SERVER_API;

/**
 * 음악 분석 데이터 산출.
 * @param {string} token : 토큰
 * @param {number | string} song_id : 곡의 id
 * @returns {Promise<object>} : 분석 정보
 */

export const getAnalysisTaskId = async ({ token, song_id, critic }) => {
  try {
    const res = await axios.get(`${serverApi}/api/music/${song_id}/evaluation/pre/work2`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        critic,
      },
    });
    return res;
  } catch (e) {
    throw new Error(e);
  }
};

export const getAnalysisResult = async ({ task_id }) => {
  try {
    const res = await axios.get(`${serverApi}/api/music/evaluation/pre/work/result`, {
      params: {
        task_id,
      },
    });
    return res;
  } catch (e) {
    throw new Error(e);
  }
};

//============분석 데이터 반환 타입 정보
// {
//     emotion : {
//         "spectral_centroid" : 0, (밝기)
//         "tonnetz" : 0, (조성, 감정)
//         "mfcc" : 0, (음색 다양성)
//         "rms" : 0, (다이나믹)
//     },
//     creativity : {
//         "chroma_stft" : 0, (코드 분산도)
//         "spectral_contrast" : 0, (대비도)
//         "zero_crossing_rate" : 0, (노이즈 / 파격)
//     },
//     structure : {
//         "onset_strength" : 0, (리듬 정확도)
//         "tempo" : 0, (BPM)
//         "tempogram" : 0, (패턴 주기성)
//         "beat_track" : 0, (정확한 박자 존재 여부)
//     },
//     sound : {
//         "mfcc" : 0, (음색 품질)
//         "spectral_bandwidth" : 0, (음역 넓이)
//         "rms" : 0, (음량의 안정성)
//         "spectral_flatness" : 0 (노이즈 여부)
//     },
//     popularity : {
//         "tempo" : 0, (댄서블)
//         "chroma_cqt" : 0, (대중 코드 사용 여부)
//         "spectral_centroid" : 0, (밝기)
//         "rms" : 0, (전반적 에너지)
//     },
// }
