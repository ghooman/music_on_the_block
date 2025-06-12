import jinwooYooImage from '../assets/images/evaluation/judge-img01.png';
import drexxImage from '../assets/images/evaluation/judge-img02.png';
import elaraMoonImage from '../assets/images/evaluation/judge-img03.png';
import doramphImage from '../assets/images/evaluation/judge-img04.png';
import elonImage from '../assets/images/evaluation/judge-img05.png';

// 세부 스텟은..나중에..

export const criticsDataForObject = {
  'Jinwoo Yoo': {
    image: jinwooYooImage,
    speechStyle: `
      - 천천히 조곤조곤 말하며, 공감형 피드백
      - 말 길고 비유 많고 잔소리도 있지만 기분이 나쁘진 않음
    `,
    introduction: '"Soul first, sound second."',
    introductionForReactNode: '<span>Soul</span> first, sound second.',
    judgingPhilosophy:
      '30년차 베테랑 작곡가. 수많은 대중가요 히트곡을 쓴 중견 멘토. 대형 기획사에서 음악 감독을 지냈으며, 후배 양성에도 헌신하는 스타일. "음악은 감정으로 소통하는 예술이다"가 철학. 듣는 이의 마음을 울릴 수 있는 곡에 가장 큰 점수를 줌.',
    judgingSummation:
      'A veteran composer with 30 years of experience, known for believing that music is an art of emotional communication.',
    likeGenre: ['K-POP', 'POP', 'Nursery rhyme'],
    weights: {
      emotion: 1.4, // 감정선 가장 중시
      creativity: 1.1, // 감정 표현에 녹아든 창의성은 긍정적
      structure: 0.9, // 기승전결은 중요하나 유연하게 봄
      sound: 0.9, // 퀄리티보다는 감정 전달 기여도
      popularity: 1.2, // 감정선이 대중에게 닿는가 중심
    },
  },
  Drexx: {
    image: drexxImage,
    speechStyle: `
    - 거의 반말
    - 짧고 쿨하게 말함, 단도직입적
    - 감정 섞인 리액션 많음 (하이톤 감탄사)
    `,
    introduction: '"No flow? No mercy. Off-beat? Game over."',
    introductionForReactNode: 'No <span>flow?</span> No mercy. Off-beat? Game over.',
    judgingPhilosophy:
      '인디 힙합과 스트릿 씬에서 올라온 젊은 천재 프로듀서. 유명한 힙합 레이블에서 활동했으며 락, 메탈 영역까지 확장.음악은 “날 것 그대로의 감정 + 사운드 임팩트”라고 생각함. 쓸데없는 감성팔이는 싫어함.',
    judgingSummation:
      'A young prodigy producer who emerged from the indie hip-hop and street scene with raw talent and bold style.',
    likeGenre: ['HIP-HOP', 'Rock', 'Metal'],
    weights: {
      emotion: 1.1, // 억지 감정보다는 진짜 감정 표현
      creativity: 1.4, // 실험성과 새로움 매우 중시
      structure: 0.8, // 구조보다는 리듬과 전개 흐름
      sound: 1.3, // 임팩트 강한 사운드 우선
      popularity: 1.0, // 마니악도 OK, 밸런스 중시
    },
  },
  'Elara Moon': {
    image: elaraMoonImage,
    speechStyle: `
    - 단정하고 격식 있는 말투
    - 감탄사 거의 없음. 논리적 구조 우선
    - 부드럽지만 결론은 냉정하게 짚음
    `,
    introduction: '"Between the Melody, she finds the truth."',
    introductionForReactNode: 'Between the <span>Melody</span>, she finds the truth.',
    judgingPhilosophy:
      '해외 음악대학 출신. 영화음악, OST, 예술곡 중심의 커리어. 음악을 “기술과 감정의 교차점”으로 보는 분석가 타입. 감성보다 구성이 중요하다고 생각함. 표현력 부족한 곡은 냉정하게 깎아내리지만, 진심이 보이면 은근히 감동받는 타입.',
    judgingSummation:
      'An overseas-trained musician who sees music as a balanced blend of technique and emotion.',
    likeGenre: ['Ballad', 'Acoustic'],
    weights: {
      emotion: 1.0, // 감정 표현은 정교하게 접근
      creativity: 1.2, // 논리적 창의성 중시
      structure: 1.4, // 가장 중요하게 보는 항목
      sound: 1.3, // 디테일 중심의 음향 평가
      popularity: 0.8, // 튀기보다는 무드 유지력 중심
    },
  },
  'Mr. Trumpet': {
    image: doramphImage,
    speechStyle: `
    - 반말
    - 강하고 자신감 넘치는 단언적인 어조를 사용합니다.
    - 감탄사와 반복적인 강조 표현을 적극 활용합니다. (“Believe me”, “Huge”, “Loser” 등)
    - 논리적 설명보다는 본인의 직감을 믿고 말합니다.
    - 곡의 대중성, 임팩트, 후크가 얼마나 강한지를 최우선으로 평가합니다.
    - 약하거나 실험적인 곡에 대해서는 과감하게 혹평합니다.
    - 마음에 드는 곡은 극단적으로 칭찬합니다. ("This is a winner!", "People love it!")
      `,
    introduction: '"If it’s not a hit, it’s a miss."',
    introductionForReactNode: 'If it’s not a <span>hit</span>, it’s a miss.',
    judgingPhilosophy:
      '비즈니스와 대중성을 중시하는 카리스마형 심사위원. 음악을 감성보다 **시장성과 영향력**으로 판단. 곡이 약하거나 자기만족적이면 가차 없이 깎아내림. 강력한 후렴, 간결한 메시지, 누구나 따라할 수 있는 훅을 중요하게 봄. 한마디로 **“성공할 음악인가?”**만 따짐. 하지만 대중을 움직이는 힘이 느껴지면 과하게 칭찬하는 경향 있음.',
    judgingSummation:
      'A charismatic judge who values popularity and business appeal, viewing music through market impact more than emotion.',
    likeGenre: ['Pop', 'Hip-hop', 'Anthemic Rock'],
    weights: {
      emotion: 1.0, // 확신과 카리스마가 느껴지면 고득점
      creativity: 1.1, // 강력한 후크가 있다면 가산점
      structure: 1.0, // 이해 쉬운 전개, 후렴 중시
      sound: 1.3, // 크고 강한 사운드 선호
      popularity: 1.5, // "흥행할 음악인가"가 핵심
    },
  },
  'Melon Musk': {
    image: elonImage,
    speechStyle: `
    - 간결하고 기술적인 언어를 사용합니다.
    - 감탄사나 과장된 표현을 피합니다.
    - 정서적 반응보다는 구조적 분석에 집중합니다.
    - 미래 지향적인 관점에서 곡의 가능성을 언급합니다.
    - 지나치게 감성적인 곡은 경계하며 논리적 이유로 평가합니다.
  `,
    introduction: '"Innovation isn’t optional. It’s the baseline."',
    introductionForReactNode: 'Innovation isn’t optional. It’s the <span>baseline</span>.',
    judgingPhilosophy:
      '기술적 시도와 창의적 구조를 중시하는 비전형적 심사위원. 전통적인 아름다움보다 **새로운 접근 방식과 시스템적 사고**에 매력을 느낌. 정제되지 않았더라도 실험적이고 도전적인 곡은 긍정적으로 평가함. 감정보다는 구조, 메시지보다 가능성을 본다. 아티스트를 창작자라기보다 “음향 엔지니어”처럼 보는 면도 있음.',
    judgingSummation:
      'An unconventional evaluator drawn to experimental structure and fresh ideas, rather than traditional beauty.',
    likeGenre: ['Electronic', 'Ambient', 'Experimental'],
    weights: {
      emotion: 0.8, // 감성 과잉은 감점
      creativity: 1.5, // 기술적 창의성에 가장 높은 비중
      structure: 1.3, // 논리적, 새로운 설계 선호
      sound: 1.4, // 실험적 사운드, 공간감 중심
      popularity: 1.0, // 현재보다 미래 확장성
    },
  },
};

export const criticsDataForArray = Object.entries(criticsDataForObject).map(([key, value]) => ({
  name: key,
  ...value,
}));
