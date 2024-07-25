import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './AddEvent.css';
import { Link, redirect } from 'react-router-dom';
import { eventDetailsUpsertHelper } from '../Helpers/EventsHelper';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import QRCodeModal from './QRCodeModal';
import { useLoadingContext } from './LoadingProvider';
import { DeleteEventByEventId } from './services/EventsService';

const AddressTypeahead = () => {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
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
    const { setLoading } = useLoadingContext();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.state?location.state.rowData:location.state);
    const rowDataString = searchParams.get('data');
    const navigate = useNavigate();
    const rowData = JSON.parse(decodeURIComponent(rowDataString));
    const [isLive, setIsLive] = useState((rowData && (rowData.eventStatus === "Live" || rowData.eventStatus === 'Live-NA'))? true:false);
    console.log(rowData);
    const [acceptingRequests, setAcceptingRequests] = useState( false);
    const [displayRequests, setDisplayRequests] = useState( false);
    const [hidePlaylist, setHidePlaylist] = useState(false); // Default value is false
    const [minimumBidForSpecialRequest, setMinimumBidForSpecialRequest] = useState('');




    const twoHoursBeforeCurrentTime = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
    const twoHoursAfterCurrentTime = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);

    const showLiveToggle = rowDataString && (
        new Date(eventStartTime) >= twoHoursBeforeCurrentTime &&
        new Date(eventStartTime) <= twoHoursAfterCurrentTime
    );
    const handleLiveToggle = () => {
        // Handle toggle state changes
        setIsLive(!isLive);
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
    const handleEventDescriptionChange = (event) => {
        SetEventDesc(event.target.value);
    }
    const handleMinimumBidChange = (event) => {
        // Ensure that only numbers are allowed for minimum bid
        const input = event.target.value;
        if (/^\d*\.?\d*$/.test(input)) {
            setMinimumBid(input);
        }
    };

    const handleSpecialRequestMinBidChange = (event) => {
        const input = event.target.value;
        if (/^\d*\.?\d*$/.test(input)) {
            setMinimumBidForSpecialRequest(input);
        }
    };



    //requesting announcement functions

    const handleAcceptingRequestsChange = (event) => {
        const isChecked = event.target.checked;
        setAcceptingRequests(isChecked);
        console.log(event.target.checked);

        // Clear minimumBidForSpecialRequest if both acceptingRequests and displayRequests are false
        if (!isChecked && !displayRequests) {
            setMinimumBidForSpecialRequest(null);
        }
    };

    const handleDisplayRequestsChange = (event) => {
        const isChecked = event.target.checked;
        setDisplayRequests(isChecked);
        console.log(event.target.checked);

        if (!acceptingRequests && !isChecked) {
            setMinimumBidForSpecialRequest(null);
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validation: Check if any input field is empty
        setAddress('12.12345,14.345678');
        if (!theme || !venueName || !eventDesc
            || !eventStartTime || !eventEndTime || minimumBid < 0) {
            // Display an error message or handle validation error as needed
            console.error('All fields are mandatory');
            if (eventStartTime > eventEndTime) {
                // Display an error message or handle the validation error as needed
                console.error('Event end time cannot be earlier than event start time');
                // Don't proceed with the API call
            }
        } else {
            try {
                setLoading(true);

                var res = await eventDetailsUpsertHelper(
                    localStorage.getItem('userId')
                    , theme
                    , eventDesc
                    , venueName
                    , eventStartTime
                    , eventEndTime
                    , 12.123456  // Modify once Google Maps API gets implemented
                    , 44.765432
                    , minimumBid
                    , rowData ? true : false
                    , minimumBidForSpecialRequest // Updated field 
                    , acceptingRequests
                    , displayRequests
                    , hidePlaylist 
                    , rowDataString ? rowData.id : 0
                    , isLive ? 'Live' : 'Not live'


                    
                    
                );
                setLoading(false);
                if (res != null) {
                    console.log(res);
                    navigate('/djhome');
                }
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error in handleSubmit:', error);
            }
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                setLoading(true);
                //await axios.delete(`/api/events/${rowData.id}`);
                await DeleteEventByEventId(rowData.id);
                setLoading(false);
                navigate('/djhome');
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error in handleDelete:', error);
            }
        }
    };

    useEffect(() => {
        console.log("Rowdata is : ", rowData);
        if (rowData != null) {
            setVenueName(rowData.venue);
            setTheme(rowData.eventName)
            setEndEventTime(rowData.eventEndDateTime)
            setStartEventTime(rowData.eventStartDateTime)
            SetEventDesc(rowData.eventDescription)
            setMinimumBid(rowData.minimumBid)
            setAcceptingRequests(rowData.acceptingRequests)
            setDisplayRequests(rowData.displayRequests)
            setHidePlaylist(rowData.hidePlaylist)
            setMinimumBidForSpecialRequest(rowData.minimumBidForSpecialRequest || '');
            
        } else {
            // Reset input fields when rowData becomes null
            setVenueName('');
            setTheme('');
            setEndEventTime('');
            setStartEventTime('');
            SetEventDesc('');
            setMinimumBid('');
            setAcceptingRequests(false);
            setDisplayRequests(false);
            setHidePlaylist(false);
            setMinimumBidForSpecialRequest(''); // Updated field
        }
    }, []);
    
    

    return (
        <div className="address-typeahead">
            <form className='event-form'>
                <p>All the fields are mandatory<span style={{ color: 'red' }}>*</span></p>
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
                    <div className="toggle-container">
                        <label htmlFor="liveToggle">LIVE</label>
                        <div className={`toggle-slider ${isLive ? 'active' : ''}`} onClick={handleLiveToggle}>
                            <div className={`slider-thumb ${isLive ? 'active' : ''}`} />
                        </div>
                    </div>
                
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

                {/*accepting reuests or not*/}
                <div className="request">

                    <input style={{ width : "13px" }}
                        type="checkbox"
                        id="acceptingRequests"
                        checked={acceptingRequests}
                        onChange={handleAcceptingRequestsChange}
                    />
                    <label htmlFor="acceptingRequests">Accept Announcement Requests</label>

                </div>
                <div className="request">

                    <input style={{ width: "13px" }}
                        type="checkbox"
                        id="displayRequests"
                        checked={displayRequests}
                        onChange={handleDisplayRequestsChange}
                    />
                    <label htmlFor="displayRequests">Display Requests on Screen</label>

                </div>
                {(acceptingRequests || displayRequests) && (
                    <div className="input-group">
                        <label htmlFor="minimumBidForSpecialRequestInput">Minimum Bid for Special Request<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            id="minimumBidForSpecialRequestInput"
                            placeholder="Minimum Bid for Special Request"
                            className='event-input-fields'
                            value={minimumBidForSpecialRequest}
                            onChange={handleSpecialRequestMinBidChange}
                            disabled={!(acceptingRequests || displayRequests)}
                        />
                    </div>
                )}

                <div className="request">
                    <input style={{ width: "13px" }}
                        type="checkbox"
                        id="hidePlaylist"
                        checked={hidePlaylist}
                        onChange={(event) => setHidePlaylist(event.target.checked)}
                    />
                    <label htmlFor="hidePlaylist">Hide Available Playlists</label>
                </div>

                <button type='button' onClick={(event) => handleSubmit(event)} className="btn btn--primary btn--medium btn-pay"> {rowDataString ? 'Update event' : 'Add event'}</button>
                {rowDataString && (
                <button type='button' onClick={handleDelete} className="btn btn--danger btn--medium " style={{color: "red"}}>
                    Delete event
                </button>
            )}
            </form>
        </div>

    );
};

export default AddressTypeahead;
