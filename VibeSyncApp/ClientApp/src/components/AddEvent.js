import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddEvent.css';
import { redirect } from 'react-router-dom';
import { addEventByUseridHelper } from '../Helpers/EventsHelper';

const AddressTypeahead = () => {
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [theme, setTheme] = useState('');
    const [venueName, setVenueName] = useState('');
    const [eventStartTime, setStartEventTime] = useState('');
    const [eventEndTime, setEndEventTime] = useState('');
    const [minimumBid, setMinimumBid] = useState('');
    const [eventDesc, SetEventDesc] = useState('');


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
            setSelectedSuggestion(null); // Clear selected suggestion
            setSuggestions([]); // Clear suggestions
        } else {
            // Handle error, e.g., display a message to the user
            console.error('Geocoding error:', response.data.status);
            setLatitude('');
            setLongitude('');
            setSelectedSuggestion(null); // Clear selected suggestion
            setSuggestions([]); // Clear suggestions
        }
        } catch (error) {
        // Handle network or other errors
        console.error('Error fetching geocoding data:', error);
        setLatitude('');
        setLongitude('');
        setSelectedSuggestion(null); // Clear selected suggestion
        setSuggestions([]); // Clear suggestions
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setAddress(suggestion);
        setSelectedSuggestion(suggestion);
        setSuggestions([]); // Clear suggestions
    };
    
    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const handleVenueNameChange = (event) => {
        setVenueName(event.target.value);
    };

    const handleStartEventTimeChange = (event) => {
        setStartEventTime(event.target.value);
    };
    const handleEndEventTimeChange = (event) => {
        setEndEventTime(event.target.value);
    };
    const handleEventDescriptionChange = (event) =>{
        SetEventDesc(event.target.value);
    }
    const handleMinimumBidChange = (event) => {
        // Ensure that only numbers are allowed for minimum bid
        const input = event.target.value;
        if (/^\d*\.?\d*$/.test(input)) {
            setMinimumBid(input);
        }
    };
    const handleSubmit  = async () => {
        
        // Validation: Check if any input field is empty
        setAddress('12.12345,14.345678');
        if (!address || !theme || !venueName || !eventDesc
            || !eventStartTime || !eventEndTime || !minimumBid) {
            // Display an error message or handle validation error as needed
            console.error('All fields are mandatory');
            if (eventStartTime > eventEndTime) {
                // Display an error message or handle the validation error as needed
                console.error('Event end time cannot be earlier than event start time');
                // Don't proceed with the API call
            }
        }
        else{
            var res = await addEventByUseridHelper(
                localStorage.getItem('userId')
                ,theme
                ,eventDesc
                ,venueName
                ,eventStartTime
                ,eventEndTime
                ,12.123456  //modify once google maps api gets implemented
                ,44.765432
                ,minimumBid
                )
        }
        
    }
    // Fetch suggestions as the user types
    useEffect(() => {
        if (address.length > 2) {
        axios
            .get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                address
            )}&key=YOUR_API_KEY`
            )
            .then((response) => {
            if (response.data.status === 'OK') {
                setSuggestions(response.data.predictions.map((prediction) => prediction.description));
            } else {
                // Handle error, e.g., display a message to the user
                console.error('Autocomplete error:', response.data.status);
                setSuggestions([]);
            }
            })
            .catch((error) => {
            // Handle network or other errors
            console.error('Error fetching autocomplete data:', error);
            setSuggestions([]);
            });
        } else {
        setSuggestions([]);
        }
    }, [address]);

    return (
        <div className="address-typeahead">
    <form className='event-form'>
        <p>All the fields are mandatory<span style={{ color: 'red' }}>*</span></p>
        <div className="input-group">
            <label htmlFor="searchInput">Enter the event location</label>
            <input
                type="text"
                id="searchInput"
                placeholder="Event location"
                className='event-input-fields'
                value={address}
                onChange={handleAddressChange}
            />
        </div>
        {suggestions.length > 0 && (
            <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={suggestion === selectedSuggestion ? 'selected' : ''}
                    >
                        {suggestion}
                    </li>
                ))}
            </ul>
        )}

        <div className="input-group">
            <label htmlFor="eventNameInput">Event Name</label>
            <input
                type="text"
                id="eventNameInput"
                placeholder="Event Name"
                className='event-input-fields'
                value={theme}
                onChange={handleThemeChange}
            />
        </div>
        <div className="input-group">
            <label htmlFor="venueNameInput">Name of the venue</label>
            <input
                type="text"
                id="venueNameInput"
                placeholder="Name of the venue"
                className='event-input-fields'
                value={venueName}
                onChange={handleVenueNameChange}
            />
        </div>
        <div className="input-group">
            <label htmlFor="eventStartTimeInput">Event Start timings</label>
            <input
                type="datetime-local"
                id="eventStartTimeInput"
                placeholder="Event Start timings"
                className='event-input-fields'
                value={eventStartTime}
                onChange={handleStartEventTimeChange}
            />
        </div>
        <div className="input-group">
            <label htmlFor="eventEndTimeInput">Event end timings</label>
            <input
                type="datetime-local"
                id="eventEndTimeInput"
                placeholder="Event end timings"
                className='event-input-fields'
                value={eventEndTime}
                onChange={handleEndEventTimeChange}
            />
            {eventEndTime && eventStartTime && eventEndTime <= eventStartTime
                && <span className="error-message">End date time must be greater than start date time</span>}
        </div>
        <div className="input-group">
            <label htmlFor="eventDescriptionInput">Event description</label>
            <input
                type="text"
                id="eventDescriptionInput"
                placeholder="Event description"
                className='event-input-fields'
                value={eventDesc} 
                onChange={handleEventDescriptionChange}
            />
        </div>
        <div className="input-group">
            <label htmlFor="minimumBidInput">Minimum bid</label>
            <input
                type="text"
                id="minimumBidInput"
                placeholder="Minimum bid"
                className='event-input-fields'
                value={minimumBid}
                onChange={handleMinimumBidChange}
            />
        </div>
        <button onClick={() => handleSubmit()} type="submit" className="btn btn--primary btn--medium btn-pay">Add event</button>
    </form>
</div>

    );
};

export default AddressTypeahead;
