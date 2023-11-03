import React, { useContext, useEffect, useState } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import './DjLiveSongs.css';
import { getUserRequestHistoryData } from './services/UserService';
import { useLocation } from 'react-router-dom';
import { GetSongsByEventId, ModifySongRequest } from './services/SongsService';
import { MyContext } from '../App';

export default function DjLiveSongs() {
    const { error, setError } = useContext(MyContext);
    const {errorMessage, setErrorMessage} = useContext(MyContext);
    const [userHistory, setUserHistory] = useState([]);
    const [acceptedHistory, setAcceptedHistory] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const rowDataString = searchParams.get('data');

    const rowData = JSON.parse(decodeURIComponent(rowDataString));
    console.log(rowData);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await GetSongsByEventId(rowData.id);
                // Separate the requests into accepted and unaccepted
                const unaccepted = res.filter((request) => request.songStatus === 'Pending');
                const accepted = res.filter((request) => request.songStatus === 'Accepted');

                // Combine the arrays so that Pending requests appear on top
                const sortedRequests = [...unaccepted, ...accepted];

                sortedRequests.sort((a, b) => {
                    if (a.songStatus === 'Pending' && b.songStatus !== 'Pending') {
                        return -1; // 'Pending' requests come first
                    } else if (a.songStatus !== 'Pending' && b.songStatus === 'Pending') {
                        return 1; // 'Pending' requests come first
                    } else {
                        return new Date(a.modifiedOn) - new Date(b.modifiedOn); // Sort by modifiedOn in descending order
                    }
                });

                setUserHistory(sortedRequests);
                console.log(sortedRequests);
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching user request history:', error);
            }
        }
        fetchData();

        const interval = setInterval(() => {
            fetchData(); // Fetch data every 15 seconds
        }, 15000); // 15 seconds in milliseconds

        // Clear the interval on component unmount to prevent memory leaks
        return () => clearInterval(interval);
    }, [rowData.id]); // Add rowData.id to the dependency array

    const handleAcceptRequest = async (record) => {
        try {
            const songHistoryModel = {
                id: record.id,
                EventId: record.eventId,
                SongStatus: "Accepted", // Update the songStatus property
                userId: localStorage.getItem('userId')
            };
            var res = await ModifySongRequest(songHistoryModel);
            console.log(res);

            // Update the songStatus property of the accepted request in a new array
            const updatedUserHistory = userHistory.map((request) =>
                request.id === record.id ? { ...request, songStatus: 'Accepted', modifiedOn: new Date() } : request
            );

            // Sort and update the userHistory state
            const sortedUserHistory = sortUserHistory(updatedUserHistory);
            setUserHistory(sortedUserHistory);

            // Move the accepted request to the bottom of the acceptedHistory array
            setAcceptedHistory((prevAccepted) => [...prevAccepted, record]);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error accepting request:', error);
        }
    };


    // Similar changes for handleRejectRequest

    // Function to sort userHistory
    function sortUserHistory(history) {
        const sortedUserHistory = [...history];

        sortedUserHistory.sort((a, b) => {
            if (a.songStatus === 'Pending' && b.songStatus !== 'Pending') {
                return -1; // 'Pending' requests come first
            } else if (a.songStatus !== 'Pending' && b.songStatus === 'Pending') {
                return 1; // 'Pending' requests come first
            } else {
                return new Date(a.modifiedOn) - new Date(b.modifiedOn); // Sort by modifiedOn in descending order
            }
        });

        return sortedUserHistory;
    };



    const handleRejectRequest = async (record) => {
        try {
            const songHistoryModel = {
                id: record.id,
                EventId: record.eventId,
                SongStatus: "Rejected",
                userId: localStorage.getItem('userId')
            };
            var res = await ModifySongRequest(songHistoryModel);
            console.log(res);
            // await rejectRequest(requestId);
            // Remove the rejected request from the userHistory array
            setUserHistory((prevHistory) =>
                prevHistory.filter((request) => request.id !== record.id)
            );
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error rejecting request:', error);
        }
    };
    const handleMarkAsPlayed = async (record) => {
        try {
            const songHistoryModel = {
                id: record.id,
                EventId: record.eventId,
                SongStatus: "Played", // Update the songStatus property
                userId: localStorage.getItem('userId')
            };
            var res = await ModifySongRequest(songHistoryModel);
            console.log(res);

            // Update the songStatus property of the accepted request in a new array
            setUserHistory((prevHistory) =>
                prevHistory.filter((request) => request.id !== record.id)
            );

            // Move the accepted request to the bottom of the acceptedHistory array
            setAcceptedHistory((prevAccepted) => [...prevAccepted, record]);
        }
        catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error marking as played:', error);
        }
    }
    return (
        <div className='song-history-container' style={{ maxHeight: '500px' }}>
            <div className='song-history-table'>
                <MDBTable className='history-table' align='middle' responsive hover>
                    <MDBTableHead>
                        <tr className="song--history--header--row">
                            <th className="djlive-header-cell" scope="col"></th>
                            <th className="djlive-header-cell" scope="col">Song/Artist</th>
                            <th className="djlive-header-cell" scope="col">Album</th>
                            <th className="djlive-header-cell" scope="col">Actions</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {userHistory.map((result, index) => (
                            <tr key={index}>
                                <td>
                                    <img
                                        src={result.image}
                                        alt={`Album Cover for ${result.albumName}`}
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>{result.songName}</p>
                                    <p className='text-muted mb-0'>{result.artistName}</p>
                                </td>
                                <td>{result.albumName}</td>
                                {result && result.songStatus === 'Pending' && (
                                    <td>
                                        <div className="button-container">
                                            <button
                                                onClick={() => handleAcceptRequest(result)}
                                                className='btn btn-success action-button'
                                            >
                                                ✓
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(result)}
                                                className='btn btn-danger action-button'
                                            >
                                                ✗
                                            </button>
                                        </div>
                                    </td>
                                )}

                                {result && result.songStatus === 'Accepted' && (
                                    <><td>
                                        <button
                                            onClick={() => handleMarkAsPlayed(result)}
                                            className='btn btn-primary-mark-as-played'
                                        >
                                            Mark as Played
                                        </button>
                                    </td></>
                                )}
                            </tr>
                        ))}
                        {/* {acceptedHistory.length > 0 && acceptedHistory.map((result, index) => (
                            <tr key={index}>
                                <td>
                                    <img
                                        src={result.image}
                                        alt={`Album Cover for ${result.albumName}`}
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>{result.songName}</p>
                                    <p className='text-muted mb-0'>{result.artistName}</p>
                                </td>
                                <td>{result.albumName}</td> 
                            </tr>
                        ))} */}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div>
    );
}
