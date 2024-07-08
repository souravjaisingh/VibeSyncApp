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
        <>
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

            {/* <MDBTable align='middle' responsive hover>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Dj Name</th>
                        <th scope='col'>Event Name</th>
                        <th scope='col'>Venue</th>
                        <th scope='col'>Status</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {
                        filteredData.map(item =>
                            <>
                                <tr onClick={(e) => { handleRowClick(item) }}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <img
                                                src={item.djPhoto ? item.djPhoto : defaultPhoto} //use default photo if dj photo is null
                                                alt=''
                                                style={{ width: '45px', height: '45px' }}
                                                className='rounded-circle' />
                                            <div className='p-2'>
                                                <p className='fw-bold mb-1'>{item.djName}</p>
                                                <MDBBadge color={item.eventStatus === 'Not live' ? 'warning' : 'success'} pill>
                                                    {item.eventStatus === 'Not live' ? 'Upcoming' : 'Live'}
                                                </MDBBadge>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className='fw-normal mb-1'>{item.eventName}</p>
                                        <DateTimeDisplay datetimeString={item.eventStartDateTime} />
                                    </td>
                                    <td>
                                        <p className='fw-normal mb-1'>{item.venue}</p>
                                        <p className='text-muted mb-0'>IT department</p>
                                    </td>
                                    <td>
                                        <MDBBadge color={item.eventStatus === 'Live' ? 'success' : 'warning'} pill>
                                            {item.eventStatus == 'Live' ? 'Live' : 'Upcoming'}
                                        </MDBBadge>

                                    </td>
                                </tr>
                            </>
                        )
                    }
                </MDBTableBody>
            </MDBTable> */}

            <StickyBar type="review" data={reviews} />
        </>
    );
}