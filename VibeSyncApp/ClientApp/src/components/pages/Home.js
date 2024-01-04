import React, { useEffect } from 'react';
import '../../App.css';
import Cards from '../UserLogin';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const jwt = localStorage.getItem('jwt');
    const isUser = localStorage.getItem('isUser');
    const expiry = localStorage.getItem('expiry');

    // Check if 'expiry' exists and if the current datetime is greater than or equal to 'expiry'
    if (expiry) {
      const currentDatetime = new Date();
      const expiryDatetime = new Date(expiry);

      if (currentDatetime >= expiryDatetime) {
        // Remove everything from localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('jwt');
        localStorage.removeItem('expiry');
        navigate('/');
        return;
      }
    }

    if (userId && jwt && isUser === 'true') {
      navigate('/userhome');
    } else if (userId && jwt && isUser === 'false') {
      navigate('/djhome');
    }
  }, [navigate]);
  return (
    <>
      {/* <HeroSection /> */}
      <Cards />
      {/* <DJCards /> */}
    </>
  );
}

export default Home;
