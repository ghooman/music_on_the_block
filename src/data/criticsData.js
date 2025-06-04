import jinwooYooImage from '../assets/images/evaluation/judge-img01.png';
import drexxImage from '../assets/images/evaluation/judge-img02.png';
import elaraMoonImage from '../assets/images/evaluation/judge-img03.png';

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
    likeGenre: ['K-POP', 'POP', 'Nursery rhyme'],
    important: [
      'emotion (감정 전달이 얼마나 진심 있게 다가오는지, 감정선이 자연스럽고 몰입감을 주는지. 기술보다 ‘느낌’을 중시함.)',
      'creativity (새로운 시도보다 기존의 감정을 "어떻게 표현했는가"에 초점. 감성적인 코드 전개, 예측 가능한 멜로디라도 감정이 묻어나면 긍정적으로 평가)',
      'structure (구조는 비교적 유연하게 봄. 기승전결이 감정 흐름과 어울리면 구조적으로 미흡해도 감안함. 감성에 어울리는 흐름이 있는지 확인)',
      'sound (사운드 퀄리트 자체보단 감정 표현에 얼마나 기여했는지를 평가. 믹싱이 조금 부족해도 감정이 잘 살아있으면 감점 적음)',
      'popularity (감정선이 대중에게 쉽게 전달될 수 있는지를 봄. 따라 부를 수 있는 멜로디, 익숙한 감정 코드에 높은 점수)',
    ],
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
    likeGenre: ['HIP-HOP', 'Rock', 'Metal'],
    important: [
      'emotion (억지 감정보다 거친 날 것의 감정, 진짜 말하려는 게 들리는지를 봄. 억지스러운 감성팔이는 감점.)',
      'creativity (실험성, 독특한 플로우, 사운드의 충돌 등 새로움 자체에 점수 부여. 기성 스타일은 감점 요인)',
      'structure (구조보다는 리듬/전개 흐름의 임팩트와 지루하지 않은가 여부가 기준. 예측 가능한 전개는 마이너스.)',
      'sound (비트, 톤, 믹싱의 강렬함, 날카로움 중시. 터지는 포인트, “와!”할 만한 사운드 있으면 고득점.)',
      'popularity (마니악한 매력도 OK. 대중성과 개성 사이의 균형을 따짐. 단, ‘심심한 곡’은 낮게 평가.)',
    ],
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
      '"해외 음악대학 출신. 영화음악, OST, 예술곡 중심의 커리어. 음악을 “기술과 감정의 교차점”으로 보는 분석가 타입. 감성보다 구성이 중요하다고 생각함. 표현력 부족한 곡은 냉정하게 깎아내리지만, 진심이 보이면 은근히 감동받는 타입."',
    likeGenre: ['Ballad', 'Acoustic'],
    important: [
      'emotion (감정을 억지로 표현했는지, 보컬의 호흡·발음·표정까지 포함해 정교한 감정 표현을 보는 평가. 몰입감도 중요.)',
      'creativity (아이디어가 구조화돼 있고 정제돼 있는가. 무작정 새로운 게 아니라, 논리적으로 설계된 창의성을 중시.)',
      'structure (전체 흐름의 논리성, 기승전결, 브릿지·후렴의 위치와 역할 등을 세부적으로 분석함. 가장 민감한 항목.)',
      'sound (디테일 중심. 믹싱, 이펙팅, 악기 밸런스 등 정교함이 있는지, 지나치게 날것이거나 흐릿한 건 감점.)',
      'popularity (서사에 몰입할 수 있는 곡인가, 감성소비가 가능한가 등 **"무드 유지력"**이 중심. 튀는 것보다 일관성이 중요.)',
    ],
  },
};

export const criticsDataForArray = Object.entries(criticsDataForObject).map(([key, value]) => ({
  name: key,
  ...value,
}));
