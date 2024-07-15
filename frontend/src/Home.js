import React from "react";
import {useNavigate} from 'react-router-dom';

import {staff} from './PracticeJS/Staff';
import StaffList from './StaffList';

function Home(){
    const navigate = useNavigate();

    const navigateToBooking = () => {
        navigate('/booking');
    };

    return(
        <div>
            <div>
                <h1>Home Page</h1>
                <button onClick={navigateToBooking}>Make a Booking!</button>
            </div>
            <div>
                <ul>
                {staff.map((member, i) => (
                <li key={i}><StaffList staffObject={member}/>
                </li>
                ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;

