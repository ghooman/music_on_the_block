import './ExpandedButton.scss';

const ExpandedButton = ({ title, borderRadius, buttonColor, color, style, onClick, disabled }) => {
    return (
        <button
            className={`composition__expanded-button`}
            onClick={onClick}
            disabled={disabled}
            style={{ borderColor: buttonColor, borderRadius, ...style }}
        >
            {title}
            {/** 여기 타이틀 안 넣으면 크기 잡기가 어려워요 */}
            <div className={`expanded-button`} style={{ backgroundColor: buttonColor, color }}>
                {title}
            </div>
        </button>
    );
};

export default ExpandedButton;
