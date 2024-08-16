import React, { useState, useEffect } from 'react';
import './StickyBar.css';
import { GetReviews } from './services/DjService';

const getRandomIndex = (array) => {
    return Math.floor(Math.random() * array.length);
};

const getRandomAmount = (minAmount) => {
    return minAmount + Math.floor(Math.random() * 101) + 100;
};

const StickyBar = ({ type, data, minAmount, isVisible, onClose }) => {
    const [reviews, setReviews] = useState([]); // for reviews from the API
    const [currentItem, setCurrentItem] = useState(data[getRandomIndex(data)]); //currentItem fetching hardcoded values
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (type === 'review') {
            const fetchReviews = async () => {
                try {
                    setLoading(true);
                    const fetchedReviews = await GetReviews(); // Fetch reviews from backend
                    setReviews(fetchedReviews);
                    //console.log(fetchedReviews);
                } catch (err) {
                    setError('Failed to fetch reviews.');
                } finally {
                    setLoading(false);
                }
            };

            fetchReviews();
        }
    }, [type]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentItem(data[getRandomIndex(data)]);
        }, 3000); // Change content every 3 seconds

        return () => clearInterval(interval);
    }, [data]);

    const renderContent = () => {
        if (loading && type === 'review') return <p>Loading...</p>;
        if (error && type === 'review') return <p>{error}</p>;
        if (!currentItem) return null;

        if (type === 'review') {

            const review = reviews[getRandomIndex(reviews)] || {};
            return (
                <>
                    <img src={currentItem.image} alt={currentItem.author} className="review-image" />  {/*displaying already existing images*/}
                    <div className="text-content">
                        <span className="stars">{'★'.repeat(Math.floor(Math.random() * 2) + 4)}</span>
                        <p className="review-text">{currentItem.text}</p>
                        <p className="author">- {currentItem.author}</p>

                        {/*<span className="stars">{'★'.repeat(review.star || Math.floor(Math.random() * 2) + 4)}</span>*/}
                        {/*<p className="review-text">{review.review1 || currentItem.text}</p>  */}{/*displaying reviews from API only if they are present */}
                        {/*<p className="author">- {currentItem.author}</p>   */}{/*displaying already existing author names*/}

                    </div>
                </>
            );
        } else if (type === 'bid') {
            const amount = getRandomAmount(minAmount);
            return (
                <p className="bid-message">{`${currentItem.text} INR ${amount} .`}</p>
            );
        }
    };

    if (!isVisible) return null;

    return (
        <div className="sticky-bar">
            <div className="content">
                {renderContent()}
            </div>
            <button className="close-button" onClick={onClose} style={{ color: "white" } } > × </button>
        </div>
    );
};

export default StickyBar;