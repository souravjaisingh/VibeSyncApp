import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import './SongHistory.css';
import { getUserRequestHistoryData } from './services/UserService';

export default function SongHistory() {
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
    useEffect(async () => {
        await fetchData(); // Call the async function immediately
    }, [])
    return (
        <>
            <div className="song-history-container">
                <MDBTable className="song-history-table" align="middle" responsive hover>
                    <MDBTableHead>
                        <tr className="song--history--header--row">
                            <th className="song--history--header--cell" scope="col"></th>
                            <th className="song--history--header--cell" scope="col">Song/Artist</th>
                            <th className="song--history--header--cell" scope="col">Album</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {userHistory && userHistory.map((result, index) => (
                            <tr className="song--history--body--row" key={index} onClick={(e) => { }}>
                                <td>
                                    <img
                                        src={result.image}
                                        alt={`Album Cover for ${result.albumName}`}
                                        className="album--cover--image"
                                    />
                                </td>
                                <td className="song--details">
                                    <p className="song--name">{result.songName}</p>
                                    <p className="artist--name">{result.artistName}</p>
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