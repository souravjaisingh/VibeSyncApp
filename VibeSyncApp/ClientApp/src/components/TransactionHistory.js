import React, { useContext, useEffect, useState } from 'react';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { GetTransactionHistory } from './services/PaymentService';
import './TransactionHistory.css';
import { MyContext } from '../App';

function TransactionHistory() {
    const { error, setError } = useContext(MyContext);
    const {errorMessage, setErrorMessage} = useContext(MyContext);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [filteredTransactionHistory, setFilteredTransactionHistory] = useState([]);
    const [distinctEventNames, setDistinctEventNames] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');

    useEffect(async () => {
        try {
            // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch transaction history
            var res = await GetTransactionHistory(localStorage.getItem('userId'));
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
        if (selectedEvent !== '' && selectedEvent !== null &&  selectedEvent !== 'All') {
            const filteredRecords = transactionHistory.filter((transaction) => transaction.eventName === selectedEvent);
            setFilteredTransactionHistory(filteredRecords);
        } else {
            // If no event is selected, show all records
            setFilteredTransactionHistory(transactionHistory);
        }
    }, [selectedEvent, transactionHistory]);

    const handleEventFilterChange = (event) => {
        setSelectedEvent(event.target.value);
    };

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
        <MDBTable className="transaction-table" striped hover responsive>
            <MDBTableHead>
            <tr>
                <th>Event Name</th>
                <th>Song Name</th>
                <th>Payment ID</th>
                <th>Total Amount</th>
            </tr>
            </MDBTableHead>
            <MDBTableBody>
            {filteredTransactionHistory.map((transaction, index) => (
                <tr key={index}>
                <td>{transaction.eventName}</td>
                <td>{transaction.songName}</td>
                <td>{transaction.paymentId}</td>
                <td>{transaction.totalAmount}</td>
                </tr>
            ))}
            </MDBTableBody>
        </MDBTable>
        </div>
    );
}

export default TransactionHistory;
