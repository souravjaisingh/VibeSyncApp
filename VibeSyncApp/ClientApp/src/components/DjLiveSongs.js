import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import './DjLiveSongs.css';
import { getUserRequestHistoryData } from './services/UserService';
import { useLocation } from 'react-router-dom';
import { GetSongsByEventId } from './services/SongsService';

export default function DjLiveSongs() {
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
            const unaccepted = res.filter((request) => !request.accepted);
            const accepted = res.filter((request) => request.accepted);
            setUserHistory(unaccepted);
            setAcceptedHistory(accepted);
            console.log(accepted);
            console.log(unaccepted);
        } catch (error) {
            console.error('Error fetching user request history:', error);
        }
        }
        fetchData();
    }, []);

    const handleAcceptRequest = async (requestId) => {
        try {
        // await acceptRequest(requestId);
        // Move the accepted request to the acceptedHistory array
        const acceptedRequest = userHistory.find((request) => request.id === requestId);
        setUserHistory((prevHistory) =>
            prevHistory.filter((request) => request.id !== requestId)
        );
        setAcceptedHistory((prevAccepted) => [...prevAccepted, acceptedRequest]);
        } catch (error) {
        console.error('Error accepting request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
        // await rejectRequest(requestId);
        // Remove the rejected request from the userHistory array
        setUserHistory((prevHistory) =>
            prevHistory.filter((request) => request.id !== requestId)
        );
        } catch (error) {
        console.error('Error rejecting request:', error);
        }
    };

    return (
        <div className='song-history-container' style={{ maxHeight: '500px' }}>
        <div className='song-history-table'>
            <MDBTable className='history-table' align='middle' responsive hover>
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
                    <><td>
                                <button
                                    onClick={() => handleAcceptRequest(result.id)}
                                    className='btn btn-success action-button'
                                >
                                    ✓
                                </button>
                            </td><td>
                                    <button
                                        onClick={() => handleRejectRequest(result.id)}
                                        className='btn btn-danger action-button'
                                    >
                                        ✗
                                    </button>
                                </td></>
                    )}
                    </tr>
                ))}
                {acceptedHistory.length > 0 && acceptedHistory.map((result, index) => (
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
                        ))}
                </MDBTableBody>
            </MDBTable>
        </div>
        </div>
    );
}
