import React, { useContext, useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import './SongHistory.css';
import { getUserRequestHistoryData } from './services/UserService';
import { MyContext } from '../App';

export default function SongHistory() {
    const { error, setError } = useContext(MyContext);
    const {errorMessage, setErrorMessage} = useContext(MyContext);
    const [userHistory, setUserHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchData() {
        if (localStorage.getItem('userId') !== null) {
            try {
                const res = await getUserRequestHistoryData(localStorage.getItem('userId'));
                setUserHistory(res);
                // const {sortUserHistory} = DjLiveSongs;
                var sortedData = sortUserHistory(res);
                setUserHistory(sortedData);
            } catch (error) {
                // Handle any errors here
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching user request history:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }
        // Function to sort userHistory
        function sortUserHistory(history){
            const sortedUserHistory = [...history];
    
            sortedUserHistory.sort((a, b) => {
                return new Date(b.paymentDateTime) - new Date(a.paymentDateTime); // Sort by payment datetime in descending order
            });
    
            return sortedUserHistory;
        };
    useEffect(() => {
        fetchData(); // Call the async function immediately
    }, []);
    function formatDateTime(datetimeString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const dateTime = new Date(datetimeString);
        return dateTime.toLocaleString('en-US', options);
    }

    function DateTimeDisplay({ datetimeString }) {
        const formattedDateTime = formatDateTime(datetimeString);

        return <div className="text-muted mb-0">{formattedDateTime}</div>;
    }
    return (
        <>
            <div className="song-history-container">
                {isLoading ? (
                    <p>Loading...</p>
                ) : userHistory.length === 0 ? (
                    <p>You haven't requested any songs yet</p>
                ) : (
                    <MDBTable className="song--history--table" align="middle" responsive hover>
                        {/* <MDBTableHead>
                            <tr className="song--history--header--row">
                                <th className="song--history--header--cell" scope="col"></th>
                                <th className="song--history--header--cell" scope="col">Song/Artist</th>
                                <th className="song--history--header--cell" scope="col">Album</th>
                                <th className="song--history--header--cell" scope="col">Amount</th>
                                <th className="song--history--header--cell" scope="col"></th>
                            </tr>
                        </MDBTableHead> */}
                        <MDBTableBody>
                            {userHistory.map((result, index) => (
                                <>
                                    <tr className="song--history--body--row" key={index} onClick={(e) => { }}>
                                        <td rowSpan="2">
                                            <img
                                                src={result.image}
                                                alt={`Album Cover for ${result.albumName}`}
                                                className="album--cover--image"
                                            />
                                        </td>
                                        <td rowSpan="2" className="song--details">
                                            <p className="song--name">{result.songName}</p>
                                            <p className="artist--name">{result.artistName}</p>
                                        </td>
                                        <td>{result.albumName}</td>
                                        <td>INR {result.totalAmount}</td>
                                    </tr>
                                    <tr>
                                        <td >
                                            <p className="text-muted mb-0" style={{ fontSize: 'small' }}>Status: <b>{result.songStatus}</b></p>
                                        </td>
                                        <td colSpan="5">
                                            <DateTimeDisplay datetimeString={result.paymentDateTime} />
                                            <p className="text-muted mb-0" style={{ fontSize: 'small' }}>Txn id: {result.paymentId}</p>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </MDBTableBody>
                    </MDBTable>
                )}
            </div>
        </>
    );
}
