import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import vibeSyncLogo from '../Resources/VB_Logo_2.png'; // Import your logo image

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  function handleRequestsClick(){
    navigate('/songhistory');
  }
  function handleLogoutClick(){
    localStorage.removeItem('userId');
    navigate('/');
  }
  function handleHomeClick(){
    if(localStorage.getItem('userId')!=null){
      if(localStorage.getItem('isUser') == 'true'){
        return '/userhome';
      }
      else{
        return '/djhome';
      }
    }
    else{
      return '/';
    }
  }
  const linkDecider = handleHomeClick();
  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <a href={linkDecider} className='navbar-logo'>
          <img className='app-logo' src={vibeSyncLogo} alt="VibeSync Logo" />{/* Display your logo image */}
        </a>

        <div className="ml-auto"> {/* Use ml-auto to push the buttons to the right */}
          {(location.pathname === '/userhome' 
            || location.pathname.startsWith('/SongSearch') 
            || location.pathname.startsWith('/paymentIndex')) && (
            <button className='btnNav btn--outlineNav btn-sm' onClick={(e) => handleRequestsClick()}>Your Requests</button>
          )}

          {localStorage.getItem('userId') != null && (
            <button className='btnNav btn--outlineNav  btn-sm' style={{ marginLeft: '5px' }} onClick={(e) => handleLogoutClick()}>Logout</button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
