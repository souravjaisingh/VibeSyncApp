import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GetPlaylistList, GetSongsByEventId, GetSongsList, GetSongsUsingSearchTerm } from './services/SongsService';
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
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [listOfPlaylists, setListOfPlaylists] = useState(null);
    const [activePlaylistId, setActivePlaylistId] = useState(null);


    useEffect(() => {
        if (shouldRefresh) {
            // Reset the state to prevent repeated refresh
            setShouldRefresh(false);

            // Perform the page refresh after a short delay to allow state update
            // setTimeout(() => {
            window.location.reload();
            // }, 100);
        }
    }, [shouldRefresh]);

    useEffect(() => {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers
    }, [])

    useEffect(() => {
        const fetchPlaylistsAndSongs = async () => {
            try {
                const playlists = await GetPlaylistList();
                if (playlists && playlists.length > 0) {
                    setListOfPlaylists(playlists);
                    const firstPlaylistId = playlists[0].id;
                    setActivePlaylistId(firstPlaylistId);
                    const songs = await GetSongsList(firstPlaylistId, 0, 50);
                    setResults(songs);
                }
            } catch (error) {
                console.error('Error fetching playlists or songs:', error);
            }
        };

        fetchPlaylistsAndSongs();
    }, []);

    const handlePlaylistClick = async (playlistId) => {
        try {
            setActivePlaylistId(playlistId);
            const songs = await GetSongsList(playlistId, 0, 50);
            setResults(songs);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    // Add a check for qrcodeParam and local storage here
    useEffect(() => {
        var uri = JSON.parse(decodeURIComponent(rowDataString));
        if (uri && uri.id) {
            console.log(uri);
            localStorage.setItem('qrEventId', uri.id);
            localStorage.setItem('venue', uri.venue);
        }

        if (qrcodeParam === 'true') {
            if (localStorage.getItem('userId') == null && localStorage.getItem('isUser') == null) {
                localStorage.setItem('userId', 0); //0 id means it's Anonymous.
                localStorage.setItem('isUser', true);
                localStorage.setItem('qrEventId', urlEventId);
                setShouldRefresh(true);
            }
            return;
            // Check if local storage contains userId and jwt key
            // const userId = localStorage.getItem('userId');
            // const jwtKey = localStorage.getItem('jwt');

            // if (userId && jwtKey) {
            //     // Local storage contains userId and jwt key, proceed to load the component
            //     return;
            // } else {
            //     // Redirect to the Home page for login
            //     localStorage.setItem('redirectUrl', location.pathname + '' + location.search);
            //     navigate('/'); // Adjust the route as needed
            // }
        }
    }, [qrcodeParam]);

    useEffect(() => {
        // if (qrcodeParam === 'true' && localStorage.getItem('jwt') == null) {
        //     return; // Skip the execution of this useEffect
        // }
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
        setActivePlaylistId(null);
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
        // if (qrcodeParam === 'true' && localStorage.getItem('jwt') == null) {
        //     return; // Skip the execution of this useEffect
        // }
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
                    localStorage.setItem('venue', response.venue);
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
                            style={{ width: '200px', height: 'auto' }}
                            className='dj-image'
                        />
                    </div>
                    <div className="right-content">
                        <p className='dj-name'>{eventData.djName}</p>
                        <p className='text-muted event-name'>{eventData.eventName}</p>
                        <p className='text-muted event-desc'><b>{eventData.eventDescription}</b></p>
                    </div>
                </div>
            )}

            <div className="search-page">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search your song here..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="playlist-buttons">
                    {listOfPlaylists && listOfPlaylists.map((playlist) => (
                        <button
                            key={playlist.id}
                            className={`playlist-button ${playlist.id === activePlaylistId ? 'active' : ''}`}
                            onClick={() => handlePlaylistClick(playlist.id)}
                        >
                            {playlist.name}
                        </button>
                    ))}
                </div>

                <div className='container-for-table' style={{ maxHeight: '400px', overflow: 'auto' }} ref={tableRef}>
                    <MDBTable align='middle' responsive hover>
                        <MDBTableBody>
                            {results && results.map((result, index) => (
                                <tr key={index} className='songs-row' onClick={(e) => { handleRowClick(result) }}>
                                    <td className='custom-td'>
                                        <img
                                            src={result.album.images[result.album.images.length - 1].url}
                                            alt={`Album Cover for ${result.album.name}`}
                                            style={{ width: '50px', height: '50px' }}
                                            className='rounded-circle'
                                        />
                                    </td>
                                    <td className='custom-td'>
                                        <p className='fw-bold mb-1'>{result.name}</p>
                                    </td>
                                    <td className='custom-td'>
                                        <p className='text-muted mb-0'>
                                            {result.artists.map((artist) => artist.name).join(', ')}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </MDBTableBody>
                    </MDBTable>

                    {loading && <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
};



export default SongSearch;
