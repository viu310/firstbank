import React, { useEffect, useState } from "react";
import Apiservice from '../../../Apiservice';

const linkStyle = {
    textDecoration: 'none',
};

const LoanCategory = () => {
    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 0; // 필요에 따라 이 임계값을 조절하세요
            const currentScrollY = window.scrollY;

            if (currentScrollY > scrollThreshold && isFixed) {
                setIsFixed(false);
            } else if (currentScrollY <= scrollThreshold && !isFixed) {
                setIsFixed(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isFixed]);

    const categoryStyle = {
        position: isFixed ? 'fixed' : 'absolute',
        right: -570,
        top: '10%',
        width: '100%',
        marginTop: '5%',
        display: 'block',
        zIndex: 1000, // 더 높은 z-index 값으로 설정
    };

    return (
        <div style={categoryStyle}>
            <div>
                <a href="/link-to-additional-service" style={linkStyle}>부가서비스</a>
                {' '}
                {'>'}
                {' '}
                <a href="/link-to-credit-inquiry" style={linkStyle}>신용조회</a>
            </div>
        </div>
    );
}

export default LoanCategory;
