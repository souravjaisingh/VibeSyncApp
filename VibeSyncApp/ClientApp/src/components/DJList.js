import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { GetEventsWithDjInfo } from './services/EventsService';
import './DJList.css'
import photo from '../Resources/DJWhite.jpg';

export default function DjList(){
    const [events, setEvents] = useState([])
    async function getEventsData(){
        const res = await GetEventsWithDjInfo();
        //console.log(res);
        setEvents(res);
    }
    useEffect(()=>{
        getEventsData();
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            });
    },[])
return(
    <>
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
        events.map(item => 
            <>
            <tr onClick={(e) => { console.log(e.target) }}>
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