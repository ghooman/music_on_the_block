import { useLayoutEffect, useRef } from 'react';

import './ExpandedButton.scss';

const ExpandedButton = ({ children, className, style, onClick, disabled }) => {
    let buttonRef = useRef(null);
    let spanRef = useRef(null);

    useLayoutEffect(() => {
        let bgColor = window.getComputedStyle(buttonRef.current).backgroundColor;
        let borderColor = window.getComputedStyle(buttonRef.current).borderColor;

        if (disabled) {
            spanRef.current.style.borderColor = borderColor;
        } else {
            spanRef.current.style.borderColor = bgColor;
        }
    }, [disabled]);

    return (
        <button
            ref={buttonRef}
            className={`${className} composition__expanded-buttons`}
            style={style}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
            <span ref={spanRef} className="composition__expanded-buttons-after"></span>
        </button>
    );
};

export default ExpandedButton;
