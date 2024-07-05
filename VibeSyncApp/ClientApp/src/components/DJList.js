import React, { useContext, useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { GetEventsWithDjInfo } from './services/EventsService';
import { useNavigate } from 'react-router-dom';
import './DJList.css'
import photo from '../Resources/DJWhite.jpg';
import SongSearch from './SongSearch';
import { MyContext } from '../App';
import StickyBar from './StickyBar';
import { reviews} from './Constants';

export default function DjList() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
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
                        {/* <th scope='col'>Status</th> */}
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
                                        {/* <p className='text-muted mb-0'>IT department</p> */}
                                    </td>
                                    {/* <td>
                                        <MDBBadge color={item.eventStatus === 'Live' ? 'success' : 'warning'} pill>
                                            {item.eventStatus == 'Live' ? 'Live' : 'Upcoming'}
                                        </MDBBadge>

                                    </td> */}
                                </tr>
                            </>
                        )
                    }
                </MDBTableBody>
            </MDBTable>

            <StickyBar type="review" data={reviews} />
        </>
    );
}