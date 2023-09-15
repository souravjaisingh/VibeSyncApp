import React from 'react';
import './LoginToggleButton.css';
const Switch = ({ isOn, handleToggle, onColor }) => {
return (
    <>
    <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
    />
    <label
        style={{ background: isOn && onColor }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
    >
        <span className={`react-switch-button`} >{isOn ? 'DJ' :'User'}</span>
        {/* <span className={`switch-text-user`}>{isOn ? '' :'User'}</span>
        <span className={`switch-text-dj`}>{isOn ? 'DJ' : ''}</span> */}
    </label>
    {/* <span className="switch-text">{isOn ? 'DJ' : 'User'}</span> */}
    </>
);
};

export default Switch;