import React, { useState, useEffect } from 'react';
import { Table, Pagination, DropdownButton, Dropdown, Container } from 'react-bootstrap';
import './SettlementHistory.css'; // Import custom CSS for styling

const SettlementComponent = () => {
    const [data, setData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(20);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eventNames, setEventNames] = useState([]);
    const [selectedEventName, setSelectedEventName] = useState('');

    const fetchSettlements = async (userId, pageNumber, pageSize, eventName) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/Settlements/GetSettlementsByUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    pageNumber,
                    pageSize,
                    eventName
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            // Sort data by dateCreated in descending order
            const sortedData = result.data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

            setData(sortedData);
            setTotalRows(result.totalRows);

            // Extract unique event names for the filter dropdown
            const uniqueEventNames = [...new Set(result.data.map(item => item.eventName))];
            setEventNames(uniqueEventNames);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let userId = localStorage.getItem('userId');
        fetchSettlements(userId, pageNumber, pageSize, selectedEventName);
    }, [pageNumber, selectedEventName]);

    const handlePageChange = (newPageNumber) => {
        setPageNumber(newPageNumber);
    };

    const handleEventNameFilter = (eventName) => {
        setSelectedEventName(eventName);
        setPageNumber(1); // Reset to the first page on filter change
    };

    return (
        <Container className="settlement-container">
            <h1 className="text-center settlement-header">Settlements</h1>
            <DropdownButton
                id="dropdown-event-name-filter"
                title={selectedEventName ? `Filter by Event: ${selectedEventName}` : 'Filter by Event'}
                onSelect={handleEventNameFilter}
                className="custom-dropdown"
            >
                <Dropdown.Item eventKey="">All Events</Dropdown.Item>
                {eventNames.map((name, index) => (
                    <Dropdown.Item key={index} eventKey={name}>
                        {name}
                    </Dropdown.Item>
                ))}
            </DropdownButton>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center error-message">{error}</p>}

            {data.length === 0 && !loading && (
                <p className="text-center no-settlements-message">No settlements to show.</p>
            )}

            {data.length > 0 && (
                <Table striped bordered hover responsive className="settlement-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Settled Amount</th>
                            <th>Remaining Amount</th>
                            <th>Settled Date</th>
                            <th>Minimum Bid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.eventName}</td>
                                <td>INR {item.amount}</td>
                                <td>INR {item.remainingAmount}</td>
                                <td>{new Date(item.dateCreated).toLocaleString()}</td>
                                <td>{item.minimumBid}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {data.length > 0 && (
                <Pagination className="justify-content-center mt-4">
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={pageNumber === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1} />
                    {[...Array(Math.ceil(totalRows / pageSize)).keys()].map(number => (
                        <Pagination.Item
                            key={number + 1}
                            active={number + 1 === pageNumber}
                            onClick={() => handlePageChange(number + 1)}
                        >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === Math.ceil(totalRows / pageSize)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(totalRows / pageSize))} disabled={pageNumber === Math.ceil(totalRows / pageSize)} />
                </Pagination>
            )}
        </Container>
    );
};

export default SettlementComponent;
