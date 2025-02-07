import './Finalize.scss';

const Finalize = ({ children, albumCover }) => {
    return (
        <div className="craete__finalizes">
            <MusicInfo albumCover={albumCover}></MusicInfo>
            <CreatedLyrics></CreatedLyrics>

            {children}
        </div>
    );
};

export default Finalize;

const MusicInfo = ({ albumCover }) => {
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
            <div className="music-info__image" style={{ backgroundImage: `url(${albumCover.image})` }}>
                <div className="music-info__image__feel-box">
                    {albumCover?.feel.map((item) => (
                        <div className="music-info__image__feel-item">{item}</div>
                    ))}
                </div>
            </div>
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
