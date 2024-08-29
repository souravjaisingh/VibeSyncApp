import React, { useContext, useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { GetEventsWithDjInfo } from './services/EventsService';
import { CreateReviews } from './services/DjService';
import { useNavigate } from 'react-router-dom';
import './DJList.css'
import defaultPhoto from '../Resources/defaultDj.jpg';
import SongSearch from './SongSearch';
import { MyContext } from '../App';
import StickyBar from './StickyBar';
import { reviews } from './Constants';
import LiveDjList from './LiveDjList'
import { useLoadingContext } from './LoadingProvider';
import { UpdateEventDetails } from './services/EventsService';

export default function DjList() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [showLiveEvents, setShowLiveEvents] = useState('all'); // Set default filter to "all"
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(true);
    const { setLoading } = useLoadingContext();
    const [isReviewPopupVisible, setIsReviewPopupVisible] = useState(false);
    const [reviewStars, setReviewStars] = useState(0);
    const [reviewMessage, setReviewMessage] = useState('');
    const [selectedDjId, setSelectedDjId] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
   
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


    const handleFilterChange = (event) => {
        setShowLiveEvents(event.target.value);
    };


    const filteredData = events.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    const handleRowClick = (rowData) => {
        // Serialize the rowData object to a JSON string and encode it
        const rowDataString = encodeURIComponent(JSON.stringify(rowData));

        if (isAdmin) {
            console.log(rowData);
            localStorage.setItem('qrEventId', rowData.id);
            navigate(`/eventdetails`, { state: { rowData: '?data=' + rowDataString } });
        }
        else {
            // Navigate to the detail view with the serialized rowData as a parameter
            navigate(`/SongSearch`, { state: { rowData: "?data=" + rowDataString } });
        }
    };


    const handleRatingClick = (item) => {
        // console.log(item);

        const selectedDjId = item.djId;
        const selectedEventId = item.id;
        const currentUserId = item.userId.toString(); 
        
        setSelectedDjId(selectedDjId);
        setSelectedEventId(selectedEventId);
        setCurrentUserId(currentUserId);

        // Reset the form fields
        setReviewStars(0);
        setReviewMessage('');

        setIsReviewPopupVisible(true);
    };



    const handleReviewSubmit = async () => {
        try {
            setIsSubmitting(true); 

            // Preparing the data to be sent to the backend
            const reviewData = {
                djId: selectedDjId,
                eventId: selectedEventId,
                review1: reviewMessage,
                star: reviewStars,
                createdBy: currentUserId, 
            };

            console.log("Review data being sent to the backend:", reviewData);

            // Sending data to the backend
            await CreateReviews(reviewData);

            // Reset the form fields
            setReviewStars(0);
            setReviewMessage('');

            // Close the popup after submission
            setIsReviewPopupVisible(false);
            console.log('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting the review:', error);
        } finally {
            setIsSubmitting(false); 
        }
    };


    async function getEventsData() {
        try {
            setLoading(true);
            const res = await GetEventsWithDjInfo();
            setEvents(res);
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
            setErrorMessage(error.message);
            console.error('Error in getEventsData:', error);
        }
    }

    useEffect(() => {
        getEventsData();
    }, [])
    function formatDateTime(datetimeString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const dateTime = new Date(datetimeString);
        return dateTime.toLocaleString('en-US', options);
    }

    function DateTimeDisplay({ datetimeString }) {
        const formattedDateTime = formatDateTime(datetimeString);

        return <div className="text-muted mb-0 event-date">{formattedDateTime}</div>;
    }

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        
        if (userId === "10077") {
            setIsAdmin(true);
        }
    }, []);

    const handleLiveToggle = async (e, item) => {
        e.stopPropagation();

        item.eventStatus = item.eventStatus === 'Live' ? 'Not live' : 'Live';

        setLoading(true);
        await UpdateEventDetails(item);
        setLoading(false);
    };

    return (
        <div className='dj-lists-wrapper'>
            <div className = 'image-bg'>
            <div className="search-filter-bar">
                <div className="search-bar-container">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search DJ/Venue"
                    />
                    <img src="/images/SearchButton1.png" alt="Search" className="search-icon" />
                </div>
                <select className="filter-dropdown" onChange={handleFilterChange} value={showLiveEvents}>
                    <option value="all">All</option>
                    <option value="live">Live</option> 
                </select>
                <div className='down-arrow'><img style={{width:'10px'}} src="/images/arrow-down-sign-to-navigate.png" /></div>
            </div>



            {showLiveEvents === 'live' ? (
                <LiveDjList />
            ) : (
            <div className='event-list'>
                
                {
                    filteredData.map(item =>
                        <>
                            <div key={item.id} onClick={(e) => { handleRowClick(item) }} className ='all-event-wrapper'>
                                <div className='event-card-outer'>
                                    <img
                                        src={item.djPhoto ? item.djPhoto : defaultPhoto} //use default photo if dj photo is null
                                        alt=''
                                        className='event-card-image' />
                                    <div className='event-card-text-block'>
                                        <div className='event-card-text-rating'><div className='event-card-text' style={isAdmin ? {width:"65%", minWidth : "65%" } : {}}><span className='event-card-title'>{item.eventName}</span>
                                            <span className='event-card-dj'>{item.djName}</span>
                                            <span className='event-card-venue'>{item.venue}</span></div>


                                            <div className='event-card-rating' style={isAdmin ? { marginTop : "10px", minWidth: "auto", width: "auto" } : {}}>
                                                {isAdmin ? (
                                                    // Toggle Button for Admin
                                                    <div className="event-home-toggle-container">
                                                       {/* <label htmlFor="liveToggle">LIVE</label>*/}
                                                        <div
                                                            className={`event-home-toggle-slider ${item.eventStatus == 'Live' ? 'active' : ''}`}
                                                            onClick={(e) => handleLiveToggle(e, item)}
                                                        >
                                                            <div
                                                                className={`event-home-slider-thumb ${item.eventStatus == 'Live' ? 'active' : ''}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Rating Button for Regular Users
                                                    <img
                                                        onClick={(e) => { e.stopPropagation(); handleRatingClick(item); }}
                                                        className='rating-image'
                                                        src='/images/Ratingbutton.png'
                                                    />
                                                )}
                                            </div></div>
                                        <div className='rating'>
                                            <div>{Array.from({ length: item.rating?item.rating:4 }, (_, index) => (
                                                <span key={index}>&#9733;</span>
                                            ))}
                                            {Array.from({ length: 5-(item.rating?item.rating:4) }, (_, index) => (
                                                <span key={index}>&#9734;</span>
                                            ))}</div>
                                            {item.eventStatus === 'Not live' ? '' : <img  className='live-image' src='/images/live.png' />
                                            }</div>

                                    </div>
                                </div>
                            </div>
                        </>

                    )}
            </div>
            )}

                {isReviewPopupVisible && (
                    <div className="review-popup">
                        <div className="review-popup-content">
                            <span className="close-review-popup" onClick={() => setIsReviewPopupVisible(false)}>&times;</span>
                            <h3 className="Rate-DJ">Rate this DJ</h3>
                            <div className="review-stars-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${star <= reviewStars ? 'filled' : ''}`}
                                        onClick={() => setReviewStars(star)}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                            <textarea
                                placeholder="Write a review..."
                                value={reviewMessage}
                                onChange={(e) => setReviewMessage(e.target.value)}
                            />
                            <div className="review-popup-buttons" >
                                <button onClick={handleReviewSubmit} disabled={reviewStars === 0 || isSubmitting} className="btn btn--primary btn--medium btn-save" style={{ marginTop: "0px", padding: "6px 20px"} }>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            <StickyBar
                type="review"
                data={reviews}
                onClose={() => { setIsStickyBarVisible(false); }}
                isVisible={isStickyBarVisible}
            />
            </div>
        </div>
    );
}