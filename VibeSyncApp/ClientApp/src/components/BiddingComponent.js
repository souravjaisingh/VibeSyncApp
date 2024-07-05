import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StickyBar from './StickyBar';


const messages = [
    { id: 1, text: "Bhavik on your left has paid the final payment of " },
    { id: 2, text: "Rohit on your right has paid the final payment of " },
    { id: 3, text: "Rahul has successfully completed the payment of " },
    { id: 4, text: "Soham has paid the final payment of " },
    { id: 5, text: "Tarun has completed the payment, adding  " },
    { id: 6, text: "Muskan straight ahead just completed the payment of " },
    { id: 7, text: "Harshit has made the final payment of " },
    { id: 8, text: "Daniel has just paid " },
    { id: 9, text: "Harman has paid the final payment of " },
    { id: 10, text: "Sid on your left has completed the payment of " },
    { id: 11, text: "Ava has paid the final payment of " }
    ];



const BiddingComponent = () => {
    const [minAmount, setMinAmount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const DataString = searchParams.get('data');
        const uri = JSON.parse(decodeURIComponent(DataString));
        const Amount = parseFloat(uri["minimumBid"]);
        setMinAmount(Amount)
        
    }, [location.search]);



    return (
        <div>
            {/* Other content */}
            <StickyBar type="bid" data={messages} minAmount={minAmount} />
        </div>
    );
};

export default BiddingComponent;