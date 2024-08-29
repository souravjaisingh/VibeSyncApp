import React, { useContext, useEffect, useRef, useState } from 'react';
import './LiveRequests.css';
import { GetAllLiveRequests, ModifySongRequest } from './services/SongsService';
import { MyContext } from '../App';
import { PaidZeroUsingPromocode } from './Constants';
import { RefundPayment } from './services/PaymentService';
import { useLoadingContext } from './LoadingProvider';

export default function LiveRequests() {

    const [userHistory, setUserHistory] = useState([]);
    const [userHistoryUpdated, setUserHistoryUpdated] = useState(false);
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const lastHighestRecordIdRef = useRef(0);
    const [acceptedHistory, setAcceptedHistory] = useState([]);
    const { setLoading } = useLoadingContext();

    const fetchData = async () => {
        try {
            setLoading(true);

            // Call GetAllLiveRequests once
            const res = await GetAllLiveRequests(0);

            if (!res || res.length === 0) {
                console.warn('No live requests found.');
                setLoading(false);
                return;
            }

            // Separate songs and announcements
            const songRequests = res.filter(request => request.songId); // Assuming songId exists for song requests
            const specialAnnouncements = res.filter(request => request.micAnnouncement); // Filtering based on micAnnouncement field

            // Combine the song requests and announcements
            const allRequests = [...songRequests, ...specialAnnouncements];

            // Sort the combined requests
            allRequests.sort((a, b) => {
                if (a.songStatus === 'Pending' && b.songStatus !== 'Pending') {
                    return -1; // 'Pending' requests come first
                } else if (a.songStatus !== 'Pending' && b.songStatus === 'Pending') {
                    return 1; // 'Pending' requests come first
                } else {
                    return new Date(b.modifiedOn) - new Date(a.modifiedOn); // Sort by modifiedOn in descending order
                }
            });

            const highestIdInResponse = Math.max(...allRequests.map(request => request.id), 0);
            const isNewRequest = highestIdInResponse > lastHighestRecordIdRef.current;

            lastHighestRecordIdRef.current = highestIdInResponse;
            setUserHistory(allRequests);
            setUserHistoryUpdated(true);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error fetching user request history:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleAcceptRequest = async (record) => {
        try {
            const songHistoryModel = {
                id: record.id,
                EventId: record.eventId,
                SongStatus: "Accepted", // Update the songStatus property
                userId: localStorage.getItem('userId')
            };
            setLoading(true);
            var res = await ModifySongRequest(songHistoryModel);
            console.log(res);

            // Update the songStatus property of the accepted request in a new array
            const updatedUserHistory = userHistory.map((request) =>
                request.id === record.id ? { ...request, songStatus: 'Accepted', modifiedOn: new Date() } : request
            );

            // Sort and update the userHistory state
            const sortedUserHistory = sortUserHistory(updatedUserHistory);
            setUserHistory(sortedUserHistory);
            setLoading(false);
            // Move the accepted request to the bottom of the acceptedHistory array
            setAcceptedHistory((prevAccepted) => [...prevAccepted, record]);
        } catch (error) {
            setError(true);
            setLoading(false);
            setErrorMessage(error.message);
            console.error('Error accepting request:', error);
        }
    };

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
            setLoading(true);
            var res = await ModifySongRequest(songHistoryModel);
            if (record.paymentId !== PaidZeroUsingPromocode) {
                const refundObj = {
                    PaymentId: record.paymentId,
                    Amount: record.totalAmount,
                    UserId: record.userId
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
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
            setErrorMessage(error.message);
            console.error('Error rejecting request:', error);
        }
    };

    const calculateRemainingTime = (paymentDateTime) => {
        const currentTime = new Date();
        const paymentTime = new Date(paymentDateTime);
        const endTime = new Date(paymentTime.getTime() + 30 * 60 * 1000); // Add 30 minutes
        const remainingTime = Math.max(0, (endTime - currentTime) / 1000 / 60); // Convert to minutes
        //console.log(`Remaining time for request: ${remainingTime} minutes`);
        return remainingTime > 0 ? remainingTime.toFixed(0) : null; // Return null when remaining time is 0 or less
    };

    const handleMarkAsPlayed = async (record) => {
        try {
            const songHistoryModel = {
                id: record.id,
                EventId: record.eventId,
                SongStatus: "Played", // Update the songStatus property
                userId: localStorage.getItem('userId')
            };
            setLoading(true);
            var res = await ModifySongRequest(songHistoryModel);
            console.log(res);

            // Update the songStatus property of the accepted request in a new array
            setUserHistory((prevHistory) =>
                prevHistory.filter((request) => request.id !== record.id)
            );

            // Move the accepted request to the bottom of the acceptedHistory array
            setAcceptedHistory((prevAccepted) => [...prevAccepted, record]);
            setLoading(false);
        }
        catch (error) {
            setError(true);
            setLoading(false);
            setErrorMessage(error.message);
            console.error('Error marking as played:', error);
        }
    }

    return (
        <div className='LiveRequests'>
            <h1 className='live-req-label'>Live Requests</h1>
            <div className="live-requests">
                {userHistory.length > 0 ? ( // Check if userHistory is not empty
                    <div className='song-history-table'>

                        {userHistory.map((result, index) => {
                            return (<>
                                {calculateRemainingTime(result.paymentDateTime) < 10 ? (<>

                                    <div key={index} className='song-announcement-request-container-red'>
                                        <div className='request-announcement-amount'>
                                            ₹{result.totalAmount}
                                        </div>

                                        {result.micAnnouncement ? (
                                            <>
                                                <div className='dj-side-img-text'>
                                                    <div>
                                                        <img
                                                            src={`${process.env.PUBLIC_URL}/images/micDark.png`}
                                                            alt="Microphone Icon"
                                                            style={{ width: '45px', height: '45px' }}
                                                            className='rounded-circle'
                                                        />
                                                    </div>
                                                    <div colSpan="2">
                                                        <p className='dj-side-song-req-title' style={{ fontSize: '12px' }}>Special Announcement</p>
                                                        <p className='dj-side-song-req-text' style={{ fontSize: '10px' }}>{result.micAnnouncement}</p>
                                                        <p className='dj-side-song-req-text' style={{ fontSize: '10px' }}>Event: {result.eventName }</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className='dj-side-img-text'>
                                                    <div>
                                                        <img
                                                            src={result.image}
                                                            alt={`Album Cover for ${result.albumName}`}
                                                            className='img-song-req-dj-side'
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className='dj-side-song-req-title'>{result.songName}</p>
                                                            <p className='dj-side-song-req-text'>{result.artistName}</p>
                                                            <p className='dj-side-song-req-text' style={{ fontSize: '10px' }}>{result.eventName}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}


                                        {result && result.songStatus === 'Pending' && (
                                            <td>
                                                <div className='button-container'>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                                        <button
                                                            onClick={() => handleAcceptRequest(result)}
                                                            className='accept-button-yes'
                                                        >
                                                            ✔
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(result)}
                                                            className='close-button-X'
                                                        >X
                                                        </button>
                                                    </div>
                                                    <div className='timer-container' style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>⏰ {calculateRemainingTime(result.paymentDateTime)} Mins Left</div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        {result && result.songStatus === 'Accepted' && (
                                            <td>
                                                <div className='button-container'>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                                                        <button
                                                            onClick={() => handleMarkAsPlayed(result)}
                                                            className='btn-primary-mark-as-played'
                                                        >
                                                            MARK PLAYED
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(result)}
                                                            className='close-button-X'
                                                        >X
                                                        </button>
                                                    </div>
                                                    <div className='timer-container' style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>⏰ {calculateRemainingTime(result.paymentDateTime)} Mins Left</div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                    </div>

                                </>) :
                                    calculateRemainingTime(result.paymentDateTime) < 15 ? (<>
                                        <div key={index} className='song-announcement-request-container-yellow'>
                                            <div className='request-announcement-amount'>
                                                ₹{result.totalAmount}
                                            </div>

                                            {result.micAnnouncement ? (
                                                <>
                                                    <div className='dj-side-img-text'>
                                                        <div>
                                                            <img
                                                                src={`${process.env.PUBLIC_URL}/images/micDark.png`}
                                                                alt="Microphone Icon"
                                                                style={{ width: '45px', height: '45px' }}
                                                                className='rounded-circle'
                                                            />
                                                        </div>
                                                        <div colSpan="2">
                                                            <p className='dj-side-song-req-title' style={{ fontSize: '12px' }}>Special Announcement</p>
                                                            <p className='dj-side-song-req-text' style={{ fontSize: '10px' }}>{result.micAnnouncement}</p>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className='dj-side-img-text'>
                                                        <div>
                                                            <img
                                                                src={result.image}
                                                                alt={`Album Cover for ${result.albumName}`}
                                                                className='img-song-req-dj-side'
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className='dj-side-song-req-title'>{result.songName}</p>
                                                            <p className='dj-side-song-req-text'>{result.artistName}</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}


                                            {result && result.songStatus === 'Pending' && (
                                                <td>
                                                    <div className='button-container'>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                                            <button
                                                                onClick={() => handleAcceptRequest(result)}
                                                                className='accept-button-yes'
                                                            >
                                                                ✔
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(result)}
                                                                className='close-button-X'
                                                            >X
                                                            </button>
                                                        </div>
                                                        <div className='timer-container' style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '12px', fontWeight: '700' }}>⏰ {calculateRemainingTime(result.paymentDateTime)} Mins Left</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}

                                            {result && result.songStatus === 'Accepted' && (
                                                <td>
                                                    <div className='button-container'>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                                                            <button
                                                                onClick={() => handleMarkAsPlayed(result)}
                                                                className='btn-primary-mark-as-played'
                                                            >
                                                                MARK PLAYED
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(result)}
                                                                className='close-button-X'
                                                            >X
                                                            </button>
                                                        </div>
                                                        <div className='timer-container' style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '12px', fontWeight: '700' }}>⏰ {calculateRemainingTime(result.paymentDateTime)} Mins Left</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                        </div>
                                    </>) : (<>

                                        <div key={index} className='song-announcement-request-container'>
                                            <div className='request-announcement-amount'>
                                                ₹{result.totalAmount}
                                            </div>

                                            {result.micAnnouncement ? (
                                                <>
                                                    <div className='dj-side-img-text'>
                                                        <div>
                                                            <img
                                                                src={`${process.env.PUBLIC_URL}/images/micDark.png`}
                                                                alt="Microphone Icon"
                                                                style={{ width: '45px', height: '45px' }}
                                                                className='rounded-circle'
                                                            />
                                                        </div>
                                                        <div colSpan="2">
                                                            <p className='dj-side-song-req-title' style={{ fontSize: '12px' }}>Special Announcement</p>
                                                            <p className='dj-side-song-req-text' style={{ fontSize: '10px' }}>{result.micAnnouncement}</p>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className='dj-side-img-text'>
                                                        <div>
                                                            <img
                                                                src={result.image}
                                                                alt={`Album Cover for ${result.albumName}`}
                                                                className='img-song-req-dj-side'
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className='dj-side-song-req-title'>{result.songName}</p>
                                                            <p className='dj-side-song-req-text'>{result.artistName}</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}


                                            {result && result.songStatus === 'Pending' && (
                                                <td>
                                                    <div className='button-container'>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                                            <button
                                                                onClick={() => handleAcceptRequest(result)}
                                                                className='accept-button-yes'
                                                            >
                                                                ✔
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(result)}
                                                                className='close-button-X'
                                                            >X
                                                            </button>
                                                        </div>
                                                        <div className='timer-container' style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '12px', fontWeight: '700' }}>⏰ {calculateRemainingTime(result.paymentDateTime)} Mins Left</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}

                                            {result && result.songStatus === 'Accepted' && (
                                                <td>
                                                    <div className='button-container'>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                                                            <button
                                                                onClick={() => handleMarkAsPlayed(result)}
                                                                className='btn-primary-mark-as-played'
                                                            >
                                                                MARK PLAYED
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(result)}
                                                                className='close-button-X'
                                                            >X
                                                            </button>
                                                        </div>
                                                        <div className='timer-container' style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '12px', fontWeight: '700' }}>⏰ {calculateRemainingTime(result.paymentDateTime)} Mins Left</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                        </div>

                                    </>)

                                }
                            </>
                            )

                        })}
                    </div>
                ) : (
                    <p style={{ color: "red" }}>No Requests Available.</p>
                )}
            </div>
        </div>
    );
}