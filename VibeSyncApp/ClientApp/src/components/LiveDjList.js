import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './DJList.css'
import getLiveEventsHelper from '../Helpers/EventsHelper';
import { MyContext } from '../App';

export default function LiveDjList() {
    const { error, setError } = useContext(MyContext);
    const {errorMessage, setErrorMessage} = useContext(MyContext);
    const [events, setEvents] = useState([])
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
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
            <MDBInput
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search DJ/Venue"
            />
            <MDBTable align='middle' responsive hover>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Dj Name</th>
                        <th scope='col'>Event Name</th>
                        <th scope='col'>Venue</th>
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
                                                src={item.djPhoto}
                                                alt=''
                                                style={{ width: '45px', height: '45px' }}
                                                className='rounded-circle' />
                                            <div className='p-2'>
                                                <p className='fw-bold mb-1'>{item.djName}</p>
                                                <MDBBadge color={item.eventStatus === 'Live' ? 'success' : 'warning'} pill>
                                                    {item.eventStatus == 'Live' ? 'Live' : 'Upcoming'}
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
                                        {/* <p className='text-muted mb-0 event-date'>{Math.round((((item.distanceFromCurrLoc + Number.EPSILON) * 100) / 100)*1.6)} Km</p> */}
                                        {/* <p className='text-muted mb-0'>IT department</p> */}
                                    </td>

                                </tr>
                            </>
                        )
                    }
                </MDBTableBody>
            </MDBTable>
        </>
    );
}