import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

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
  <Link to={linkDecider} className='navbar-logo'>
    VibeSync 
    <i className='fab fa-typo3' />
  </Link>

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



      {/* <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            Request your song 
            <i class='fab fa-typo3' />
          </Link>
          {/* <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div> */}
          {/* <ul className={click ? 'nav-menu active' : 'nav-menu'}> */}
            {/* <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/services'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/products'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li> */}

            {/* <li> 
            
              <Link
                to='/sign-up'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            {/* </li> */}
          {/* </ul> *
          {button && <Button buttonStyle='btn--outline navbar-right'>SIGN UP</Button>}
        </div>
      </nav> */}
    </>
  );
}

export default Navbar;
