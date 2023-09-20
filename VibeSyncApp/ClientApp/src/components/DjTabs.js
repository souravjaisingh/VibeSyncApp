import React, { useState, useEffect } from 'react';
import './DjTabs.css';
import DjList from './DJList';
import LiveDjList from './LiveDjList';
import DjEventList from './DjEventList';

export const DjTabs = () => {
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
        Upcoming Events
        </button>
        <button
        className={`tab ${checkActive(2, "active")}`}
        onClick={() => handleClick(2)}
        >
        Live Events
        </button>
    </div>
    <div className="panels">
        <div className={`panel ${checkActive(1, "active")}`}>
        <DjEventList />
        </div>
        <div className={`panel ${checkActive(2, "active")}`}>
        <DjEventList />
        {/* <DatatablePage /> */}
        </div>
    </div>
    </>
);
};
