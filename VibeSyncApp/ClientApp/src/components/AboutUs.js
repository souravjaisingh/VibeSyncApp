import React, { useEffect } from 'react';
import './AboutUs.css';
function AboutUs() {
    useEffect(() => {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers
    }, [])
    return (
        <div className="about-us-container">
            <h1>About Us</h1>
            <p>Welcome to VibeSync, your one-stop destination for music enthusiasts and DJs. We're dedicated to bringing music lovers and talented DJs together in a seamless and interactive environment.</p>

            <h2>Our Mission</h2>
            <p>At VibeSync, we aim to create a vibrant community that celebrates music in all its forms. Our mission is to:</p>
            <ul>
                <li>Connect DJs with their fans and audiences.</li>
                <li>Provide a platform for DJs to showcase their talent and upcoming events.</li>
                <li>Offer music enthusiasts the opportunity to discover and enjoy live music events.</li>
                <li>Facilitate song requests and interactions between DJs and users.</li>
            </ul>

            <h2>For DJs</h2>
            <p>If you're a DJ, VibeSync is the perfect platform to showcase your skills and connect with your audience. Here's what you can do:</p>
            <ul>
                <li>Create and manage your upcoming events with venue details and timings.</li>
                <li>Set the minimum payment amount for song requests during your events.</li>
                <li>Accept or reject song requests based on your preferences.</li>
            </ul>

            <h2>For Music Enthusiasts</h2>
            <p>As a music enthusiast and user of VibeSync, you'll have access to a world of music and live events. Here's how you can make the most of our platform:</p>
            <ul>
                <li>Explore and discover upcoming events featuring your favorite DJs.</li>
                <li>Filter and find live events near you, sorted by venue proximity.</li>
                <li>Request songs during events and pay the DJ's set amount or more as you please.</li>
                <li>Enjoy a seamless music experience and engage with DJs in real-time.</li>
            </ul>

            <p>Join us on VibeSync and become a part of our thriving music community. Whether you're a DJ or a music lover, we're here to amplify your passion for music and connect you with like-minded individuals.</p>

            <p>Thank you for choosing VibeSync as your music destination. Let's create memorable music moments together!</p>
        </div>
    );
}

export default AboutUs;
