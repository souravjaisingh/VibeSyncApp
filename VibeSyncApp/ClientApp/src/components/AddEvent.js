import React, { useState } from 'react';
import axios from 'axios';

const AddEvent = () => {
const [address, setAddress] = useState('');
const [latitude, setLatitude] = useState('');
const [longitude, setLongitude] = useState('');

const handleAddressChange = async (event) => {
    const enteredAddress = event.target.value;
    setAddress(enteredAddress);

    try {
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        enteredAddress
        )}&key=YOUR_API_KEY`
    );

    if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
    } else {
        // Handle error, e.g., display a message to the user
        console.error('Geocoding error:', response.data.status);
        setLatitude('');
        setLongitude('');
    }
    } catch (error) {
    // Handle network or other errors
    console.error('Error fetching geocoding data:', error);
    setLatitude('');
    setLongitude('');
    }
};

return (
    <div>
    <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={handleAddressChange}
    />
    <div>
        Latitude: {latitude}
    </div>
    <div>
        Longitude: {longitude}
    </div>
    </div>
);
};

export default AddEvent;
