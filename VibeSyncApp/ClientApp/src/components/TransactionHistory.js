import React, { useContext, useEffect, useState } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { GetTransactionHistory } from './services/PaymentService';
import './TransactionHistory.css';
import { MyContext } from '../App';

function TransactionHistory() {
    const { error, setError } = useContext(MyContext);
    const { errorMessage, setErrorMessage } = useContext(MyContext);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [filteredTransactionHistory, setFilteredTransactionHistory] = useState([]);
    const [distinctEventNames, setDistinctEventNames] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');

    useEffect(async () => {
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
    return (
        <div className="transaction-history-container">
            <h2>Transaction History</h2>
            <div className="filter-container">
                <label htmlFor="eventFilter">Filter by Event:</label>
                <select
                    id="eventFilter"
                    className="event-filter-select"
                    value={selectedEvent}
                    onChange={handleEventFilterChange}
                >
                    <option value="All">All Events</option>
                    {/* Populate dropdown with distinct event names */}
                    {distinctEventNames.map((eventName) => (
                        <option key={eventName} value={eventName}>
                            {eventName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <span style={{ color: 'green' }}>Total Amount: INR {totalAmountSum}</span>
            </div>
            <MDBTable className="transaction-table" striped hover responsive>
                <MDBTableHead>
                    <tr>
                        <th>Event Name</th>
                        <th>Song Name</th>
                        <th>Payment</th>
                        <th>Total Amount</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredTransactionHistory.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.eventName}</td>
                            <td>{transaction.songName}</td>
                            <td>{transaction.paymentId}<br></br><span className='text-muted'>{formatDateTime(transaction.modifiedOn)}</span></td>
                            <td>INR {transaction.totalAmount}<br></br><span style={{ color: transaction.songStatus === "Played" ? 'green' : 'red' }}>
                                {transaction.songStatus}
                            </span></td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>
        </div>
    );
}

export default TransactionHistory;
