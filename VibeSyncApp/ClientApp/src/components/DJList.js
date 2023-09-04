import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { GetEventsWithDjInfo } from './services/EventsService';
import { useNavigate } from 'react-router-dom';
import './DJList.css'
import photo from '../Resources/DJWhite.jpg';
import SongSearch from './SongSearch';

export default function DjList(){
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

    async function getEventsData(){
        const res = await GetEventsWithDjInfo();
        //console.log(res);
        setEvents(res);
    }
    useEffect(()=>{
        getEventsData();
    },[])
return(
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
        <th scope='col'>Name</th>
        <th scope='col'>Venue</th>
        <th scope='col'>Status</th>
        <th scope='col'>Position</th>
        <th scope='col'>Actions</th>
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
                        src={`/images/${item.djPhoto}`}
                        alt=''
                        style={{ width: '45px', height: '45px' }}
                        className='rounded-circle' />
                    <div className='ms-3'>
                        <p className='fw-bold mb-1'>{item.djName}</p>
                        <p className='text-muted mb-0'>{item.djDescription}</p>
                    </div>
                </div>
            </td><td>
                    <p className='fw-normal mb-1'>{item.venue}</p>
                    {/* <p className='text-muted mb-0'>IT department</p> */}
                </td><td>
                    <MDBBadge color='success' pill>
                        Active
                    </MDBBadge>
                </td><td>Senior</td><td>
                    <MDBBtn color='link' rounded size='sm'>
                        Edit
                    </MDBBtn>
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