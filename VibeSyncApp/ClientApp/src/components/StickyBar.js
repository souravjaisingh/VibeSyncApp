import React, { useState, useEffect } from 'react';
import './StickyBar.css';

const getRandomIndex = (array) => {
    return Math.floor(Math.random() * array.length);
};

const getRandomAmount = (minAmount) => {
    return minAmount + Math.floor(Math.random() * 31) + 30;
};

const StickyBar = ({ type, data, minAmount, isVisible, onClose }) => {
    const [currentItem, setCurrentItem] = useState(data[getRandomIndex(data)]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentItem(data[getRandomIndex(data)]);
        }, 3000); // Change content every 3 seconds

        return () => clearInterval(interval);
    }, [data]);

    const renderContent = () => {
        if (type === 'review') {
            return (
                <>
                    <img src={currentItem.image} alt={currentItem.author} className="review-image" />
                    <div className="text-content">
                        <span className="stars">{'★'.repeat(Math.floor(Math.random() * 2) + 4)}</span>
                        <p className="review-text">{currentItem.text}</p>
                        <p className="author">- {currentItem.author}</p>
                    </div>
                </>
            );
        } else if (type === 'bid') {
            const amount = getRandomAmount(minAmount);
            return (
                <p className="bid-message">{`${currentItem.text} INR ${amount} .`}</p>
            );
        }
    };

    if (!isVisible) return null;

    return (
        <div className="sticky-bar">
            <div className="content">
                {renderContent()}
            </div>
            <button className="close-button" onClick={onClose} style={{ color: "white" } } > × </button>
        </div>
    );
};

export default StickyBar;