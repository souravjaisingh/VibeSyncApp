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
                <Link to='/djprofile' className='btn-medium left-button'>
                    <button className='toolbar-button'>
                        UPDATE PROFILE
                    </button>
                </Link>
                <Link to='/eventdetails' className='btn-medium'>
                    <button className='toolbar-button'>
                        ADD EVENTS
                    </button>
                </Link>
                <Link to='/showtransactions' className='btn-medium right-button'>
                    <button className='toolbar-button'>
                        SHOW TRANSACTIONS
                    </button>
                </Link>
            </div>

            <DjTabs />
        </div>
    );
}
