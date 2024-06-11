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
    function handleAcceptedRequestsClick() {
        navigate('/acceptedRequests');
    }
    function handlePlaylistsClick() {
        navigate('/playlists');
    }

    async function handleLogoutClick() {
        try {
            setLoading(true);
            if (localStorage.getItem('userId') != 0) {
                const res = await Logout();
                setLoading(false);
                if (res) {
                    navigate('/');
                }
            }
            else{
                localStorage.clear();
                setLoading(false);
                navigate('/');
            }
        }
        catch (error) {
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
                {(location.pathname.startsWith('/SongSearch') ||
                    location.pathname.startsWith('/songsearch') ||
                    location.pathname.startsWith('/acceptedRequests') ||
                    location.pathname.startsWith('/paymentIndex')) && (
                        <Button
                            className="btn-navigation-bar"
                            onClick={(e) => handleRequestsClick()}>
                            {localStorage.getItem('userId') === '0' ? 'All Requests' : 'Your Requests'}
                        </Button>
                    )}
                {(location.pathname.startsWith('/SongSearch') ||
                    location.pathname.startsWith('/songsearch') ||
                    //location.pathname.startsWith('/songhistory') ||
                    location.pathname.startsWith('/paymentIndex')) && (
                        <Button
                            className="btn-navigation-bar"
                            onClick={(e) => handleAcceptedRequestsClick()}>
                            Accepted Requests
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
            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                {(location.pathname === '/djhome'
                    || location.pathname === '/djprofile'
                    || location.pathname === '/eventdetails'
                    || location.pathname === '/showtransactions'
                    || location.pathname === '/djlivesongs') && (
                        <Button
                            className="btn-navigation-bar"
                            onClick={(e) => handlePlaylistsClick()}>
                            Playlists
                        </Button>
                    )}
                {localStorage.getItem('userId') != null &&
                    localStorage.getItem('isUser') == 'false' && (
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
