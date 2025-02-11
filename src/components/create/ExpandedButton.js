import './ExpandedButton.scss';

const ExpandedButton = ({ title, borderRadius, buttonColor, color, style, onClick }) => {
    return (
        <button className={`composition__expanded-button`} style={{ ...style, borderColor: buttonColor, borderRadius }}>
            {title} {/** 여기 타이틀 안 넣으면 크기 잡기가 어려워요 */}
            <button
                onClick={onClick}
                className={`expanded-button`}
                style={{ backgroundColor: buttonColor, color, font: 'inherit' }}
            >
                {title}
            </button>
        </button>
    );
};

export default ExpandedButton;
