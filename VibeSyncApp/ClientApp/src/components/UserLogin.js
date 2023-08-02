import React, { useState, useEffect } from 'react';
import './UserLogin.css';
import { Button } from './Button';
import './Button.css';
import { Link } from 'react-router-dom';
import GoogleLogin, { LoginWithGoogle } from './GoogleLogin';

function Cards() {
  
  return (
    <div className='cards'>
      <div className='cards__container'>
      <h1>Are you here to request a song?</h1>
      <br></br>
      <GoogleLogin/>
      {/* <button buttonStyle='btn--outline'>Login with Email</button> */}
      <Link to='/login' className='btn-mobile'>
      <button className='btn btn--outline btn--medium'>
        Login with Email
      </button>
    </Link>
      <p className='signup-label'>Don't have an account yet? <Link className='signup-link' to='/sign-up'>Sign up</Link></p>

      
        {/* <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-9.jpg'
              text='Explore the hidden waterfall deep inside the Amazon Jungle'
              label='Adventure'
              path='/services'
            />
            <CardItem
              src='images/img-2.jpg'
              text='Travel through the Islands of Bali in a Private Cruise'
              label='Luxury'
              path='/services'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='Set Sail in the Atlantic Ocean visiting Uncharted Waters'
              label='Mystery'
              path='/services'
            />
            <CardItem
              src='images/img-4.jpg'
              text='Experience Football on Top of the Himilayan Mountains'
              label='Adventure'
              path='/products'
            />
            <CardItem
              src='images/img-8.jpg'
              text='Ride through the Sahara Desert on a guided camel tour'
              label='Adrenaline'
              path='/sign-up'
            />
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default Cards;
