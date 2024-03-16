import React, { useState } from 'react';
import './Promocode.css'; // Import CSS file for styling

function Promocode({ onApply }) {
    const [promoCode, setPromoCode] = useState('');
    const [isPromoValid, setIsPromoValid] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    const handleInputChange = (e) => {
        setPromoCode(e.target.value);
    };

    const handleApply = () => {
        if (promoCode.toLowerCase() === 'vibe50') {
            setIsPromoValid(true);
            setIsApplied(true);
            onApply(true);
        } else {
            setIsPromoValid(false);
            setIsApplied(true);
            onApply(false);
        }
    };

    const handleRemove = () => {
        setPromoCode('');
        setIsPromoValid(false);
        setIsApplied(false);
        onApply(false);
    };

    return (
        <div className="promocode-container">
            <br></br>
            <br></br>
            <input
                type="text"
                placeholder="Enter promocode"
                value={promoCode}
                onChange={handleInputChange}
                className="promocode-input"
            />
            <button onClick={isApplied ? handleRemove : handleApply} className="promocode-button">
                {isApplied ? 'Remove' : 'Apply'}
            </button>
            {isApplied && (
                <span className={`promocode-icon ${isPromoValid ? 'valid' : 'invalid'}`}>
                    {isPromoValid ? '✔' : '✘'}
                </span>
            )}
        </div>
    );
}

export default Promocode;
