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
import { GetPlaylistList } from './services/SongsService';


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
    const searchParams = new URLSearchParams(location.state ? location.state.rowData : location.state);
    const rowDataString = searchParams.get('data');
    const navigate = useNavigate();
    const rowData = JSON.parse(decodeURIComponent(rowDataString));
    const [isLive, setIsLive] = useState((rowData && (rowData.eventStatus === "Live" || rowData.eventStatus === 'Live-NA')) ? true : false);
    console.log(rowData);
    const [acceptingRequests, setAcceptingRequests] = useState(false);
    const [displayRequests, setDisplayRequests] = useState(false);
    const [hidePlaylist, setHidePlaylist] = useState(false); // Default value is false
    const [minimumBidForSpecialRequest, setMinimumBidForSpecialRequest] = useState('');

    const [playlists, setPlaylists] = useState([]);
    const [checkedPlaylists, setCheckedPlaylists] = useState([]);


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

    const fetchPlaylists = async () => {
        try {
            const playlists = await GetPlaylistList();
            setPlaylists(playlists);
            console.log("inside fetch playlists: ", rowData.playlists);

            if (rowData.playlists) {
                const initialCheckedPlaylists = rowData.playlists.split(',');
                setCheckedPlaylists(initialCheckedPlaylists);
                console.log("Checked playlists after setting: ", initialCheckedPlaylists);
            } else {
                // If no playlists in rowData, check all by default
                const allPlaylistIds = playlists.map(playlist => playlist.id);
                setCheckedPlaylists(allPlaylistIds);
                console.log("All playlists checked by default: ", allPlaylistIds);
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handleCheckboxChange = (playlistId) => {
        setCheckedPlaylists((prevCheckedPlaylists) => {
            if (prevCheckedPlaylists.includes(playlistId)) {
                return prevCheckedPlaylists.filter(id => id !== playlistId);
            } else {
                return [...prevCheckedPlaylists, playlistId];
            }
        });
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
                const playlists = checkedPlaylists.join(',');

                // Prepare the data to be sent
                const eventData = {
                    userId: localStorage.getItem('userId'),
                    theme,
                    eventDesc,
                    venueName,
                    eventStartTime,
                    eventEndTime,
                    latitude: 12.123456,  // Modify once Google Maps API gets implemented
                    longitude: 44.765432,
                    minimumBid,
                    minimumBidForSpecialRequest,
                    acceptingRequests,
                    displayRequests,
                    hidePlaylist,
                    playlists,
                    eventId: rowDataString ? rowData.id : 0,
                    eventStatus: isLive ? 'Live' : 'Not live'

                };

                // Log the data to be sent
                console.log('Data being sent to backend:', eventData);


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
                    , playlists
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
            setMinimumBidForSpecialRequest(rowData.minimumBidForSpecialRequest || null);
            // Set the checked playlists if they are available in rowData
            if (rowData.playlists) {
                setCheckedPlaylists(rowData.playlists.split(','));
            }
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
            setMinimumBidForSpecialRequest(null); // Updated field
            setCheckedPlaylists([]);
        }
    }, []);



    return (
        <div className="address-typeahead-container">
            <div className="address-typeahead">
                <h2 style={{ fontWeight: '700', color: '#39125C', fontSize: '32px', marginTop: '23px', marginBottom: '10px' }}>{rowDataString ? "Update Event" : "Add Event"}</h2>
                <img src="/images/BGMusic.png" alt="Background" className="background-image" style={{ top: '127px', position: 'absolute', height: '156px' }} />
                <form className='event-form'>
                    <div className="header-container">
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
                    </div>
                    <div className="input-group">
                        <label htmlFor="eventNameInput">
                            Event Name <span style={{ color: 'red' }}>*</span>
                        </label>
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
                        <label htmlFor="venueNameInput">
                            Name of the venue <span style={{ color: 'red' }}>*</span>
                        </label>
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
                        <label htmlFor="eventStartTimeInput">
                            Event Start timings<span style={{ color: 'red' }}>*</span>
                        </label>
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
                        <label htmlFor="eventEndTimeInput">
                            Event end timings<span style={{ color: 'red' }}>*</span>
                        </label>
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
                        <label htmlFor="eventDescriptionInput">
                            Event description<span style={{ color: 'red' }}>*</span>
                        </label>
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
                        <label htmlFor="minimumBidInput">
                            Minimum bid<span style={{ color: 'red' }}>*</span>
                        </label>
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

                        <input style={{ width: "13px" }}
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
                            <label htmlFor="minimumBidForSpecialRequestInput" style={{ whiteSpace: "unset" }}>Minimum Bid for Special Request<span style={{ color: 'red' }}>*</span></label>
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

                    {!hidePlaylist && (
                        <div className="playlist-selection">
                            <label style={{ left: '20px' }}>Available Playlists:</label>
                            <div className="playlist-checkboxes" >
                                {playlists.map((playlist) => (
                                    <div key={playlist.id} className="request">
                                        <input
                                            type="checkbox"
                                            id={`playlist-${playlist.id}`}
                                            checked={checkedPlaylists.includes(playlist.id)}
                                            onChange={() => handleCheckboxChange(playlist.id)}
                                        />
                                        <label htmlFor={`playlist-${playlist.id}`}>{playlist.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="button-group">
                        <button type='button' onClick={(event) => handleSubmit(event)} className="btn btn--primary btn--medium btn-pay"> {rowDataString ? 'Update event' : 'Add event'}</button>
                        {rowDataString && (
                            <button type='button' onClick={handleDelete} className="btn btn--danger btn--medium btndel " style={{ color: "red" }}>
                                Delete event
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>

    );
};

export default AddressTypeahead;
