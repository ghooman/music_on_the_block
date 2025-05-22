import jinwooYooImage from '../assets/images/evaluation/persona-user01.png';
import drexxImage from '../assets/images/evaluation/persona-user02.png';
import elaraMoonImage from '../assets/images/evaluation/persona-user03.png';

// 세부 스텟은..나중에..

export const criticsDataForObject = {
  'Jinwoo Yoo': {
    image: jinwooYooImage,
  },
  Drexx: {
    image: drexxImage,
  },
  'Elara Moon': {
    image: elaraMoonImage,
  },
};

export const criticsDataForArray = Object.entries(criticsDataForObject).map(([key, value]) => ({
  name: key,
  ...value,
}));
