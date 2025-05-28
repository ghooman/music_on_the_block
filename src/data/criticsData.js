import jinwooYooImage from '../assets/images/evaluation/judge-img01.png';
import drexxImage from '../assets/images/evaluation/judge-img02.png';
import elaraMoonImage from '../assets/images/evaluation/judge-img03.png';

// 세부 스텟은..나중에..

export const criticsDataForObject = {
  'Jinwoo Yoo': {
    image: jinwooYooImage,
    speechStyle: '손절을 부르는 말투',
  },
  Drexx: {
    image: drexxImage,
    speechStyle: '손절을 부르는 말투',
  },
  'Elara Moon': {
    image: elaraMoonImage,
    speechStyle: '손절을 부르는 말투',
  },
};

export const criticsDataForArray = Object.entries(criticsDataForObject).map(([key, value]) => ({
  name: key,
  ...value,
}));
