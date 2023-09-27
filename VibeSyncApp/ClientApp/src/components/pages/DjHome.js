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
                    <button className='btn btn--primary btn-medium'>
                        Update Dj Profile
                    </button>
                </Link>
                <Link to='/eventdetails' className='btn-mobile'>
                    <button className='btn btn--primary btn-medium'>
                        Click here to add Event
                    </button>
                </Link>
            </div>

            <DjTabs />
        </div>
    );
}
