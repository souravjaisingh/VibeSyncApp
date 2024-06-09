import React, { useContext, useEffect, useState } from 'react';
import './SongHistory.css';
import { getUserRequestHistoryData } from './services/UserService';
import { MyContext } from '../App';
import { useLoadingContext } from './LoadingProvider';

export default function SongHistory() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const [userHistory, setUserHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const { setLoading } = useLoadingContext();

    async function fetchData(selectedFilter) {
        if (localStorage.getItem('userId') !== null) {
            try {
                setLoading(true);
                let res;
                if (selectedFilter === 'All') {
                    res = await getUserRequestHistoryData(localStorage.getItem('userId'));
                } else {
                    res = await getUserRequestHistoryData(localStorage.getItem('userId'), selectedFilter);
                }
                setUserHistory(res);
                const sortedData = sortUserHistory(res);
                setUserHistory(sortedData);
                setLoading(false);
            } catch (error) {
                setError(true);
                setErrorMessage(error.message);
                console.error('Error fetching user request history:', error);
            } finally {
                setIsLoading(false);
                setLoading(false);
            }
        }
    }

    function sortUserHistory(history) {
        const sortedUserHistory = [...history];

        sortedUserHistory.sort((a, b) => {
            return new Date(b.paymentDateTime) - new Date(a.paymentDateTime); // Sort by payment datetime in descending order
        });

        return sortedUserHistory;
    };

    useEffect(() => {
        fetchData(filter);
    }, [filter]);

    function formatDateTime(datetimeString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const dateTime = new Date(datetimeString);
        return dateTime.toLocaleString('en-US', options);
    }

    function DateTimeDisplay({ datetimeString }) {
        const formattedDateTime = formatDateTime(datetimeString);
        return <div className="text-muted mb-0">{formattedDateTime}</div>;
    }

    const handleDownloadInvoice = async (paymentId) => {
        try {
            const response = await fetch(`Invoice/GetInvoiceByPaymentId?paymentId=${paymentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${paymentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    };

    return (
        <>
            <div className="song-history-container">
                <ul style={{ listStyleType: 'circle' }}>
                    <li>
                        <em className="text-muted small info">Should the DJ decline your request, a refund will be issued to your original payment method.</em>
                    </li>
                    <li>
                        <em className="text-muted small info">If DJ accepts the request and doesn't play your song within 30 mins, you'll be issued a full refund.</em>
                    </li>
                </ul>


                <div className="filter-container">
                    <label className="filter-label" htmlFor="statusFilter">Filter by Status:</label>
                    <select
                        id="statusFilter"
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Played">Played</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Refunded">Refunded</option>
                    </select>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : userHistory.length === 0 ? (
                    <p>You haven't requested any songs yet</p>
                ) : (
                    <table className="song--history--table" align="middle" responsive hover>
                        <tbody>
                            {userHistory.map((result, index) => (
                                <React.Fragment key={index}>
                                    <tr className="song--history--body--row">
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
                                        <td>INR {result.totalAmount || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p className="text-muted mb-0" style={{ fontSize: 'small' }}>Status: <b>{result.songStatus}</b></p>
                                            {/* {result.songStatus === 'Played' && (
                                                <a
                                                    href={`Invoice/GetInvoiceByPaymentId?paymentId=${result.paymentId}`}
                                                    className="text-decoration-none"
                                                    style={{ fontSize: 'small', color: 'blue' }}
                                                    download={`invoice_${result.paymentId}.pdf`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Download Invoice
                                                </a>
                                            )} */}
                                        </td>
                                        <td colSpan="5">
                                            <DateTimeDisplay datetimeString={result.paymentDateTime || result.createdOn} />
                                            <p className="text-muted mb-0" style={{ fontSize: 'small' }}>Txn id: {result.paymentId}</p>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
