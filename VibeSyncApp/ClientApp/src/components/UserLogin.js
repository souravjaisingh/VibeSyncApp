import React, { useState } from 'react';
import './UserLogin.css';
import { Link } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import Switch from './LoginToggleButton';

function Cards() {
  const [isUser, setIsUser] = useState(false);

  return (
    <div className={`cards ${!isUser ? 'isUserBackground' : ''}`}>
      <div className='cards__container'>
        <h4 style={{fontFamily:'sans-serif'}}>Aap ka Gaana</h4>
        <h3 style={{fontFamily:'sans-serif'}}>Aap ki Vibe!</h3>
        <br></br>
        <Switch
          isOn={isUser}
          onColor="#f58da6"
          handleToggle={() => setIsUser(!isUser)}
        />
        <p style={{fontFamily:'sans-serif'}}><i>
        {isUser
            ? "Toggle if you are here to request a song"
            : "Toggle if you are a DJ"}
          </i></p>
        <br></br>
        <GoogleLogin isUser={!isUser} />
        <Link to='/loginForm' className='btn-mobile'>
          <button className='btn btn--outline btn--medium'>
            Login with Email
          </button>
        </Link>
        <p className='signup-label'>
          Don't have an account yet? &nbsp;
          <Link 
            className='signup-link' 
            to={`/sign-up/${isUser ? 'false' : 'true'}`}
          >
            Sign up
          </Link>
          <a href="http://m.p-y.tm/pay?pa=9728868875@ybl&pn=SouravJaiSingh&cu=INR&am=10&url=https://www.wikipedia.org/" class="upi-pay1">Phone pe Rs10</a><br/>
          <a href="phonepe://pay?pa=9728868875@ybl&pn=SouravJaiSingh&cu=INR&am=10&url=https://www.wikipedia.org/" class="upi-pay1">Phone pe Rs10</a><br/>
          <a href="phonepe://pay?pa=9728868875@ybl&pn=JohnDoe&cu=INR&am=5&url=https://www.wikipedia.org/" class="upi-pay1">Phone pe Rs5</a><br/>
          <a href="phonepe://pay?pa=9728868875@ybl&pn=JohnDoe&cu=INR&am=1&url=https://www.wikipedia.org/" class="upi-pay1">Phone pe Rs1</a><br/>
          <a href="tez://upi/pay?pa=souravjaisingh-1@okicici&cu=INR&am=1&url=https://www.wikipedia.org/" class="upi-pay1">Google pay </a>

          <a href="gpay://upi./pay?pa=souravjaisingh-1@okicici&amp;pn=SouravJaiSingh K&amp;cu=INR&amp;am=2" class="upi-pay1">GPAY 2Rs. -NEW</a>  
          <a href="phone://upi/pay?pa=9728868875@ybl&amp;pn=SouravJaiSingh K&amp;cu=INR&amp;am=2" class="upi-pay1">PHONEPE 2Rs.- NEW</a>  
          <a href="paytmmp://upi/pay?pa=9728868875@paytm&amp;pn=SouravJaiSingh K&amp;cu=INR&amp;am=2" class="upi-pay1">PAYTM 2rs. -NEW</a>
        </p>
      </div>
    </div>
  );
}

export default Cards;
