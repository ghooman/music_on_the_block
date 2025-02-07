import './Finalize.scss';

const Finalize = ({ children }) => {
    return (
        <div className="craete__finalizes">
            <MusicInfo></MusicInfo>
            <CreatedLyrics></CreatedLyrics>
            <CheckList></CheckList>
            {children}
        </div>
    );
};

export default Finalize;

const MusicInfo = () => {
    const datas = [
        { title: 'Title', value: 'Winter Serenity' },
        { title: 'AI Artist', value: 'Winter Serenity' },
        { title: 'Ai Service', value: 'AI Lyric & Songwriting' },
        { title: 'Genre', value: 'Lyric' },
        { title: 'Style', value: 'POP' },
        { title: 'Stylistic', value: 'Emotional' },
        { title: 'Creation Date', value: 'Sat, 04 Nov 2023 14:40:00 UTC+9' },
        { title: 'Story', value: 'A love story about two people overcoming challenges' },
    ];

    return (
        <div className="music-info">
            <div className="music-info__image">2</div>
            <ul className="music-info__data">
                {datas.map((item) => (
                    <li className="music-info__data--item">
                        <div className="music-info__data--item-title">{item.title}</div>
                        <div className="music-info__data--item-value">{item.value}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CreatedLyrics = () => {
    const lyrics = [
        {
            part: 'Verse1',
            lyric: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
        },
        {
            part: 'Chorus',
            lyric: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        },
        {
            part: 'Verse2',
            lyric: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look",
        },
        {
            part: 'Bridge',
            lyric: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. ',
        },
        {
            part: 'Outro',
            lyric: 'it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search',
        },
    ];

    return (
        <div className="created-lyrics">
            <p className="created-lyrics__title">AI-Generated</p>
            <div className="created-lyrics__items">
                {lyrics.map((item, index) => (
                    <div className="created-lyrics__item">
                        <p className="created-lyrics__item--part">{item.part}</p>
                        <span className="created-lyrics__item--lyric">{item.lyric}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CheckList = () => {
    return (
        <div className="check-list">
            <p className="check-list__title">Final Checklist</p>
            <label className="check-list__items">
                <input type="checkbox"></input>
                <div>
                    <p className="check-list__items--title">Is your work finalized?</p>
                    <span className="check-list__items--desc">
                        Are the lyrics, melody, or both finalized and ready for the next step?
                    </span>
                </div>
            </label>
            <label className="check-list__items">
                <input type="checkbox"></input>
                <div>
                    <p className="check-list__items--title">Does your work align with your vision?</p>
                    <span className="check-list__items--desc">
                        Does the tone, mood, and overall content match what you envisioned?
                    </span>
                </div>
            </label>
            <label className="check-list__items">
                <input type="checkbox"></input>
                <div>
                    <p className="check-list__items--title">Have you reviewed all key details?</p>
                    <span className="check-list__items--desc">
                        Make sure to double-check tags, settings, and content accuracy.
                    </span>
                </div>
            </label>
            <label className="check-list__items">
                <input type="checkbox"></input>
                <div>
                    <p className="check-list__items--title">Are you ready to save or upload your work?</p>
                    <span className="check-list__items--desc">
                        Choose to save your work as a draft or upload it to the community.
                    </span>
                </div>
            </label>
        </div>
    );
};
