import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import './Navbar.css';
import vibeSyncLogo from '../Resources/VB_Logo_2.png';
import home from '../Resources/home.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logout } from './services/UserService';
import { MyContext } from '../App';
import { useLoadingContext } from './LoadingProvider';

function NavbarComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setLoading } = useLoadingContext();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const location = useLocation();
  const navigate = useNavigate();

  function handleRequestsClick() {
    navigate('/songhistory');
  }

  async function handleLogoutClick() {
    try{
      setLoading(true);
      const res = await Logout();
      setLoading(false);
      if (res) {
        localStorage.removeItem('userId');
        localStorage.removeItem('jwt');
        navigate('/');
      }

    }
    catch(error){
      setLoading(false);
    }
  }

  function handleHomeClick() {
    if (localStorage.getItem('userId') != null) {
      if (localStorage.getItem('isUser') === 'true') {
        return '/userhome';
      } else {
        return '/djhome';
      }
    } else {
      return '/';
    }
  }

  const linkDecider = handleHomeClick();

  const handleLogoClick = () => {
    navigate(linkDecider); // Navigate to the linkDecider result when logo is clicked
  };

  return (
    <div className="navbar">
      {localStorage.getItem('userId') != null && (
      <div className="home-container">
        <div className="home-img" onClick={handleLogoClick}>
          <img src={home} alt="App Logo" />
        </div>
      </div>
      )}
      <div className="logo-container">
        <div className="logo" onClick={handleLogoClick}>
          <img src={vibeSyncLogo} alt="App Logo" />
        </div>
      </div>
      {localStorage.getItem('userId') != null && (
        <div className="menu-icon" onClick={handleMenuToggle}>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        </div>
      )}
      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        {(location.pathname === '/userhome' ||
          location.pathname.startsWith('/SongSearch') ||
          location.pathname.startsWith('/paymentIndex')) && (
            <Button
              className="btn-navigation-bar"
              onClick={(e) => handleRequestsClick()}>
              Your Requests
            </Button>
          )}
        {localStorage.getItem('userId') != null && (
          <Button
            className="btn-navigation-bar"
            onClick={(e) => handleLogoutClick()}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}

export default NavbarComponent;
