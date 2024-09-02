import '../node_modules/bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoadingProvider } from './components/LoadingProvider';
import ScrollToTop from './components/ScrollToTop';


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
ReactDOM.render(
    <GoogleOAuthProvider clientId='1079194116900-ne6rek0mtie8c6vflmga1t4bfkc8i1ku.apps.googleusercontent.com'>
        <BrowserRouter basename={baseUrl}>
            <ScrollToTop />
            <LoadingProvider>
                <App />
            </LoadingProvider>
        </BrowserRouter>
    </GoogleOAuthProvider>,
    rootElement);

registerServiceWorker();

