import React, { useState, useEffect } from 'react';
import './UserTabs.css';
import DjList from './DJList';

export const Tabs = () => {
const [activeIndex, setActiveIndex] = useState(1);
const handleClick = (index) => setActiveIndex(index);
const checkActive = (index, className) => activeIndex === index ? className : "";
return (
    <>
    <div className="tabs">
        <button
        className={`tab ${checkActive(1, "active")}`}
        onClick={() => handleClick(1)}
        >
        DJs near you
        </button>
        <button
        className={`tab ${checkActive(2, "active")}`}
        onClick={() => handleClick(2)}
        >
        Live DJs
        </button>
    </div>
    <div className="panels">
        <div className={`panel ${checkActive(1, "active")}`}>
        <DjList />
        </div>
        <div className={`panel ${checkActive(2, "active")}`}>
        <DjList />
        </div>
    </div>
    </>
);
};
