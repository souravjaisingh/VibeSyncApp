import React, { useContext, useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { GetEventsWithDjInfo } from './services/EventsService';
import { useNavigate } from 'react-router-dom';
import './DJList.css'
import defaultPhoto from '../Resources/defaultDj.jpg';
import SongSearch from './SongSearch';
import { MyContext } from '../App';
import StickyBar from './StickyBar';
import { reviews } from './Constants';
import LiveDjList from './LiveDjList'

export default function DjList() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [showLiveEvents, setShowLiveEvents] = useState('all'); // Set default filter to "all"
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(true);


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

        // Navigate to the detail view with the serialized rowData as a parameter
        navigate(`/SongSearch?data=${rowDataString}`);
        //navigate('/SongSearch');
    };

    const handleRatingClick = (rowData) => {
        //TODO: add logic to add rating to a particular event
    };


    async function getEventsData() {
        try {
            const res = await GetEventsWithDjInfo();
            setEvents(res);
        } catch (error) {
            setError(true);
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

    return (
        <div className='dj-lists-wrapper'>
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
                <div className='down-arrow'>&#11167;</div>
            </div>



            {showLiveEvents === 'live' ? (
                <LiveDjList />
            ) : (
            <div className='event-list'>
                {/* <div className='events-search'>
                    <input type="text"
                        className='search-bar-dj-list'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search your vibe" />
                </div> */}
                {
                    filteredData.map(item =>
                        <>
                            <div onClick={(e) => { handleRowClick(item) }}>
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
                                                <img onClick={(e) => { handleRatingClick(item) }} className='rating-image' src='/images/Ratingbutton.png' />
                                            </div></div>
                                        <div className='rating'>
                                            <div>{Array.from({ length: item.rating?item.rating:4 }, (_, index) => (
                                                <span>&#9733;</span>
                                            ))}
                                            {Array.from({ length: 5-(item.rating?item.rating:4) }, (_, index) => (
                                                <span>&#9734;</span>
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

            

            <StickyBar
                type="review"
                data={reviews}
                onClose={() => { setIsStickyBarVisible(false); }}
                isVisible={isStickyBarVisible}
            />

        </div>
    );
}