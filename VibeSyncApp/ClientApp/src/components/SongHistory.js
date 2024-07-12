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
            <div className='bg-music-song-history'>
                <div className='song-inner-container'>
                <div className="filter-container">
                    <label className="filter-label" htmlFor="statusFilter">SONG REQUESTS</label>
                    <select
                        id="statusFilter"
                        className="filter-select-song-history"
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
                        <>
                            {userHistory.map((result, index) => {
                                return (
                                    <div className='song-row-history-page'>
                                        <div className='history-page-left-content'>
                                            <div className='song-row-song-name'>{result.songName}</div>
                                            <div className='song-row-artist-name'>{result.artistName}</div>
                                        </div>
                                        <div className='history-page-middle-content'>
                                            <div className='song-row-amount-paid'>₹{result.totalAmount}</div>
                                            <div className='time-paymentid-block'>
                                                <div  className="date-time-payment"><DateTimeDisplay datetimeString={result.paymentDateTime || result.createdOn} /></div>
                                                <div >Txn ID: {result.paymentId}</div>
                                            </div>
                                        </div>
                                        <div className='history-page-right-content'>
                                            {result.songStatus==='Played'?
                                                (<div className='btn-right-content btn-payment-green'>
                                                    {result.songStatus}
                                                </div>)
                                                :
                                            result.songStatus==='Refunded'?
                                                (<div className='btn-right-content btn-payment-yellow'>
                                                    {result.songStatus}
                                                </div>)
                                                :result.songStatus==='Rejected'?
                                                (<div className='btn-right-content btn-payment-red'>
                                                    {result.songStatus}
                                                </div>)
                                                :result.songStatus==='Pending'?
                                                (<div className='btn-right-content btn-payment-yellow'>
                                                    {result.songStatus}
                                                </div>)
                                                :result.songStatus==='Accepted'?
                                                (<div className='btn-right-content btn-payment-yellow'>
                                                    {result.songStatus}
                                                </div>)
                                                :''
                                            }
                                        </div>
                                    </div>
                                )
                            })}

                        </>
                    )}
                </div>
                </div>
            </div>
        </>
    );
}
