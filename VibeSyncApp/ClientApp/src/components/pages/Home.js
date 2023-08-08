import React from 'react';
import '../../App.css';
import Cards from '../UserLogin';
import HeroSection from '../HeroSection';
import Footer from '../Footer';
import DJCards from '../DJLogin';

function Home() {
  return (
    <>
      <HeroSection />
      <Cards />
      {/* <DJCards /> */}
    </>
  );
}

export default Home;
