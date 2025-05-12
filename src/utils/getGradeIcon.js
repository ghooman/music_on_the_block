import user_grade1Icon from '../assets/images/icon/grade-icon/user_Grade01-icon.svg';
import user_grade2Icon from '../assets/images/icon/grade-icon/user_Grade2-icon.svg';
import user_grade3Icon from '../assets/images/icon/grade-icon/user_Grade3-icon.svg';
import user_grade4Icon from '../assets/images/icon/grade-icon/user_Grade4-icon.svg';
import user_grade5Icon from '../assets/images/icon/grade-icon/user_Grade5-icon.svg';

import user_square_grade1Icon from '../assets/images/icon/grade-icon/user_square_Grade01-icon.svg';
import user_square_grade2Icon from '../assets/images/icon/grade-icon/user_square_Grade2-icon.svg';
import user_square_grade3Icon from '../assets/images/icon/grade-icon/user_square_Grade3-icon.svg';
import user_square_grade4Icon from '../assets/images/icon/grade-icon/user_square_Grade4-icon.svg';
import user_square_grade5Icon from '../assets/images/icon/grade-icon/user_square_Grade5-icon.svg';

import grade1Icon from '../assets/images/icon/grade-icon/Grade01-icon.svg';
import grade2Icon from '../assets/images/icon/grade-icon/Grade2-icon.svg';
import grade3Icon from '../assets/images/icon/grade-icon/Grade3-icon.svg';
import grade4Icon from '../assets/images/icon/grade-icon/Grade4-icon.svg';
import grade5Icon from '../assets/images/icon/grade-icon/Grade5-icon.svg';

const userGradeSquareIconObj = {
  New: user_square_grade1Icon,
  Indie: user_square_grade2Icon,
  Rising: user_square_grade3Icon,
  Top: user_square_grade4Icon,
  Legend: user_square_grade5Icon,
};

const userGradeIconObj = {
  New: user_grade1Icon,
  Indie: user_grade2Icon,
  Rising: user_grade3Icon,
  Top: user_grade4Icon,
  Legend: user_grade5Icon,
};

const songsGradeIconObj = {
  New: grade1Icon,
  Indie: grade2Icon,
  Rising: grade3Icon,
  Top: grade4Icon,
  Legend: grade5Icon,
};

export const getUserGradeSquareIcon = grade => {
  return userGradeSquareIconObj[grade] || null;
};

export const getUserGradeIcon = grade => {
  return userGradeIconObj[grade] || null;
};

export const getSongsGradeIcon = grade => {
  return songsGradeIconObj[grade] || null;
};
