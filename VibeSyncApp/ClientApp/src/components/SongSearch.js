import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GetSongsByEventId, GetSongsUsingSearchTerm } from './services/SongsService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import './SongSearch.css';
import { MyContext } from '../App';
function SongSearch() {
    const { error, setError } = useContext(MyContext);
    const {errorMessage, setErrorMessage} = useContext(MyContext);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const rowDataString = searchParams.get('data');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [enqueuedSongs, setEnqueuedSongs] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [currentPage, setCurrentPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [isListOpen, setListOpen] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        const fetchEnqSongs = async () => {
            try {
                const response = await GetSongsByEventId(rowData.id);
                setEnqueuedSongs(response);
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching data:', error);
            }
        }
        fetchEnqSongs();
        const fetchData = async () => {
            setLoading(true);
            try {
                //GetSongsUsingSearchTerm(searchterm, offset, limit)
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

        const handleScroll = () => {
            const table = tableRef.current;
            if (
                table &&
                table.scrollTop + table.clientHeight >= table.scrollHeight &&
                !loading
            ) {
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
    }, [currentPage, loading, searchQuery]);

    // Function to handle changes in the search input
    const handleSearchChange = (event) => {
        const newQuery = event.target.value;
        setSearchQuery(newQuery);
        clearTimeout(typingTimeout);
        // Check if the new query is not empty before setting the timeout
        if (newQuery.trim() !== '') {
            const newTypingTimeout = setTimeout(() => {
                fetchResultsFromAPI(newQuery);
            }, 400);
            setTypingTimeout(newTypingTimeout);
        } else {
            // If the query is empty, you may want to clear the results or handle it in another way
            setResults([]);
        }
    };
    // Function to fetch results from the API
    const fetchResultsFromAPI = async (query) => {
        try {
            var res = await GetSongsUsingSearchTerm(query, 0, 20);
            setResults(res);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error in fetchResultsFromAPI:', error);
        }
    };
    

    const handleRowClick = (data) => {
        // Serialize the rowData object to a JSON string and encode it
        rowData.eventId = rowData.id;
        delete rowData.id;

        data.songId = data.id;
        delete data.id;

        const concatenatedJson = { ...rowData, ...data };
        const rowDataString = encodeURIComponent(JSON.stringify(concatenatedJson));

        // Navigate to the detail view with the serialized rowData as a parameter
        navigate(`/paymentIndex?data=${rowDataString}`);
        //navigate('/SongSearch');
    };
    // Parse the rowDataString back into a JavaScript object
    const rowData = JSON.parse(decodeURIComponent(rowDataString));
    console.log(rowData);

    const toggleList = () => {
        setListOpen(!isListOpen);
    };

    // Render the detailed view using the data from the selected row
    return (
        <div className='song-search'>
            {/* <h1 className="search-heading">{rowData.djName}</h1> */}
            <div className="search-container">
                <div className="left-content">
                    <img
                        src={rowData.djPhoto}
                        alt="DJ Image"
                        style={{ width: '300px', height: 'auto' }}
                        className='dj-image'
                    />
                </div>
                <div className="right-content">
                    <p className='dj-name'>{rowData.djName}</p>
                    <p className='text-muted event-name'>{rowData.eventName}</p>
                    <p className='text-muted event-desc'>{rowData.eventDescription}</p>
                </div>
            </div>

            <div className="custom-toggle-bar" onClick={toggleList}>
                <span className="toggle-label">Show enqueued songs</span>
                <span className={`toggle-icon ${isListOpen ? 'rotate' : ''}`}></span>
            </div>
            {isListOpen && ( // Conditionally render the list based on the state
                <div className="collapsible-list">
                    {/* Content of the collapsible list */}
                    <MDBTable align='middle' responsive className='collapsible-table'>
                        {/* <MDBTableHead>
                                <tr>
                                    <th scope='col'>Song</th>
                                    <th scope='col'>Album</th>
                                    <th scope='col'>Image</th>
                                </tr>
                            </MDBTableHead> */}
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
                                        {/* <p className='text-muted mb-0'>{result.artists[0].name}</p> */}

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
                {/* <br/> */}
                <div className='container-for-table' style={{ maxHeight: '400px', overflow: 'auto' }} ref={tableRef}>
                    <MDBTable align='middle' responsive hover>
                        {/* <MDBTableHead>
                            <tr>
                                <th scope='col'>Song</th>
                                <th scope='col'>Album</th>
                                <th scope='col'>Image</th>
                            </tr>
                        </MDBTableHead> */}
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
                                        {/* <p className='text-muted mb-0'>{result.artists[0].name}</p> */}

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
