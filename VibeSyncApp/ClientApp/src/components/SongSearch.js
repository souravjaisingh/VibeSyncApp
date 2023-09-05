import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GetSongsUsingSearchTerm } from './services/SongsService';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import './SongSearch.css';
    function SongSearch() {
        const location = useLocation();
        const navigate = useNavigate();
        const searchParams = new URLSearchParams(location.search);
        const rowDataString = searchParams.get('data');
        const [searchQuery, setSearchQuery] = useState('');
        const [results, setResults] = useState([]);
        const [typingTimeout, setTypingTimeout] = useState(null);
        const [currentPage, setCurrentPage] = useState(2);
        const [loading, setLoading] = useState(false);
        const tableRef = useRef(null);

        useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                //GetSongsUsingSearchTerm(searchterm, offset, limit)
                const response = await GetSongsUsingSearchTerm(searchQuery, ((currentPage-1)*20)+1, 20);
                const newData = response;
        
                setResults((prevData) => [...prevData, ...newData]);
                setCurrentPage((prevPage) => prevPage + 1);
                } catch (error) {
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
            const newTypingTimeout = setTimeout(() => {
                fetchResultsFromAPI(newQuery);
            }, 400);
        
            setTypingTimeout(newTypingTimeout);
        };
        // Function to fetch results from the API
        const fetchResultsFromAPI = async (query) => {
            var res = await GetSongsUsingSearchTerm(query, 0, 20);
            setResults(res);
        };
        
        const handleRowClick = (rowData) => {
            // Serialize the rowData object to a JSON string and encode it
            const rowDataString = encodeURIComponent(JSON.stringify(rowData));
    
            // Navigate to the detail view with the serialized rowData as a parameter
            navigate(`/paymentIndex?data=${rowDataString}`);
            //navigate('/SongSearch');
        };
        // Parse the rowDataString back into a JavaScript object
        const rowData = JSON.parse(decodeURIComponent(rowDataString));
        console.log(rowData);

    // Render the detailed view using the data from the selected row
    return (
        <div className="search-container">
            <h1 className="search-heading">{rowData.djName}</h1>
            <div className="search-bar">
                <input
                type="text"
                className="search-input"
                placeholder="Type your search here..."
                value={searchQuery}
                onChange={handleSearchChange}
                />
            </div>
            <br></br>
            <div style={{ maxHeight: '400px', overflow: 'auto' }} ref={tableRef}>
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
                                src={result.album.images[result.album.images.length-1].url}
                                alt={`Album Cover for ${result.album.name}`}
                                style={{ width: '45px', height: '45px' }}
                                className='rounded-circle'
                                />
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{result.name}</p>
                                <p className='text-muted mb-0'>{result.artists[0].name}</p>
                                {/* {result.name} */}
                            </td>
                            <td>{result.album.name}</td>
                        </tr>
                        ))}
                        </MDBTableBody>
                </MDBTable>
                {loading && <p>Loading...</p>}
            </div>
        </div>
    );
    }

    export default SongSearch;
