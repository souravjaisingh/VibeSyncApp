import React, { useEffect, useState } from 'react';
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { GetSongsByEventId } from './services/SongsService';
import './SongsTable.css';
import { useNavigate } from 'react-router-dom';

export default function SongsTable({ eventId, eventName }) {
    const [enqueuedSongs, setEnqueuedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songs = await GetSongsByEventId(localStorage.getItem('qrEventId'), localStorage.getItem('isUser') == 'true' ? true : false);
                setEnqueuedSongs(songs);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchSongs();
    }, [eventId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    const handleBack = () => {
        navigate(-1); // Go back to the previous page when back button is clicked
    };

    return (
        <div className='songs-table'>
            <span className="back-icon" onClick={handleBack}>
                &lt;&lt; Back &nbsp;
            </span>
            <h2>{localStorage.getItem('venue')}</h2>
            <h6>Requests Accepted by DJ:</h6>
            <MDBTable align='middle' responsive className='collapsible-table'>
                <MDBTableBody>
                    {enqueuedSongs && enqueuedSongs.map((result, index) => (
                        <tr key={index}>
                            <td>
                                <img
                                    src={result.image}
                                    style={{ width: '45px', height: '45px' }}
                                    className='rounded-circle'
                                    alt={`Cover for ${result.songName}`}
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
    );
}
