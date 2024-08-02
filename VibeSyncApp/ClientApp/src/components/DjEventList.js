import React, { useContext, useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { GetDjEvents, GetEventsWithDjInfo } from './services/EventsService';
import { Link, useNavigate } from 'react-router-dom';
import './DJList.css'
import photo from '../Resources/DJWhite.jpg';
import SongSearch from './SongSearch';
import { MyContext } from '../App';
import QRCodeModal from './QRCodeModal';
import './DjEventList.css';
import { Live } from './Constants';
import { UpdateEventDetails } from './services/EventsService'
import { ListGroup } from 'react-bootstrap';
import { useLoadingContext } from './LoadingProvider';
export default function DjEventList() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLive,setIsLive] = useState([]);
    const { setLoading } = useLoadingContext();

    const [eventId, setEventId] = useState(null);

    const openModal = (e, rowData) => {
        e.stopPropagation();
        setEventId(rowData.id); // Set the selected rowData
        setModalIsOpen(true);
        if (localStorage.getItem('eventId') == null) {
            localStorage.setItem('eventId', eventId);
        }
    };

    const closeModal = (e) => {
        setModalIsOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = events.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    const handleRowClick = (rowData) => {
        if (!modalIsOpen) { // Check if the modal is not open
            // Serialize the rowData object to a JSON string and encode it
            const rowDataString = encodeURIComponent(JSON.stringify(rowData));
            console.log(rowData);

            if (rowData.eventStatus === 'Live' || rowData.eventStatus === 'Live-NA') {
                navigate(`/djlivesongs`,{state:{rowData:"?data="+rowDataString}});
            } else {
                navigate(`/eventdetails`,{state:{rowData:"?data="+rowDataString}});
            }
        }
    };



    async function getEventsData() {
        try {
            setLoading(true);
            const res = await GetDjEvents(localStorage.getItem('userId'));
            setEvents(res);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(true);
            setErrorMessage(error.message);
            console.error('Error in getEventsData:', error);
        }
    }


    const handleLiveToggle = async(e,key)=>{
        e.stopPropagation();
        let live_array_after_toggle = filteredData[key];
        live_array_after_toggle.eventStatus = live_array_after_toggle.eventStatus == Live? 'Not live':'Live';
        setLoading(true);
        await UpdateEventDetails(live_array_after_toggle)
        setLoading(false);
        navigate('/djhome')
        // // Handle toggle state changes
        // let live_toggle_rowData = filteredData[key];
        // live_toggle_rowData.eventStatus = !isLive[key]?'Live':'Not live';
        // let live_array_after_toggle = isLive;
        // live_array_after_toggle[key] = !live_array_after_toggle[key];
        // setIsLive(live_array_after_toggle);
        // await UpdateEventDetails(live_array_after_toggle);
    };



    useEffect(() => {
        getEventsData();
    }, [])
    return (
        <>
            {filteredData.length > 0 ? (<>
                <div className='dj-home-dj-info-container'>
                    <img src={filteredData[0].djPhoto} className='dj-home-dj-photo' />
                    <div>{filteredData[0].djName}</div>
                </div>
            </>) : (<></>)}


            <MDBInput
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search DJ/Venue"
            />
            {filteredData.length === 0 ? (
                <p style={{ color: "red" }}>You don't have any upcoming events as of now.</p>
            ) : (<div>


                {filteredData.map((item,key) => (
                    <div className='dj-home-event-card' onClick={(e) => handleRowClick(item)}>

                        <div className='dj-home-event-name'>
                            {item.eventName}
                        </div>
                        <div className='dj-home-event-venue'>
                            {item.venue}
                        </div>
                        <div className='dj-home-qr-live-toggle'>
                            <div className="dj-home-toggle-container">

                                <label htmlFor="liveToggle">LIVE</label>
                                <div className={`dj-home-toggle-slider ${item.eventStatus==Live ? 'active' : ''}`} onClick={(e)=>handleLiveToggle(e,key)}>
                                    <div className={`dj-home-slider-thumb ${item.eventStatus==Live ? 'active' : ''}`} />
                                </div>


                            </div>
                            <a
                                className='qr-code'
                                href="#!"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent the default anchor behavior

                                    e.currentTarget === e.target && openModal(e, item); // Call your openModal function
                                }}
                            >
                                GET QR Code
                                {/* <button className="btn btn--primary btn--medium btn-pay">Show QR Code</button> */}
                            </a>
                            <QRCodeModal isOpen={modalIsOpen} onRequestClose={closeModal} eventId={eventId} />
                        </div>


                    </div>
                ))}
            </div>
            )}
        </>
    );

}