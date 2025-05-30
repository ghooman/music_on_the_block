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
    likeGenre: ['Ballad', 'Fork', 'Classic'],
    evaluationWeight: {
      emotion: 0.5,
      creativity: 0.25,
      structure: 0.2,
      sound: 0.1,
      popularity: 0.3,
    },
  },
  Drexx: {
    image: drexxImage,
    style: '직설적이고 남성적인',
    introduction: '"No flow? No mercy. Off-beat? Game over."',
    introductionForReactNode: 'No <span>flow?</span> No mercy. Off-beat? Game over.',
    likeGenre: ['HIP-HOP', 'EDM', 'Soul', 'Rock', 'Metal'],
  },
  'Elara Moon': {
    image: elaraMoonImage,
    style: '세련된',
    introduction: '"Between the Melody, she finds the truth."',
    introductionForReactNode: 'Between the <span>Melody</span>, she finds the truth.',
    likeGenre: ['POP', 'K-POP'],
  },
};

export const criticsDataForArray = Object.entries(criticsDataForObject).map(([key, value]) => ({
  name: key,
  ...value,
}));
