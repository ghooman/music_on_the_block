// export const formatUtcTime = (time) => {
//   if (!time) {
//     time = new Date().toISOString().slice(0, 19);
//   }

//   const date = new Date(`${time}+09:00`);
//   const utcDate = new Date(date.toUTCString());

//   const weekday = utcDate.toLocaleString('en-US', { weekday: 'short' });
//   const month = utcDate.toLocaleString('en-US', { month: 'short' });
//   const day = utcDate.getUTCDate().toString().padStart(2, '0');
//   const year = utcDate.getUTCFullYear();
//   const hours = utcDate.getUTCHours().toString().padStart(2, '0');
//   const minutes = utcDate.getUTCMinutes().toString().padStart(2, '0');
//   const seconds = utcDate.getUTCSeconds().toString().padStart(2, '0');

//   return `${weekday}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} UTC+0`;
// };

// // Sat, 04 Nov 2024 14:45:09 UTC+20
// export const formatLocalTime = (time) => {
//   // time 값이 없으면 현재 시간을 기본으로 사용합니다.
//   if (!time) {
//     time = new Date().toISOString().slice(0, 19);
//   }

//   const date = new Date(`${time}+09:00`);

//   // 로컬 시간대 기준의 날짜 및 시간 정보 추출
//   const weekday = date.toLocaleString('en-US', { weekday: 'short' });
//   const month = date.toLocaleString('en-US', { month: 'short' });
//   const day = date.getDate().toString().padStart(2, '0');
//   const year = date.getFullYear();
//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   const seconds = date.getSeconds().toString().padStart(2, '0');

//   // 사용자의 로컬 타임존 오프셋 계산 (분 단위 반환, UTC와의 차이)
//   // getTimezoneOffset()는 UTC와의 차이를 분 단위로 반환하며, 양수면 UTC보다 느림
//   const offsetTotal = -date.getTimezoneOffset(); // 예: offsetTotal이 -300이면 UTC-5, 300이면 UTC+5
//   const offsetHours = Math.floor(Math.abs(offsetTotal) / 60);
//   const offsetMinutes = Math.abs(offsetTotal) % 60;
//   const sign = offsetTotal >= 0 ? '+' : '-';
//   const formattedOffset =
//     offsetMinutes === 0
//       ? `UTC${sign}${offsetHours}`
//       : `UTC${sign}${offsetHours}:${offsetMinutes.toString().padStart(2, '0')}`;

//   return `${weekday}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${formattedOffset}`;
// };

const formatISODate = (time) => {
  if (!time) {
    console.error('Invalid time input:', time);
    return null;
  }

  // Date 객체인지 확인 후 ISO 문자열로 변환
  if (time instanceof Date) {
    return time.toISOString();
  }

  if (typeof time !== 'string') {
    console.error('Invalid time input (not string or Date object):', time);
    return null;
  }

  // 공백을 T로 변환하여 Safari에서도 인식 가능하게 변경
  let formattedTime = time.replace(' ', 'T');

  // Safari 호환성을 위해 'YYYY-MM-DDTHH:mm:ss' 형식으로 변환 후 UTC 보정
  if (!formattedTime.endsWith('Z')) {
    formattedTime += 'Z'; // UTC 시간을 보장하기 위해 Z 추가
  }

  return formattedTime;
};

export const formatUtcTime = (time, set = 9) => {
  if (!time) {
    console.error('editUtcTime received invalid time:', time);
    return 'Invalid Date';
  }

  const formattedTime = formatISODate(time);
  if (!formattedTime) return 'Invalid Date';

  const date = new Date(formattedTime);
  const timeitme = new Date(date.getTime() - set * 60 * 60 * 1000);
  if (isNaN(date.getTime())) {
    console.error('Invalid Date after parsing:', formattedTime);
    return 'Invalid Date';
  }

  return timeitme.toUTCString().replace('GMT', ' UTC+0'); // 원하는 형식으로 변환
};

//=============

//=============

//=============

//=============
export const formatLocalTime = (
  time,
  set = 9,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
) => {
  if (!time) {
    console.error('editLocaleTime received invalid time:', time);
    return 'Invalid Date';
  }

  const formattedTime = formatISODate(time);
  if (!formattedTime) return 'Invalid Date';

  const date = new Date(formattedTime);

  if (isNaN(date.getTime())) {
    console.error('Invalid Date after parsing:', formattedTime);
    return 'Invalid Date';
  }

  // Intl.DateTimeFormat을 사용하여 지정한 timeZone의 로컬 시간으로 변환
  const formatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    // timeZone, // 인자로 받은 timeZone 사용 (예: "Asia/Seoul", "Europe/London" 등)
    timeZoneName: 'short',
  });

  let formattedString = formatter.format(date - set * 60 * 60 * 1000);

  // Safari에서 자동 삽입된 ' at ' 제거
  formattedString = formattedString.replace(' at ', ' ');

  // 연도 뒤 쉼표 제거 (예: "13 Feb 2025, 23:28:12" → "13 Feb 2025 23:28:12")
  formattedString = formattedString.replace(/(\d{4}),/, '$1');

  // Safari와 Chrome의 타임존 표기 차이를 보정
  formattedString = formattedString.replace('GMT', 'UTC');

  return formattedString;
};
