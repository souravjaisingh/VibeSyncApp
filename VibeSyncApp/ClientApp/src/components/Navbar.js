import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './Navbar.css';
import vibeSyncLogo from '../Resources/VSlogo3.png';
import home from '../Resources/home.png';
import backIcon from '../Resources/backnavigate.png';

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

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    function handleRequestsClick() {
        setMenuOpen(false); 
        navigate('/songhistory');
    }
    function handleAcceptedRequestsClick() {
        setMenuOpen(false); 
        navigate('/acceptedRequests');
    }
    function handlePlaylistsClick() {
        setMenuOpen(false); 
        navigate('/playlists');
    }
    function handleSettlementsClick() {
        setMenuOpen(false);
        navigate('/settlements');
    }
    function handleSetlementsHistoryClick() {
        setMenuOpen(false);
        navigate('/settlementshistory');
    }
    useEffect(()=>{
        document.addEventListener('click',function(){
                setMenuOpen(false);
    })
    },[])

    async function handleLogoutClick() {
        try {
            setLoading(true);
            if (localStorage.getItem('userId') != 0) {
                const res = await Logout();
                setLoading(false);
                setMenuOpen(false); 
                if (res) {
                    navigate('/');
                }
            }
            else{
                localStorage.clear();
                setLoading(false);
                setMenuOpen(false);
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
            {location.pathname !== '/' &&
            (!location.pathname.startsWith('/djhome')
            && !location.pathname.startsWith('/userhome')) &&(
                <div className="home-container">
                    <div className="home-img" onClick={()=>navigate(-1)}>
                        <img src={backIcon} alt="App Logo" />
                    </div>
                </div>
            )}
            <div className="logo-container">
                <div className="logo" onClick={handleLogoClick}>
                    <img src={vibeSyncLogo} alt="App Logo" />
                </div>
            </div>
            {location.pathname !== '/' && (
                <div className="menu-icon" onClick={(event)=>{handleMenuToggle();event.stopPropagation();}}>
                    <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
                    <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
                    <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
                </div>
            )}
            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                {(location.pathname.startsWith('/SongSearch') ||
                    location.pathname.startsWith('/songsearch') ||
                    location.pathname.startsWith('/paymentIndex')) && (
                        <Button
                            className="btn-navigation-bar"
                            onClick={(e) => handleRequestsClick()}>
                            {localStorage.getItem('userId') === '0' ? 'All Requests' : 'Your Requests'}
                        </Button>
                    )}
                
                {(localStorage.getItem('userId') == 10077 && (
                    location.pathname.startsWith('/SongSearch') ||
                    location.pathname.startsWith('/songsearch') ||
                    location.pathname.startsWith('/paymentIndex'))) && (
                        <Button
                            className="btn-navigation-bar"
                            onClick={(e) => handleSettlementsClick()}>
                            Settlements
                        </Button>
                )}
                {localStorage.getItem('userId') != null && (
                    <Button
                        className="btn-navigation-bar"
                        onClick={(e) => handleLogoutClick()}
                    >
                        Log Out
                    </Button>
                )}
            </div>
            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                {(location.pathname.startsWith('/djhome') ||
                    location.pathname.startsWith('/djlivesongs') ||
                    location.pathname.startsWith('/showtransactions') ||
                    //location.pathname.startsWith('/paymentIndex')  ||
                    location.pathname.startsWith('/djprofile') ||
                    location.pathname.startsWith('/eventdetails')) && (
                        <Button
                            className="btn-navigation-bar"
                            onClick={(e) => handleSetlementsHistoryClick()}>
                            Settlements
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
