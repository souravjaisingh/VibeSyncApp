import React from 'react';
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

function App() {
    return (
        <>
            <Navbar />
                <Routes>
                    <Route path='/' exact element={<Home />} />
                    <Route path='/userhome' element={<UserHome/>} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/sign-up/:isUser' element={<SignUp/>} />
                    <Route path='/loginForm' element={<Login/>} />
                    <Route path="/SongSearch" element={<SongSearch />} />
                    <Route path="/paymentIndex" element={<PaymentIndex />} />
                    <Route path="/songhistory" element={<SongHistory />} />
                    <Route path="/razorpayment" element={<RazorpayPayment />} />
                    <Route path="/djhome" element={<DjHome />} />
                    <Route path="/addevent" element={<AddEvent />} />
                    <Route path="/djprofile" element={<DjProfile />} />
                </Routes>
            <Footer />
        </>
    );
}

export default App;
