import React, { createContext, useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import UserHome from './components/pages/UserHome';
import LoginUser from './components/LoginForm';
import Login from './components/pages/Login';
import Footer from './components/Footer';
import SongSearch from './components/SongSearch';
import PaymentIndex from './components/PaymentIndex';
import SongHistory from './components/SongHistory';
import RazorpayPayment from './components/RazorpayPayment';
import DjHome from './components/pages/DjHome';
import AddEvent from './components/AddEvent';
import DjProfile from './components/DjProfile';
import DjLiveSongs from './components/DjLiveSongs';
import TransactionHistory from './components/TransactionHistory';
import SampleTransactionComponent from './components/CCAvenue2';
import AboutUs from './components/AboutUs';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactUs from './components/ContactUs';
import NavbarComponent from './components/Navbar';
import ErrorPage from './components/ErrorPage';
import QrCodeDirect from './components/QrCodeDirect';

export const MyContext = createContext();

function App() {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const paddingValues = {
        mobileScreen: '50px',
        smallScreen: '55px',  // Adjust this value for smaller screens
        mediumScreen: '60px', // Default value
        largeScreen: '60px', // Adjust this value for larger screens
    };

    // Determine the appropriate padding value based on the screen width
    const getPaddingValue = () => {
        if (window.innerWidth <= 480) {
            return paddingValues.mobileScreen;
        } else if (window.innerWidth <= 768) {
            return paddingValues.smallScreen;
        } else if (window.innerWidth > 1200) {
            return paddingValues.largeScreen;
        }
        return paddingValues.mediumScreen;
    };

    const paddingValue = getPaddingValue();
    return (
        <>
            <NavbarComponent />
            <div style={{ paddingTop: paddingValue }}>
                {/* This padding ensures content does not overlap with the navbar */}
            </div>
            <MyContext.Provider value={{ error, setError, errorMessage, setErrorMessage }}>
                {error && <ErrorPage resetErrorBoundary={() => {setError(null); setErrorMessage(null);} }/>}
            
            {/* <MyErrorBoundary> */}
            {!error &&
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/userhome' element={<UserHome />} />
                <Route path='/products' element={<Products />} />
                <Route path='/sign-up/:isUser' element={<SignUp />} />
                <Route path='/loginForm' element={<Login />} />
                <Route path="/SongSearch" element={<SongSearch />} />
                <Route path="/paymentIndex" element={<PaymentIndex />} />
                <Route path="/songhistory" element={<SongHistory />} />
                <Route path="/razorpayment" element={<RazorpayPayment />} />
                <Route path="/djhome" element={<DjHome />} />
                <Route path="/eventdetails" element={<AddEvent />} />
                <Route path="/djprofile" element={<DjProfile />} />
                <Route path="/djlivesongs" element={<DjLiveSongs />} />
                <Route path="/showtransactions" element={<TransactionHistory />} />
                <Route path="/ccavenue2" element={<SampleTransactionComponent />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/termsofservice" element={<TermsOfService />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/errorPage" element={<ErrorPage />} />
                <Route path="/qropener" element={<QrCodeDirect />} />
                </Routes>}
                </MyContext.Provider>
            <Footer />
        </>
    );
}

export default App;
