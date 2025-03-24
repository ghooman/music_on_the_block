import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 *
 * @param {string} lyrics : 생성된 가사 데이터
 * @param {object} melodyData : 음악 생성 참고 데이터
 * @param {function} setMusic : 생성된 음악 정보 저장 setter 함수
 */
const GeneratedMusic = ({ lyrics, melodyData, setMusic }) => {
    const [loading, setLoading] = useState(false);
    const [generatedResult, setGeneratedResult] = useState({
        audio_file: 'https://files.topmediai.com/aimusic/api/385c7953-dd4a-42f1-9a45-58be3b308795-audio.mp3',
        image_file: 'https://files.topmediai.com/aimusic/10331247/f4d9a528-1069-414f-bade-74d494b1e89f-image.png',
        item_uuid: '385c7953-dd4a-42f1-9a45-58be3b308795',
        lyric: `**Verse 1**  
그대의 눈빛 속에, 내 모든 날들이  
상실의 바람에, 날려가 버렸죠  
한 때의 약속들, 이제는 아픈 기억  
이별의 그림자, 내 맘을 감쌉니다  

**Chorus**  
사랑해도 그리워도, 끝내 닿지 못하나요  
하늘을 바라보면, 그대가 보이네요  
가슴 깊은 곳에서, 울리는 그리움  
잊지 못한 사랑, 내 마음을 적십니다  

**Verse 2**  
가득한 추억이, 먼지처럼 쌓여  
매일 그 자리에, 그대가 남아있죠  
손끝에 닿았던, 사랑의 속삭임  
이젠 먼 이야기, 바람에 실려가요  

**Chorus**  
사랑해도 그리워도, 끝내 닿지 못하나요  
하늘을 바라보면, 그대가 보이네요  
가슴 깊은 곳에서, 울리는 그리움  
잊지 못한 사랑, 내 마음을 적십니다  

**Bridge**  
기억 저편에, 그대의 미소가  
내 맘을 따스히, 감싸고 있던가 
언젠가 다시 만날 수 없다면  
다시 사랑할 수 있을까요  

**Chorus**  
사랑해도 그리워도, 끝내 닿지 못하나요  
하늘을 바라보면, 그대가 보이는 거 같은데 그대가 아니네요  
가슴 깊은 곳에서, 울리는 그리움  
잊지 못한 사랑, 내 마음을 적십니다`,
        tag: `
                    느낌은 Love
                    장르는 R&B
                    스타일은 Excitement
                    악기는 Piano가 꼭 들어갔으면 좋겠습니다.
                `,
        title: '가사',
    });

    console.log(generatedResult);

    useEffect(() => {
        const generatedMusic = async () => {
            const formData = {
                is_auto: 0,
                prompt: `
                    느낌은 ${melodyData?.melody_tag?.join(', ')}
                    장르는 ${melodyData?.melody_genre[0]}
                    스타일은 ${melodyData?.melody_style[0]}
                    악기는 ${melodyData?.melody_instrument[0]}가 꼭 들어갔으면 좋겠습니다.
                `,
                lyrics: lyrics,
                title: '가사',
                instrumental: 0,
            };
            try {
                setLoading(true);
                const res = await axios.post('/v1/music', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'f47d348dc08d492492a7a5d546d40f4a', // 필요한 경우 API 키를 추가하세요.
                    },
                });
                setGeneratedResult(res.data);
                console.log('handleSubmit', res.data);
            } catch (err) {
                alert('에러 발생함.');
                console.log('handleSubmit', err.message);
            } finally {
                setLoading(false);
            }
        };
        // generatedMusic();
    }, []);

    if (loading) return <div>loading</div>;

    return <div>노우래 생성</div>;
};

export default GeneratedMusic;
