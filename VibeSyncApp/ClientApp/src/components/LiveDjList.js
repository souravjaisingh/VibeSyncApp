import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './DJList.css'
import getLiveEventsHelper from '../Helpers/EventsHelper';
import { MyContext } from '../App';
import defaultPhoto from '../Resources/defaultDj.jpg';
import { CreateReviews } from './services/DjService';

export default function LiveDjList() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const [events, setEvents] = useState([])
    const navigate = useNavigate();
    const [isReviewPopupVisible, setIsReviewPopupVisible] = useState(false);
    const [reviewStars, setReviewStars] = useState(0);
    const [reviewMessage, setReviewMessage] = useState('');
    const [selectedDjId, setSelectedDjId] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = events.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

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

    const handleRowClick = (rowData) => {
        // Serialize the rowData object to a JSON string and encode it
        const rowDataString = encodeURIComponent(JSON.stringify(rowData));

        // Navigate to the detail view with the serialized rowData as a parameter
        navigate(`/SongSearch?data=${rowDataString}`);
        //navigate('/SongSearch');
    };
    async function getEventsData(lat, lng) {
        try {
            const res = await getLiveEventsHelper(lat, lng);
            setEvents(res);
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error in getEventsData:', error);
        }
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            getEventsData(position.coords.latitude, position.coords.longitude);
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        });
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

    return (
        <>
            <div className='event-list'>
               
                {
                    filteredData.map(item =>
                        <>
                            <div key={item.id} onClick={(e) => { handleRowClick(item) }}>
                                <div className='event-card-outer'>
                                    <img
                                        src={item.djPhoto ? item.djPhoto : defaultPhoto} //use default photo if dj photo is null
                                        alt=''
                                        className='event-card-image' />
                                    <div className='event-card-text-block'>
                                        <div className='event-card-text-rating'><div className='event-card-text'><span className='event-card-title'>{item.eventName}</span>
                                            <span className='event-card-dj'>{item.djName}</span>
                                            <span className='event-card-venue'>{item.venue}</span></div>


                                            <div className='event-card-rating'>
                                                <img
                                                    onClick={(e) => { e.stopPropagation(); handleRatingClick(item); }}
                                                    className='rating-image'
                                                    src='/images/Ratingbutton.png'
                                                />
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
                                <button onClick={handleReviewSubmit} disabled={reviewStars === 0 || isSubmitting} className="btn btn--primary btn--medium btn-save" style={{ marginTop: "0px", padding: "6px 20px" }}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        
            
        </>
    );
}