import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetPlaylistList, GetSongsByEventId, GetSongsList, GetSongsUsingSearchTerm } from './services/SongsService';
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import './SongSearch.css';
import { MyContext } from '../App';
import { GetEventByEventId } from './services/EventsService';
import defaultPhoto from '../Resources/defaultDj.jpg';

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
    const [currentPage, setCurrentPage] = useState(1); // Set initial page to 1
    const [loading, setLoading] = useState(false);
    const [isListOpen, setListOpen] = useState(false);
    const tableRef = useRef(null);
    const [eventData, setEventData] = useState(null);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [listOfPlaylists, setListOfPlaylists] = useState(null);
    const [activePlaylistId, setActivePlaylistId] = useState(null);

    useEffect(() => {
        if (shouldRefresh) {
            setShouldRefresh(false);
            window.location.reload();
        }
    }, [shouldRefresh]);

    useEffect(() => {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers
    }, []);

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
                    setCurrentPage(2); // Reset the current page
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
            setResults([]);
            setCurrentPage(1); // Reset current page when changing playlist
            const songs = await GetSongsList(playlistId, 0, 50);
            setResults(songs);
            setCurrentPage(2); // Set the next page to fetch

            const selectedPlaylist = listOfPlaylists.find(playlist => playlist.id === playlistId);
            if (selectedPlaylist) {
                const playlistName = selectedPlaylist.name.toLowerCase();
                if (playlistName.includes('love')) {
                    showHearts(); // Show hearts animation
                } else if (playlistName.includes('singles')) {
                    showCheers(); // Show cheers animation
                }
            }

        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const showHearts = () => {
        const numHearts = 20; // Number of hearts to show
        for (let i = 0; i < numHearts; i++) {
            createHeart();
        }

        // Set a timeout to remove the hearts after 2-3 seconds
        setTimeout(() => {
            const hearts = document.querySelectorAll('.heart');
            hearts.forEach((heart) => {
                heart.style.opacity = 0; // Set opacity to 0 for a fade-out effect
                setTimeout(() => {
                    heart.remove(); // Remove the heart after it fades out
                }, 1000); // Wait for 1 second before removing the heart
            });
        }, 3000); // Wait for 3 seconds before removing the hearts
    };


    const createHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${2 + Math.random() * 3}s`;
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000); // Remove the heart after the animation is complete
    };

    const showCheers = () => {
        const numCheers = 20; // Number of cheers to show
        for (let i = 0; i < numCheers; i++) {
            createCheer();
        }
    };

    const createCheer = () => {
        const cheer = document.createElement('div');
        cheer.classList.add('cheer');
        cheer.style.left = `${Math.random() * 100}%`;
        cheer.style.animationDuration = `${2 + Math.random() * 3}s`;
        document.body.appendChild(cheer);

        setTimeout(() => {
            cheer.remove();
        }, 5000); // Remove the cheer after the animation is complete
    };

    useEffect(() => {
        var uri = JSON.parse(decodeURIComponent(rowDataString));
        if (uri && uri.id) {
            localStorage.setItem('qrEventId', uri.id);
            localStorage.setItem('venue', uri.venue);
        }

        if (qrcodeParam === 'true') {
            if (localStorage.getItem('userId') == null && localStorage.getItem('isUser') == null) {
                localStorage.setItem('userId', 0); // 0 id means it's Anonymous.
                localStorage.setItem('isUser', true);
                localStorage.setItem('qrEventId', urlEventId);
                setShouldRefresh(true);
            }
            return;
        }
    }, [qrcodeParam]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let newData;
            if (activePlaylistId) {
                //newData = await GetSongsList(activePlaylistId, (currentPage - 1) * 20, 20);
                setLoading(false);
            } else {
                newData = await GetSongsUsingSearchTerm(searchQuery, (currentPage - 1) * 20 + 1, 20);
                setResults((prevData) => [...prevData, ...newData]);
                setCurrentPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const table = tableRef.current;
            if (table && table.scrollTop + table.clientHeight >= table.scrollHeight - 50 && !loading) { // Added a small buffer to trigger fetch
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
    }, [currentPage, loading, searchQuery, activePlaylistId]);

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

    const fetchResultsFromAPI = async (query) => {
        try {
            setResults([]); // Clear previous results
            setCurrentPage(1); // Reset current page
            const res = await GetSongsUsingSearchTerm(query, 0, 20);
            setResults(res);
            setCurrentPage(2); // Set the next page to fetch
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error in fetchResultsFromAPI:', error);
        }
    };

    useEffect(async () => {
        async function fetchEnqSongs(eventId) {
            try {
                const response = await GetSongsByEventId(eventId, localStorage.getItem('isUser') === 'true');
                setEnqueuedSongs(response);
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching data:', error);
            }
        }

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
            setEventData(JSON.parse(decodeURIComponent(rowDataString)));
        } else if (enqueuedSongs == null) {
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

    return (
        <div className='song-search'>
            {eventData && (
                <div className="search-container">
                    <div className="left-content">
                        <img
                            src={eventData.djPhoto || defaultPhoto} // Use default photo if djPhoto is null
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
}

export default SongSearch;