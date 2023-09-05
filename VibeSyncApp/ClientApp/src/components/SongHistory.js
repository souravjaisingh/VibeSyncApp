import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './DJList.css'
import getLiveEventsHelper from '../Helpers/EventsHelper';
import { getUserRequestHistoryData } from './services/UserService';

export default function SongHistory(){
    const [userHistory, setUserHistory] = useState();
    async function fetchData() {
        if (localStorage.getItem('userId') !== null) {
            try {
            const res = await getUserRequestHistoryData(localStorage.getItem('userId'));
            setUserHistory(res);
            } catch (error) {
            // Handle any errors here
            console.error('Error fetching user request history:', error);
            }
        }
    }
    useEffect(async ()=>{
        await fetchData(); // Call the async function immediately
    },[])
return(
    <>
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <MDBTable align='middle' responsive hover>
                    {/* <MDBTableHead>
                        <tr>
                            <th scope='col'>Song</th>
                            <th scope='col'>Album</th>
                            <th scope='col'>Image</th>
                        </tr>
                    </MDBTableHead> */}
                        <MDBTableBody>
                        {userHistory && userHistory.map((result, index) => (
                        <tr key={index} onClick={(e) => { }}>
                            <td>
                                <img
                                src={result.image}
                                alt={`Album Cover for ${result.albumName}`}
                                style={{ width: '45px', height: '45px' }}
                                className='rounded-circle'
                                />
                            </td>
                            <td>
                                <p className='fw-bold mb-1'>{result.songName}</p>
                                <p className='text-muted mb-0'>{result.artistName}</p>
                            </td>
                            <td>{result.albumName}</td>
                        </tr>
                        ))}
                        </MDBTableBody>
                </MDBTable>
            </div>
    </>
);
}