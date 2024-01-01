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
