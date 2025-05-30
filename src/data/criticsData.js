import jinwooYooImage from '../assets/images/evaluation/judge-img01.png';
import drexxImage from '../assets/images/evaluation/judge-img02.png';
import elaraMoonImage from '../assets/images/evaluation/judge-img03.png';

// 세부 스텟은..나중에..

export const criticsDataForObject = {
  'Jinwoo Yoo': {
    image: jinwooYooImage,
    style: '정중한',
    introduction: '"Soul first, sound second."',
    introductionForReactNode: '<span>Soul</span> first, sound second.',
    likeGenre: ['K-POP', 'POP', 'Nursery rhyme'],
    important: ['emotion (매우 엄격함, 평균 미만일 경우 60점 미만)'],
  },
  Drexx: {
    image: drexxImage,
    style: '직설적이고 남성적인',
    introduction: '"No flow? No mercy. Off-beat? Game over."',
    introductionForReactNode: 'No <span>flow?</span> No mercy. Off-beat? Game over.',
    likeGenre: ['HIP-HOP', 'Rock', 'Metal'],
    important: ['structure (엄격함)'],
  },
  'Elara Moon': {
    image: elaraMoonImage,
    style: '세련된',
    introduction: '"Between the Melody, she finds the truth."',
    introductionForReactNode: 'Between the <span>Melody</span>, she finds the truth.',
    likeGenre: ['Ballad', 'Acoustic'],
    important: ['creativity (파격적인 시도를 높게 평가함. 평범한 곡일수록 낮은 점수 부여)'],
  },
};

export const criticsDataForArray = Object.entries(criticsDataForObject).map(([key, value]) => ({
  name: key,
  ...value,
}));
