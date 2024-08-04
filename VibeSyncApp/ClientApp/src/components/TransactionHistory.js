import React, { useContext, useEffect, useState } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { GetTransactionHistory } from './services/PaymentService';
import './TransactionHistory.css';
import { MyContext } from '../App';
import { useLoadingContext } from './LoadingProvider';

function TransactionHistory() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [filteredTransactionHistory, setFilteredTransactionHistory] = useState([]);
    const [distinctEventNames, setDistinctEventNames] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const { setLoading } = useLoadingContext();

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const groupedTransactions = filteredTransactionHistory.reduce((acc, transaction) => {
  const date = formatDate(transaction.modifiedOn);
  if (!acc[date]) acc[date] = [];
  acc[date].push(transaction);
  return acc;
}, {});


    useEffect(async () => {
        setLoading(true);
        try {
            // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch transaction history
            var res = await GetTransactionHistory(localStorage.getItem('userId'));
            res.sort((a, b) => b.id - a.id);

            setTransactionHistory(res);
            setFilteredTransactionHistory(res); // Initialize with all records
            console.log(res);
            // Extract distinct event names from the data
            const eventNames = [...new Set(res.map((transaction) => transaction.eventName))];
            setDistinctEventNames(eventNames);
        } catch (error) {
            // Handle the error here and set error and error message as needed
            setError(true); // Assuming setError is a state variable to manage errors
            setErrorMessage(error.message); // Assuming setErrorMessage is a state variable to set error messages
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // Filter records based on the selected event
        if (selectedEvent !== '' && selectedEvent !== null && selectedEvent !== 'All') {
            const filteredRecords = transactionHistory.filter((transaction) => transaction.eventName === selectedEvent);
            filteredRecords.sort((a, b) => b.id - a.id);
            setFilteredTransactionHistory(filteredRecords);
        } else {
            // If no event is selected, show all records
            setFilteredTransactionHistory(transactionHistory);
        }
    }, [selectedEvent, transactionHistory]);

    // Calculate sum of total amounts in the filtered transaction history
    const totalAmountSum = filteredTransactionHistory.reduce((total, transaction) => {
        // Check if the songStatus is "Played"
        if (transaction.songStatus === "Played") {
            // If it is, add the totalAmount to the running total
            return total + parseFloat(transaction.totalAmount);
        }
        // If it's not "Played", just return the running total unchanged
        return total;
    }, 0);

    const handleEventFilterChange = (event) => {
        setSelectedEvent(event.target.value);
    };
    function formatDateTime(datetime) {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    function formatDateTime(datetime) {
        const date = new Date(datetime);

        // Get the components of the date
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = date.getDate().toString().padStart(2, '0');

        // Get the components of the time
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
    }


    function DateTimeDisplay({ datetimeString }) {
        const formattedDateTime = formatDateTime(datetimeString);
        return <div className="text-muted mb-0">{formattedDateTime}</div>;
    }


    return (
        <div className="transaction-history-container" >
            <div className='bg-music-background'>
            <div className = 'main-heading'>
            <h2>Transaction History</h2>
                    <div className="transaction-page-filter-container">
                {/*<label htmlFor="eventFilter">Filter by Event:</label>*/}
                <select
                    id="eventFilter"
                            className="transaction-event-filter-select"
                    value={selectedEvent}
                    onChange={handleEventFilterChange}
                >
                    <option value="All">All</option>
                    {/* Populate dropdown with distinct event names */}
                    {distinctEventNames.map((eventName) => (
                        <option key={eventName} value={eventName}>
                            {eventName}
                        </option>
                    ))}
                </select>
             </div>
                </div>
                {/*<div style={{ display: 'flex', justifyContent:'center' }}>*/}
                {/*    <div className = 'total-amount'>*/}
                {/*    <span className ='total-amount-heading'>Total Transactions </span>*/}
                {/*    <span className = 'total-sum'>{totalAmountSum}</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="transaction-cards">
                    {Object.entries(groupedTransactions).map(([date, transactions]) => (
                        <div key={date} className="date-group">
                            <h3 className="date-heading">{date}</h3>
                            {transactions.map((transaction, index) => (
                                <div key={index} className="transaction-card">

                                    <div className='transaction-page-left-content'>
                                         <div className="transaction-event-name">
                                             {transaction.eventName}
                                         </div>
                                         <div className="transaction-song-name">
                                             {transaction.songName}
                                         </div>
                                    </div>

                                    <div className='transaction-page-middle-content'>
                                        <div className="transaction-amount-paid">
                                            ₹{transaction.totalAmount}
                                        </div>
                                        <div className='time-payid-block'>
                                            <div className="date-time-payment"><DateTimeDisplay datetimeString={transaction.paymentDateTime || transaction.createdOn} /></div>
                                                {/*<div className="transaction-date-time-details">*/}
                                                {/*   {formatDateTime(transaction.modifiedOn)}*/}
                                                {/*</div>*/}
                                            <div >Txn ID: {transaction.paymentId}</div>
                                       </div>
                                    </div>

                                    <div className='transaction-page-right-content'>
                                    
                                        {transaction.songStatus === 'Played' ?
                                                (<div className='btn-right-content btn-payment-green'>
                                                {transaction.songStatus}
                                                </div>)
                                                :
                                            transaction.songStatus === 'Refunded' ?
                                                    (<div className='btn-right-content btn-payment-yellow'>
                                                    {transaction.songStatus}
                                                    </div>)
                                                : transaction.songStatus === 'Rejected' ?
                                                        (<div className='btn-right-content btn-payment-red'>
                                                        {transaction.songStatus}
                                                    </div>)
                                                    : transaction.songStatus === 'Pending' ?
                                                        (<div className='btn-right-content btn-payment-yellow'>
                                                            {transaction.songStatus}
                                                        </div>)
                                                           : ''
                                            }
                                        
                                        </div>
                                    </div>
                                
                            ))}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default TransactionHistory;
