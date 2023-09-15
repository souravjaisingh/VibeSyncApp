import React, { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function ToggleButtonComponent() {
const [alignment, setAlignment] = useState('user'); // Initialize to 'user'

const handleAlignment = (event, newAlignment) => {
if (newAlignment !== null) {
    setAlignment(newAlignment);
    // You can add your logic here when the toggle changes
    if (newAlignment === 'user') {
    // Handle 'User' side
    functionWhenUserSide();
    } else if (newAlignment === 'dj') {
    // Handle 'DJ' side
    functionWhenDjSide();
    }
}
};

// Define the functions to call when 'User' and 'DJ' sides are active
const functionWhenUserSide = () => {
console.log('User side is active');
};

const functionWhenDjSide = () => {
console.log('DJ side is active');
};

return (
<ToggleButtonGroup
    value={alignment}
    exclusive
    onChange={handleAlignment}
>
    <ToggleButton value="user" aria-label="user">
    User
    </ToggleButton>
    <ToggleButton value="dj" aria-label="dj">
    DJ
    </ToggleButton>
</ToggleButtonGroup>
);
}

export default ToggleButtonComponent;
