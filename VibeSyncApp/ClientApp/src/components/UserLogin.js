import React, { useState } from 'react';
import './UserLogin.css';
import { Link } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import Switch from './LoginToggleButton';

function Cards() {
  const [isUser, setIsUser] = useState(true);

  return (
    <div className={`cards ${isUser ? 'isUserBackground' : ''}`}>
      <div className='cards__container'>
        <h4 style={{fontFamily:'sans-serif'}}>Aap ka Gaana</h4>
        <h3 style={{fontFamily:'sans-serif'}}>Aap ki Vibe!</h3>
        <br></br>
        <Switch
          isOn={!isUser}
          onColor="#f58da6"
          handleToggle={() => setIsUser(!isUser)}
        />
        <p style={{fontFamily:'sans-serif'}}><i>Toggle if you are a DJ</i></p>
        <br></br>
        <GoogleLogin isUser={isUser} />
        <Link to='/loginForm' className='btn-mobile'>
          <button className='btn btn--outline btn--medium'>
            Login with Email
          </button>
        </Link>
        <p className='signup-label'>
          Don't have an account yet? 
          <Link 
            className='signup-link' 
            to={`/sign-up/${isUser ? 'false' : 'true'}`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Cards;
