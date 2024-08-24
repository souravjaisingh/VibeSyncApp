import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetPlaylistList, GetSongsByEventId, GetSongsList, GetSongsUsingSearchTerm } from './services/SongsService';
import './SongSearch.css';
import { MyContext } from '../App';
import { GetEventByEventId } from './services/EventsService';
import StickyBar from './StickyBar';
import { messages } from './Constants';
import defaultPhoto from '../Resources/defaultDj.jpg';
import { useLoadingContext } from './LoadingProvider';
import Swal from 'sweetalert2';
import { event } from 'jquery';

function SongSearch() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.state ? location.state.rowData : location.search);
    const rowDataString = searchParams.get('data');
    const qrcodeParam = searchParams.get('qrcode');
    const urlEventId = searchParams.get('eventId');
    const urlUserId = searchParams.get('userId');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [enqueuedSongs, setEnqueuedSongs] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Set initial page to 1
    const [loading, setLoadingState] = useState(false);
    const [isListOpen, setListOpen] = useState(false);
    const tableRef = useRef(null);
    const [eventData, setEventData] = useState(null);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [listOfPlaylists, setListOfPlaylists] = useState(null);
    const [activePlaylistId, setActivePlaylistId] = useState(null);
    const [minAmount, setMinAmount] = useState(Math.floor(Math.random() * (100 - 60 + 1)) + 60);
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(true);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);  // Modal state
    const [isSearchBarActive, setIsSearchBarActive] = useState(false);
    const [NoSongsFound, setNoSongsFound] = useState(false);
    const { setLoading } = useLoadingContext();
    const [disableSongSearch, setDisableSongSearch] = useState(false);



    const handleSearchBarClick = (e) => {
        e.stopPropagation();
        setIsSearchBarActive(true);
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setIsSearchBarActive(false);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const uri = JSON.parse(decodeURIComponent(rowDataString));
        if (qrcodeParam == null) {
            setDisableSongSearch(uri.disableSongSearch || false);
            try {
                const Amount = parseFloat(uri["minimumBid"]);
                setMinAmount(Amount)
            }
            catch {
                window.location = 'userhome'
            }
        }

    });

    useEffect(() => {
        console.log(eventData);
        if (eventData && new Date() < new Date(eventData.eventStartDateTime) && eventData.eventStatus != 'Live') {
            // Extract the time part from eventStartDateTime
            const eventTime = new Date(eventData.eventStartDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
            Swal.fire({
                title: "Hang tight.",
                text: `DJ will start taking requests after ${eventTime}`,
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Okay"
            });
        }
    }, [eventData]);

    // useEffect(() => {
    //     const uri = JSON.parse(decodeURIComponent(rowDataString));
    //     if(qrcodeParam == null){
    //         const Amount = parseFloat(uri["minimumBid"]);
    //         setMinAmount(Amount)
    //     }
    // });

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
            setLoading(true);
            try {
                const playlists = await GetPlaylistList();
                if (playlists && playlists.length > 0) {
                    setListOfPlaylists(playlists);

                    let firstPlaylistId;
                    if (selectedPlaylistIds.length > 0) {
                        // Find the first playlist ID from selectedPlaylistIds
                        const foundPlaylist = playlists.find(playlist => selectedPlaylistIds.includes(playlist.id));
                        firstPlaylistId = foundPlaylist ? foundPlaylist.id : playlists[0].id;
                    } else {
                        // Fallback to the first playlist in the fetched list
                        firstPlaylistId = playlists[0].id;
                    }

                    setActivePlaylistId(firstPlaylistId);
                    const songs = await GetSongsList(firstPlaylistId, 0, 50);
                    setResults(songs);
                    setCurrentPage(2); // Reset the current page
                }
            } catch (error) {
                console.error('Error fetching playlists or songs:', error);
            }
            setLoading(false);
        };

        // Fetch playlists and songs only if eventData is set
        if (eventData) {
            fetchPlaylistsAndSongs();
        }
    }, [eventData]);

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
                // const Amount = parseFloat(uri["minimumBid"]);
                // setMinAmount(Amount);
                setShouldRefresh(true);
            }
            return;
        }
    }, [qrcodeParam]);

    const fetchData = async () => {
        setLoadingState(true);
        try {
            let newData;
            if (activePlaylistId) {
                //newData = await GetSongsList(activePlaylistId, (currentPage - 1) * 20, 20);
                setLoadingState(false);
            } else {
                newData = await GetSongsUsingSearchTerm(searchQuery, currentPage, 20);
                setResults((prevData) => [...prevData, ...newData]);
                setCurrentPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error fetching data:', error);
        }
        setLoadingState(false);
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
        setNoSongsFound(false);
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
            setLoading(true);
            setResults([]); // Clear previous results
            setCurrentPage(1); // Reset current page
            const res = await GetSongsUsingSearchTerm(query, 1, 20);
            setResults(res);
            if (res === null) {
                setNoSongsFound(true);
            }
            setCurrentPage(2); // Set the next page to fetch
            setLoading(false);
        } catch (error) {
            setLoading(false);
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
                setLoading(true);
                const response = await GetEventByEventId(urlEventId, urlUserId);
                // console.log('Fetched Event Data:', response); // Debug log
                setEventData(response);
                setDisableSongSearch(response.disableSongSearch || false);
                //setMinAmount(eventData.minimumBid);
                if (response != null) {
                    localStorage.setItem('venue', response.venue);
                    //fetchEnqSongs(response.id);
                }
                setLoading(false);
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                setLoading(falase);
                console.error('Error fetching data:', error);
            }
        } else if (!eventData) {
            setEventData(JSON.parse(decodeURIComponent(rowDataString)));
        } 
        //Commenting this because it was making an extra call to fetch enqueued songs for an event, but we're not using it anywhere.
        //Might need to revisit if something breaks
        //~Sourav
        // else if (enqueuedSongs == null) {
        //     fetchEnqSongs(eventData.eventId != null ? eventData.eventId : eventData.id);
        // }
    }, [qrcodeParam, urlEventId, urlUserId, eventData]);

    const handleRowClick = (data) => {
        if (eventData) {
            eventData.eventId = eventData.id;
            delete eventData.id;

            data.songId = data.id;
            delete data.id;

            data.IsSpecialAnnouncement = false;
            const concatenatedJson = { ...eventData, ...data };
            const rowDataString = encodeURIComponent(JSON.stringify(concatenatedJson));

            localStorage.removeItem('redirectUrl');
            navigate(`/paymentIndex`, { state: { rowData: "?data=" + rowDataString } });
        }
    };

    const toggleList = () => {
        setListOpen(!isListOpen);
    };

    const MakeSpecialAnnouncementHandler = () => {
        if (eventData.acceptingRequests == false && eventData.displayRequests == false) {
            setShowAnnouncementModal(true);
        }

        else if (eventData) {
            const eventDataCopy = { ...eventData };
            eventDataCopy.eventId = eventData.id;
            delete eventDataCopy.id;

            // Set the IsSpecialAnnouncement flag
            eventDataCopy.IsSpecialAnnouncement = true;

            const concatenatedJson = { ...eventDataCopy };
            const rowDataString = encodeURIComponent(JSON.stringify(concatenatedJson));

            console.log("Event data copy : ", eventDataCopy);
            navigate(`/paymentIndex`, { state: { rowData: "?data=" + rowDataString } });
        }
    };

    const handleAnnouncementModalClose = () => {
        setShowAnnouncementModal(false);
    };


    const selectedPlaylistIds = eventData && eventData.playlists ? eventData.playlists.split(',') : [];
    // console.log('selectedPlaylistIds:', selectedPlaylistIds);


    if (!listOfPlaylists) {
        return null; // or show a loading indicator
    }

    // Filter playlists based on selectedPlaylistIds
    const filteredPlaylists = listOfPlaylists.filter(playlist =>
        selectedPlaylistIds.includes(playlist.id)
    );
    // console.log('selectedPlaylists:', selectedPlaylists);


    return (
        <>
            <div className='song-search'>
                {/* <button className="back-button-songsearch" onClick={()=>navigate(-1)}>{'<<'}Back</button> */}
                {eventData && (
                    <div className="search-container">
                        <div className="left-content">
                            <img
                                src={eventData.djPhoto || defaultPhoto} // Use default photo if djPhoto is null
                                alt="DJ Image"
                                className='dj-image'
                            />
                            <div className='left-content-text'><p className='song-search-event-name'>{eventData.eventName}</p>
                                <p className='dj-name'>{eventData.djName}</p></div>
                        </div>
                        <img className='music-icon-image' src="/images/Music icon.png" />
                        <div className="right-content">
                            <div className='special-announcements right-content-button-container' onClick={MakeSpecialAnnouncementHandler}>
                                <div class="right-content-button-text">
                                    <p>Make <strong>Special</strong></p>
                                    <p><b>Announcements</b> for Special Occasions!</p>
                                </div>
                                <div class="right-content-button-icon">
                                    <img src="images/mic.png" alt="Microphone Icon" />
                                </div>
                            </div>

                        </div>
                        <span className='event-desc'>
                            <img style={{ width: '15px' }} src="/images/disclaimerIcon.png" />
                            <b><div>{eventData.eventDescription}</div></b></span>
                    </div>

                )}



                <div className="search-page">
                    {!disableSongSearch && (
                        <div className={`search-bar ${eventData && eventData.hidePlaylist ? 'hidden-content-margin' : ''}`}>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search your song"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onClick={handleSearchBarClick}
                            />
                            <img src="/images/SearchButton1.png" className="search-icon-song-search" />
                        </div>
                    )}

                    {NoSongsFound ? (<div className='no-songs-found'>No Songs Found!</div>) : (<></>)}

                    {eventData && eventData.hidePlaylist !== true && (
                        <>
                            <div className="choose-from-collections-text">
                                {!disableSongSearch && <p>OR</p>}
                                <p>CHOOSE FROM OUR COLLECTIONS</p>
                            </div>

                            <div>
                                {filteredPlaylists.length > 0 ? (
                                    <div className="playlist-buttons">
                                        {filteredPlaylists.map(playlist => (
                                            <button
                                                key={playlist.id}
                                                className={`playlist-button ${playlist.id === activePlaylistId ? 'active' : ''}`}
                                                onClick={() => handlePlaylistClick(playlist.id)}
                                            >
                                                {playlist.name}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="playlist-buttons">
                                        {listOfPlaylists.map(playlist => (
                                            <button
                                                key={playlist.id}
                                                className={`playlist-button ${playlist.id === activePlaylistId ? 'active' : ''}`}
                                                onClick={() => handlePlaylistClick(playlist.id)}
                                            >
                                                {playlist.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}


                    {(searchQuery.trim() !== '' || !(eventData && eventData.hidePlaylist) || isSearchBarActive) && (
                        <div className="container-for-table" style={{ maxHeight: '500px', overflow: 'auto', fontFamily: 'Poppins, sans-serif' }} ref={tableRef}>
                            {results && results.map((result, index) => (
                                <div key={index} className="songs-row" onClick={() => handleRowClick(result)}>
                                    <div>
                                        <img
                                            src={result.image[result.image.length - 1].url}
                                            alt={`Album Cover for ${result.album.name}`}
                                        />
                                    </div>
                                    <div className="song-card-text">
                                        <span className="song-name" style={{ fontSize: "1.1rem", lineHeight: "1.3rem", fontWeight: "700" }}>{result.name}</span>
                                        <span className="song-artists">
                                            {result.artists.primary.map((artist) => artist.name).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {loading && <p>Loading...</p>}
                        </div>
                    )}
                </div>

            </div>


            {/* Announcement Modal */}

            <div className="song-search-page-modal" style={{ display: showAnnouncementModal ? 'block' : 'none' }}>
                <div className="song-search-modal-content">
                    <h2>Announcement Disabled</h2>
                    <p>This club/DJ is not taking announcements currently</p>
                    <button onClick={handleAnnouncementModalClose}>Close</button>
                </div>
            </div>

            <div>
                {/* Other content */}
                <StickyBar type="bid" data={messages}
                    minAmount={minAmount}
                    onClose={() => { setIsStickyBarVisible(false); }}
                    isVisible={isStickyBarVisible}
                />
            </div>
        </>
    );
}

export default SongSearch;
