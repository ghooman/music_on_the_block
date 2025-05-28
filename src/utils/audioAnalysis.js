import Meyda from 'meyda';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const audioAnalysis = async ({ music_url }) => {
  const analyzeAudioBuffer = async arrayBuffer => {
    // 오디오 데이터 디코딩
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 첫 번째 채널(모노) 데이터 가져오기
    const channelData = audioBuffer.getChannelData(0);

    // Meyda로 한 번에 피처 추출 (buffer 전체를 한 번에 넣음)
    const features = Meyda.extract(['rms', 'spectralCentroid', 'mfcc'], channelData.slice(0, 64));

    return features;
  };

  const response = await fetch(music_url);

  return response;

  if (!response.ok) {
    throw new Error('Failed to fetch audio from URL');
  }
  const arrayBuffer = await response.arrayBuffer();
  console.log('어레이 버퍼', arrayBuffer);
  return await analyzeAudioBuffer(arrayBuffer);
};
