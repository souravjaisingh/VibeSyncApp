import React from 'react';
import '../../App.css';
import '../Button.css'
import '../pages/DjHome.css';
import { DjTabs } from '../DjTabs';
import { Link } from 'react-router-dom';

export default function DjHome() {
    return (
        <div className='DjHome'>
            <div className='center-button'>
                <Link to='/djprofile' className='btn-mobile left-button'>
                    <button className='toolbar-button'>
                        Update Dj Profile
                    </button>
                </Link>
                <Link to='/eventdetails' className='btn-mobile'>
                    <button className='toolbar-button'>
                        Click here to add Event
                    </button>
                </Link>
                <Link to='/showtransactions' className='btn-mobile right-button'>
                    <button className='toolbar-button'>
                        Show Transactions
                    </button>
                </Link>
            </div>

            <DjTabs />
        </div>
    );
}
