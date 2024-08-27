import React, { useContext, useEffect, useRef, useState } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import './DjLiveSongs.css';
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { GetSongsByEventId, ModifySongRequest } from './services/SongsService';
import { MyContext } from '../App';
import QRCodeModal from './QRCodeModal';
import { eventDetailsUpsertHelper } from '../Helpers/EventsHelper';
import { Live, LiveButNotAcceptingRequests, PaidZeroUsingPromocode } from './Constants';
import { useLoadingContext } from './LoadingProvider';
import { RefundPayment } from './services/PaymentService';
import addNotification from 'react-push-notification';
import { isMobile } from 'react-device-detect';
import { UpdateEventDetails } from './services/EventsService';


export default function DjLiveSongs() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const [userHistory, setUserHistory] = useState([]);
    const [acceptedHistory, setAcceptedHistory] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    let searchParams;
    try{
      searchParams = new URLSearchParams(location.state.rowData);
    }
    catch{
      window.location = '/userhome';
    }
    const rowDataString = searchParams.get('data');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const rowData = JSON.parse(decodeURIComponent(rowDataString)) || {};
    const [eventId, setEventId] = useState(rowData != null ? rowData.id : null);
    const [stopIncomingRequests, setStopIncomingRequests] = useState(rowData.eventStatus === 'Live-NA' ? true : false);
    const { setLoading } = useLoadingContext();
    const [remainingTimes, setRemainingTimes] = useState({});
    const [rejectedRecords, setRejectedRecords] = useState([]);
    const [isNewRequest, setIsNewRequest] = useState(false); // State to track new requests
    const lastHighestRecordIdRef = useRef(0);
    const [isLive, setIsLive] = useState((rowData && (rowData.eventStatus === "Live" || rowData.eventStatus === 'Live-NA')) ? true : false);
    const [userHistoryUpdated, setUserHistoryUpdated] = useState(false); // New state for flag

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

const isAppleDevice = () => {
    return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
};

