import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/video-2.mp4' autoPlay loop muted />
      <h1>Just tell us the song, we'll play</h1>
      <p>What are you waiting for?</p>
      {/* <p className='user-label'>Are you a User?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          {/* WATCH TRAILER <i className='far fa-play-circle' /> 
        </Button>
      </div>
      <p className='user-label'>Are you a DJ?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          {/* WATCH TRAILER <i className='far fa-play-circle' /> 
        </Button>
      </div> */}
    </div>
  );
}

export default HeroSection;
