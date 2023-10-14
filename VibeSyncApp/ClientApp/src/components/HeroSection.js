import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      {/* <video src='/videos/video-2.mp4' autoPlay loop muted /> */}
      <h1>Just tell us the song, we'll play</h1>
      <p>What are you waiting for?</p>
    </div>
  );
}

export default HeroSection;
