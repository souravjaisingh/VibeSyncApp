import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GetSongsByEventId, GetSongsUsingSearchTerm } from './services/SongsService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import './SongSearch.css';
import { MyContext } from '../App';
import { GetEventByEventId } from './services/EventsService';

function SongSearch() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const rowDataString = searchParams.get('data');
    const qrcodeParam = searchParams.get('qrcode');
    const urlEventId = searchParams.get('eventId');
    const urlUserId = searchParams.get('userId');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [enqueuedSongs, setEnqueuedSongs] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [currentPage, setCurrentPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [isListOpen, setListOpen] = useState(false);
    const tableRef = useRef(null);
    const [eventData, setEventData] = useState(null);


    useEffect(() => {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers
    }, [])
    // Add a check for qrcodeParam and local storage here
    useEffect(() => {
        if (qrcodeParam === 'true') {
            // Check if local storage contains userId and jwt key
            const userId = localStorage.getItem('userId');
            const jwtKey = localStorage.getItem('jwt');

            if (userId && jwtKey) {
                // Local storage contains userId and jwt key, proceed to load the component
                return;
            } else {
                // Redirect to the Home page for login
                localStorage.setItem('redirectUrl', location.pathname + '' + location.search);
                navigate('/'); // Adjust the route as needed
            }
        }
    }, [qrcodeParam, navigate]);

    useEffect(() => {
        if (qrcodeParam === 'true' && localStorage.getItem('jwt') == null) {
            return; // Skip the execution of this useEffect
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await GetSongsUsingSearchTerm(searchQuery, ((currentPage - 1) * 20) + 1, 20);
                const newData = response;
                setResults((prevData) => [...prevData, ...newData]);
                setCurrentPage((prevPage) => prevPage + 1);
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        // Fetch enqueued songs after eventData is set
        const handleScroll = () => {
            const table = tableRef.current;
            if (table && table.scrollTop + table.clientHeight >= table.scrollHeight && !loading) {
                fetchData();
            }
        };

        const table = tableRef.current;
        if (table) {
            table.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (table) {
                table.removeEventListener('scroll', handleScroll);
            }
        };
    }, [currentPage, loading, searchQuery, eventData]);

    // Function to handle changes in the search input
    const handleSearchChange = (event) => {
        const newQuery = event.target.value;
        setSearchQuery(newQuery);
        clearTimeout(typingTimeout);
        if (newQuery.trim() !== '') {
            const newTypingTimeout = setTimeout(() => {
                fetchResultsFromAPI(newQuery);
            }, 400);
            setTypingTimeout(newTypingTimeout);
        } else {
            setResults([]);
        }
    };

    // Function to fetch results from the API
    const fetchResultsFromAPI = async (query) => {
        try {
            const res = await GetSongsUsingSearchTerm(query, 0, 20);
            setResults(res);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error in fetchResultsFromAPI:', error);
        }
    };

    useEffect(async () => {
        if (qrcodeParam === 'true' && localStorage.getItem('jwt') == null) {
            return; // Skip the execution of this useEffect
        }
        async function fetchEnqSongs(eventId) {
            try {
                const response = await GetSongsByEventId(eventId, localStorage.getItem('isUser') == 'true' ? true : false);
                setEnqueuedSongs(response);
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching data:', error);
            }
        }

        // Fetch event data if qrcodeParam is true and eventData is not already set
        if (qrcodeParam === 'true' && !eventData) {
            try {
                const response = await GetEventByEventId(urlEventId, urlUserId);
                setEventData(response);
                if (response != null) {
                    fetchEnqSongs(response.id);
                }
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching data:', error);
            }
        } else if (!eventData) {
            // If qrcodeParam is not true and eventData is not set, use rowData as is
            setEventData(JSON.parse(decodeURIComponent(rowDataString)));
        } else if (enqueuedSongs == null) {
            // If eventData is already set, fetch enqueued songs
            fetchEnqSongs(eventData.eventId != null ? eventData.eventId : eventData.id);
        }
    }, [qrcodeParam, urlEventId, urlUserId, eventData]);


    const handleRowClick = (data) => {
        if (eventData) {
            eventData.eventId = eventData.id;
            delete eventData.id;

            data.songId = data.id;
            delete data.id;

            const concatenatedJson = { ...eventData, ...data };
            const rowDataString = encodeURIComponent(JSON.stringify(concatenatedJson));

            localStorage.removeItem('redirectUrl');
            navigate(`/paymentIndex?data=${rowDataString}`);
        }
    };

    const toggleList = () => {
        setListOpen(!isListOpen);
    };

    // Render the detailed view using the data from the selected row
    return (
        <div className='song-search'>
            {eventData && (
                <div className="search-container">
                    <div className="left-content">
                        <img
                            src={eventData.djPhoto}
                            alt="DJ Image"
                            style={{ width: '300px', height: 'auto' }}
                            className='dj-image'
                        />
                    </div>
                    <div className="right-content">
                        <p className='dj-name'>{eventData.djName}</p>
                        <p className='text-muted event-name'>{eventData.eventName}</p>
                        <p className='text-muted event-desc'>{eventData.eventDescription}</p>
                    </div>
                </div>
            )}
            <ul style={{ listStyleType: 'circle' }}>
                <li>
                    <em className="text-muted small info">~ Once the DJ approves, your song will be listed below.</em>
                </li>
                <li>
                    <em className="text-muted small info">~ To view 'Your Requests,' navigate to the menu bar.</em>
                </li>
                <li>
                    <em className="text-muted small info">~ Should the DJ decline your request, a refund will be issued to your original payment method.</em>
                </li>
                <li>
                    <em className="text-muted small info">~ If DJ accepts the request and doesn't play your song within 30 mins, you'll be issued a full refund.</em>
                </li>
            </ul>
            <div className="custom-toggle-bar" onClick={toggleList}>
                <span className="toggle-label">Accepted Requests</span>
                <span className={`toggle-icon ${isListOpen ? 'rotate' : ''}`}></span>
            </div>
            {isListOpen && (
                <div className="collapsible-list">
                    <MDBTable align='middle' responsive className='collapsible-table'>
                        <MDBTableBody>
                            {enqueuedSongs && enqueuedSongs.map((result, index) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={result.image}
                                            style={{ width: '45px', height: '45px' }}
                                            className='rounded-circle'
                                        />
                                    </td>
                                    <td>
                                        <p className='fw-bold mb-1'>{result.songName}</p>
                                        <p className='text-muted mb-0'>
                                            {result.artistName}
                                        </p>
                                    </td>
                                    <td>{result.albumName}</td>
                                </tr>
                            ))}
                        </MDBTableBody>
                    </MDBTable>
                </div>
            )}

            <div className="search-page">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Type your search here..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className='container-for-table' style={{ maxHeight: '400px', overflow: 'auto' }} ref={tableRef}>
                    <MDBTable align='middle' responsive hover>
                        <MDBTableBody>
                            {results && results.map((result, index) => (
                                <tr key={index} onClick={(e) => { handleRowClick(result) }}>
                                    <td>
                                        <img
                                            src={result.album.images[result.album.images.length - 1].url}
                                            alt={`Album Cover for ${result.album.name}`}
                                            style={{ width: '45px', height: '45px' }}
                                            className='rounded-circle'
                                        />
                                    </td>
                                    <td>
                                        <p className='fw-bold mb-1'>{result.name}</p>
                                        <p className='text-muted mb-0'>
                                            {result.artists.map((artist) => artist.name).join(', ')}
                                        </p>
                                    </td>
                                    <td>{result.album.name}</td>
                                </tr>
                            ))}
                        </MDBTableBody>
                    </MDBTable>
                    {loading && <p>Loading...</p>}
                </div>
            </div>
        </div>
    );

}

export default SongSearch;
