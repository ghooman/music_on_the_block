import './DescriptionBanner.scss';

const texts = [
    {
        title: 'Lyric Lab',
        strong: `"Crafting the Perfect Words for Your Song"`,
        notice: `In this step, you’ll provide the core elements for your song’s lirics. Start by selecting up to 5
                meaningful keywords that capture the essence of your story. Then, choose a genre and emotional style
                that best matches the vibe of your song. Finally, describe the story you want to tell in up to 100
                words. AI will use this information`,
        tip: `Use keywords that represent themes or emotions, such as 'Love,' 'Dream,' or 'Adventure.' Be as
                    descriptive as possible in the story section for the best results`,
    },
    {
        title: 'Melody Maker',
        strong: `"Shape Your Song’s Melody and Sound"`,
        notice: `In this step, you’ll create the melody and instrumentation for your song.
         Choose a genre that complements your lyrics, then set the tempo and select the instruments that will 
         shape your song’s sound. Whether you want a soft piano melody or an energetic guitar riff, AI will 
         compose the perfect musical arrangement to match your vision.`,
        tip: `Experiment with different tempos and instrument combinations to explore various musical styles.`,
    },
    {
        title: 'Album Cover Studio',
        strong: `"Visualize Your Music with Stunning Artwork"`,
        notice: `Transform your song into a visual masterpiece. Based on your keywords, genre, and style, AI will generate a unique album cover that reflects the mood and theme of your song. Customize the colors, textures, and layout to make the design truly yours. Your album cover will represent your music in the most captivating way.`,
        tip: `Consider how your album cover will connect with listeners. A vibrant design might stand out more for energetic tracks, while a minimalistic design might suit a calm, introspective song.`,
    },
    {
        title: 'Finalize Lyrics',
        notice: `Review and finalize the lyrics you’ve crafted. Ensure they align with your vision before saving or sharing.`,
    },
];

const DescriptionBanner = ({ pageNumber }) => {
    const { title, strong, notice, tip } = texts[pageNumber] || {};

    if (!texts[pageNumber]) return <p>데이터가 없습니다.</p>;

    return (
        <div className="create__description-banner  mb40">
            {title && <p className="desc-banner__title">{title}</p>}
            {strong && <strong className="desc-banner__strong">{strong}</strong>}
            {notice && <p className="desc-banner__notice">{notice}</p>}
            {tip && (
                <div className="desc-banner__tip-box">
                    <p className="desc-banner__tip-header">Tip : </p>
                    <p className="desc-banner__tips">{tip}</p>
                </div>
            )}
        </div>
    );
};

export default DescriptionBanner;
