import React, { useContext, useEffect, useState } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import './DjLiveSongs.css';
import { getUserRequestHistoryData } from './services/UserService';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import { GetSongsByEventId, ModifySongRequest } from './services/SongsService';
import { MyContext } from '../App';
import QRCodeModal from './QRCodeModal';
import { eventDetailsUpsertHelper } from '../Helpers/EventsHelper';
import { Live, LiveButNotAcceptingRequests, PaidZeroUsingPromocode } from './Constants';
import { useLoadingContext } from './LoadingProvider';
import { RefundPayment } from './services/PaymentService';

export default function DjLiveSongs() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const [userHistory, setUserHistory] = useState([]);
    const [acceptedHistory, setAcceptedHistory] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const rowDataString = searchParams.get('data');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const rowData = JSON.parse(decodeURIComponent(rowDataString)) || {};
    const [eventId, setEventId] = useState(rowData != null ? rowData.id : null);
    const [stopIncomingRequests, setStopIncomingRequests] = useState(rowData.eventStatus === 'Live-NA' ? true : false);
    const { setLoading } = useLoadingContext();
    const openModal = () => {
        setModalIsOpen(true);
        setEventId(eventId);
        if (localStorage.getItem('eventId') == null)
            localStorage.setItem('eventId', eventId);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setEventId(eventId);
    };


    console.log("eventId : " + eventId)

    console.log(rowData);

    useEffect(() => {
        if ((rowData && rowData.id) || localStorage.getItem('eventId') != null) {
            async function fetchData() {
                try {
                    const res = await GetSongsByEventId(rowData.id != null ? rowData.id : localStorage.getItem('eventId'));
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
        }
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
            if(record.paymentId !== PaidZeroUsingPromocode){
                const refundObj = {
                    PaymentId : record.paymentId,
                    Amount : record.totalAmount,
                    UserId : record.userId
                }
                var refund = await RefundPayment(refundObj);
                const songHistoryMdl = {
                    id: record.id,
                    EventId: record.eventId,
                    SongStatus: "Refunded",
                    userId: localStorage.getItem('userId')
                };
                var refRes = await ModifySongRequest(songHistoryMdl);
                console.log(res);
                console.log(refund);
                console.log(refRes);
            }
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
    const stopRequestsAPI = async () => {
        try {
            // Call your API here with the updated toggle value
            const res = await eventDetailsUpsertHelper(
                localStorage.getItem('userId'),
                'default',
                rowData.eventDescription,
                rowData.venue,
                rowData.eventStartDateTime,
                rowData.eventEndDateTime,
                12.123456, // Modify once Google Maps API gets implemented
                44.765432,
                rowData.minimumBid,
                true,
                rowData.id,
                stopIncomingRequests ? Live : LiveButNotAcceptingRequests  // Pass the toggle value to the API
            );
            console.log(res);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error updating stop incoming requests:', error);
        }
    };
    const handleToggleClick = () => {
        setLoading(true);
        setStopIncomingRequests(!stopIncomingRequests);
        setLoading(false);
        console.log(stopIncomingRequests);
        stopRequestsAPI();
    };


    return (
        <div className='song-history-container' style={{ maxHeight: '500px' }}>
            <div className="toggle-container">
                <label htmlFor="liveToggle">Stop taking requests</label>
                <input
                    type="checkbox"
                    id="liveToggle"
                    checked={stopIncomingRequests}
                    onChange={handleToggleClick}
                    style={{ display: 'none' }} // hide the actual checkbox
                />
                <div
                    className={`toggle-slider ${stopIncomingRequests ? 'active' : ''}`}
                    onClick={handleToggleClick}
                >
                    <div className={`slider-thumb ${stopIncomingRequests ? 'active' : ''}`} />
                </div>
            </div>




            {userHistory.length > 0 ? ( // Check if userHistory is not empty
                <div className='song-history-table'>
                    <MDBTable className='history-table' align='middle' responsive hover>
                        <MDBTableHead>
                            <tr className="song--history--header--row">
                                <th className="djlive-header-cell" scope='col'></th>
                                <th className="djlive-header-cell" scope='col'>Song/Artist</th>
                                <th className="djlive-header-cell" scope='col'>Album</th>
                                <th className="djlive-header-cell" scope='col'>Actions</th>
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
                                        <p className='text-muted mb-0 money'>&#8377;{result.totalAmount || 0}</p>
                                    </td>
                                    <td>
                                        <p className='fw-bold mb-1'>{result.songName}</p>
                                        <p className='text-muted mb-0'>{result.artistName}</p>
                                    </td>
                                    <td>{result.albumName}</td>
                                    {result && result.songStatus === 'Pending' && (
                                        <td>
                                            <div className='button-container'>
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
                                        <td>
                                            <div className='button-container'>
                                            <button
                                                    onClick={() => handleRejectRequest(result)}
                                                    className='btn btn-danger action-button'
                                                >
                                                    ✗
                                                </button>
                                            <button
                                                onClick={() => handleMarkAsPlayed(result)}
                                                className='btn btn-primary-mark-as-played'
                                            >
                                                Mark as Played
                                            </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </MDBTableBody>
                    </MDBTable>
                </div>
            ) : (
                <p style={{ color: "red" }}>You don't have any requests as of now.</p>
            )}
        </div>
    );

}