const isInStandaloneMode = () => {
    return (window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
};

useEffect(() => {
    console.log('first use Effect, isappledevice ' + isAppleDevice() + 'isPWA ' + isInStandaloneMode())
    if (!isAppleDevice() || isInStandaloneMode()) {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }
}, []);

    function newNotification() {
        addNotification({
            title: 'New Request',
            subtitle: 'Wohoo!',
            message: 'Hey, a new request popped up!',
            theme: 'darkblue',
            duration: 6000
            //native: true // when using native, your OS will handle theming.
        });
    }
    //console.log("eventId : " + eventId)

    //console.log(rowData);

    function notifyUser(notificationText = "Hey, New song request just popped up!") {
        console.log("yep");
        if (!("Notification" in window)) {
            alert("Browser doesn't support notifications.")
        } else if (Notification.permission === "granted") {
            new Notification(notificationText);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(notificationText);
                }
            })
        }
    }

    const handleLiveToggle = async()=>{
        // Handle toggle state changes
        let live_toggle_rowData = rowData;
        live_toggle_rowData.eventStatus = !isLive?'Live':'Not live';
        setIsLive(!isLive);
        setLoading(true);
        await UpdateEventDetails(live_toggle_rowData);
        setLoading(false);
        navigate('/djhome')
    };

    useEffect(() => {
        if ((rowData && rowData.id) || localStorage.getItem('eventId') != null) {
            let lastHighestRecordId = Math.max(...userHistory.map(request => request.id), 0);

            async function fetchData() {
                try {
                    const res = await GetSongsByEventId(rowData.id != null ? rowData.id : localStorage.getItem('eventId'));

                    // Separate songs and announcements
                    const songRequests = res.filter((request) => request.songId); // Assuming songId exists for song requests
                    const specialAnnouncements = res.filter((request) => request.micAnnouncement); // Filtering based on micAnnouncement field

                    // Combine the song requests and announcements
                    const combinedRequests = [...songRequests, ...specialAnnouncements];

                    // Sort the combined requests
                    combinedRequests.sort((a, b) => {
                        if (a.songStatus === 'Pending' && b.songStatus !== 'Pending') {
                            return -1; // 'Pending' requests come first
                        } else if (a.songStatus !== 'Pending' && b.songStatus === 'Pending') {
                            return 1; // 'Pending' requests come first
                        } else {
                            return new Date(a.modifiedOn) - new Date(b.modifiedOn); // Sort by modifiedOn in descending order
                        }
                    });

                    const highestIdInResponse = Math.max(...combinedRequests.map(request => request.id), 0);
                    const isNewRequest = highestIdInResponse > lastHighestRecordIdRef.current;
                    //console.log(isNewRequest);
                    console.log('inside second use Effect, isappledevice ' + isAppleDevice() + 'isPWA ' + isInStandaloneMode())
                    if(!isAppleDevice() || isInStandaloneMode()){
                        console.log('If clause, second use Effect, isappledevice' + isAppleDevice() + 'isPWA' + isInStandaloneMode())
                        if (isNewRequest === true && Notification.permission === 'granted') {
                            if (!isMobile) {
                                console.log('inside !isMobile if clause');
                                notifyUser(); //desktop notification
                            }
                            newNotification();  //in-page notification
                        }
                    }
                    lastHighestRecordIdRef.current = highestIdInResponse;
                    setUserHistory(combinedRequests);
                    setUserHistoryUpdated(true);
                    console.log(combinedRequests);
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
    }, [rowData.id]);
    // Add rowData.id to the dependency array

    // useEffect(() => {
    //     const updatedTimes = {};
    //     userHistory.forEach(result => {
    //         const remainingTime = calculateRemainingTime(result.paymentDateTime);
    //         if (remainingTime !== null) {
    //             updatedTimes[result.paymentId] = remainingTime;
    //             if (remainingTime === 0 && !rejectedRecords.includes(result.paymentId)) {
    //                 handleRejectRequest(result);
    //                 setRejectedRecords(prev => [...prev, result.paymentId]); // Mark the record as rejected
    //             }
    //         } else {
    //             // If remaining time is null and the record has not been rejected yet, call handleRejectRequest for the record
    //             if (!rejectedRecords.includes(result.paymentId)) {
    //                 handleRejectRequest(result);
    //                 setRejectedRecords(prev => [...prev, result.paymentId]); // Mark the record as rejected
    //             }
    //         }
    //     });
    //     setRemainingTimes(updatedTimes);
    // }, [userHistory, rejectedRecords]); // Add rejectedRecords to the dependency array



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
    const toggleLiveAPI = async () => {
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
                isLive?Live : LiveButNotAcceptingRequests  // Pass the toggle value to the API
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
    function handleEditProfileClick() {
        navigate(`/eventdetails`,{state:{rowData:'?data='+rowDataString}}); // Navigate to the specified URL
    }
    const calculateRemainingTime = (paymentDateTime) => {
        const currentTime = new Date();
        const paymentTime = new Date(paymentDateTime);
        const endTime = new Date(paymentTime.getTime() + 30 * 60 * 1000); // Add 30 minutes
        const remainingTime = Math.max(0, (endTime - currentTime) / 1000 / 60); // Convert to minutes
        //console.log(`Remaining time for request: ${remainingTime} minutes`);
        return remainingTime > 0 ? remainingTime.toFixed(0) : null; // Return null when remaining time is 0 or less
    };
    
    function sendReminderNotification(remainingTime) {
        console.log("Inside notification func");
        let message;
        let title;

        switch (remainingTime) {
            case "10":
                title = '10 Minutes Left';
                message = 'Only 10 minutes left for your request!';
                break;
            case "5":
                title = '5 Minutes Left';
                message = 'Only 5 minutes left for your request!';
                break;
            case "2":
                title = '2 Minutes Left';
                message = 'Only 2 minutes left for your request!';
                break;
            default:
                return; // Exit if remainingTime does not match 10, 5, or 2
        }

        // In-page notification
        addNotification({
            title: title,
            subtitle: 'Reminder',
            message: message,
            theme: 'darkblue',
            duration: 6000
        });

        // Desktop notification if permission is granted
        if (Notification.permission === 'granted' && !isMobile) {
            console.log("Desktop notification")
            new Notification(title, {
                body: message,
            });
        }
    }

    useEffect(() => {
        if (userHistoryUpdated) {
            const checkNotificationTimes = () => {
                console.log("Checking notification times...");
                userHistory.forEach((result) => {
                    const remainingTime = calculateRemainingTime(result.paymentDateTime);
                    console.log('inside second use Effect, isappledevice' + isAppleDevice() + 'isPWA' + isInStandaloneMode());
                    if(!isAppleDevice() || isInStandaloneMode()){
                        if (remainingTime && ["10", "5", "2"].includes(remainingTime)) {
                            sendReminderNotification(remainingTime);
                        }
                    }
                });
            };

            const intervalId = setInterval(checkNotificationTimes, 60000); // Check every minute
            return () => clearInterval(intervalId); // Cleanup on component unmount
        }
    }, [userHistoryUpdated]);
    return (
        <div className='song-history-container'>
            <div className='bg-music-dj-side'>
                <div className='dj-side-song-req-header'>
                    <div className='label-song-requests'>SONG REQUESTS</div>
                    <div className='label-song-requests'>{rowData.eventName}</div>
                    <div className='update-event-live-link'>
                        <a className="edit-profile-link" onClick={handleEditProfileClick}>UPDATE EVENT</a>
                        <div className="toggle-container">

                            <label htmlFor="liveToggle">LIVE</label>
                            <div className={`toggle-slider ${isLive ? 'active' : ''}`} onClick={handleLiveToggle}>
                                <div className={`slider-thumb ${isLive ? 'active' : ''}`} />
                            </div>


                        </div>
                    </div>
                </div>

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
                    <p style={{ color: "red" }}>You don't have any requests as of now.</p>
                )}
            </div>
        </div>
    );



}
