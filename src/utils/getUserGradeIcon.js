import user_grade1Icon from '../assets/images/icon/grade-icon/user_Grade01-icon.svg';
import user_grade2Icon from '../assets/images/icon/grade-icon/user_Grade2-icon.svg';
import user_grade3Icon from '../assets/images/icon/grade-icon/user_Grade3-icon.svg';
import user_grade4Icon from '../assets/images/icon/grade-icon/user_Grade4-icon.svg';
import user_grade5Icon from '../assets/images/icon/grade-icon/user_Grade5-icon.svg';

export const getUserGradeIcon = grade => {
  const obj = {
    New: user_grade1Icon,
    Indie: user_grade2Icon,
    Rising: user_grade3Icon,
    Top: user_grade4Icon,
    Legend: user_grade5Icon,
  };

  return obj[grade] || null;
};
