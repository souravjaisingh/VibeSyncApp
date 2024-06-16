import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Settlements.css'; // Import your styling
import { GetEventByEventId } from './services/EventsService';
import { GetSettlementsDataByEvent, SettleEventPayments } from './services/SettlementsService';
import { useLoadingContext } from './LoadingProvider';

const Settlements = () => {
    const [settledAmount, setSettledAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [amountToSettle, setAmountToSettle] = useState('');
    const [eventDetails, setEventDetails] = useState(null);
    const [settlementDetails, setSettlementDetails] = useState(null);
    const { setLoading } = useLoadingContext();

    const fetchSettlementDetails = async () =>{
        setLoading(true);
        const response = await GetEventByEventId(localStorage.getItem('qrEventId'), 0);
        setEventDetails(response);
        const settlementData = await GetSettlementsDataByEvent(localStorage.getItem('qrEventId'));
        //setSettlementDetails(settlementData);
        console.log(settlementData);
        if (settlementData) {
            //setSettlementDetails(settlementData);
            console.log(settlementData);
    
            setTotalAmount(settlementData.totalAmount);
            setSettledAmount(settlementData.settledAmount);
            setRemainingAmount(settlementData.remainingAmount);
        } else {
            // Handle the case when settlementData is null
            setTotalAmount(0);
            setSettledAmount(0);
            setRemainingAmount(0);
        }
        setLoading(false);
    }

    useEffect(async () => {
        fetchSettlementDetails();
    }, []);

    const handlePay = async () => {
        const value = parseFloat(amountToSettle);
        if (value > remainingAmount) {
            Swal.fire({
                title: 'Error!',
                text: `Amount to settle cannot be greater than ${remainingAmount}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else if (value <= 0 || isNaN(value)) {
            Swal.fire({
                title: 'Error!',
                text: `Please enter a valid amount to settle.`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else {
            const obj = {
                eventId : localStorage.getItem('qrEventId'),
                settlementAmount : amountToSettle
            };
            setLoading(true);
            var res = await SettleEventPayments(obj);
            console.log(res);
            if (res == true) {
                Swal.fire({
                    title: 'Success!',
                    text: 'The amount has been settled successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    fetchSettlementDetails();
                });
            }
            setLoading(false);
        }

        // Optionally, you can reset the amount to settle
        setAmountToSettle('');
    };
    
    return (
        <div className="settlements-container">
            {eventDetails && <h3 className='event-name event-name-heading'>{eventDetails.eventName}</h3>}
            {eventDetails && <h4 className='dj-name-heading'>{eventDetails.djName}</h4>}
            {setSettlementDetails && <div className="amount-info">
                <p><strong>Total Amount:</strong> {totalAmount}</p>
                <p><strong>Settled Amount:</strong> {settledAmount}</p>
                <p><strong>Remaining Amount:</strong> {remainingAmount}</p>
            </div>}
            <div className="settle-form">
                <label htmlFor="amountToSettle">Enter Amount to Settle:</label>
                <input
                    type="number"
                    id="amountToSettle"
                    value={amountToSettle}
                    onChange={(e) => setAmountToSettle(e.target.value)}
                    className="amount-input"
                />
                <button onClick={handlePay} className="pay-button">Pay</button>
            </div>
        </div>
    );
};

export default Settlements;
