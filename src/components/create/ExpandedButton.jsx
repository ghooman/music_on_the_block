import { useLayoutEffect, useRef, useState } from 'react';

import './ExpandedButton.scss';

const ExpandedButton = ({ children, className, style, onClick, disabled }) => {
    let buttonRef = useRef(null);
    let spanRef = useRef(null);

    useLayoutEffect(() => {
        const updateBorderColor = () => {
            if (!buttonRef.current || !spanRef.current) return;

            const bgColor = window.getComputedStyle(buttonRef.current).backgroundColor;
            const borderColor = window.getComputedStyle(buttonRef.current).borderColor;

            spanRef.current.style.borderColor = disabled ? borderColor : bgColor;
        };
        setTimeout(updateBorderColor, 0);
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
