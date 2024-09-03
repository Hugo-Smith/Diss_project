import React from "react";
import {useNavigate} from 'react-router-dom';

import '../App.css';
import {staff} from '../PracticeJS/Staff';
import StaffList from '../components/StaffList';
import AvailableTreatments from "../components/AvailableTreaments";
import NavBar from '../components/NavBar';
import shopImage from '../PracticeJS/barbershop.jpg'

function Home(){
    const navigate = useNavigate();

    const navigateToBooking = () => {
        navigate('/booking');
    };

    return(
        <div>
            <NavBar />
            <div className="container">
                <div>
                    <h1>Home Page</h1>
                </div>
                <div>
                    <img className='shopImage' src={shopImage} alt='shop'/>
                    <button className="homepage-booking-button" onClick={navigateToBooking}>Make a Booking!</button>
                </div>
                <div>
                    <h2 className="staffTitle">Meet our staff!</h2>
                    <ul className="staffGrid">
                    {staff.map((member, i) => (
                    <li key={i}><StaffList staffObject={member}/>
                    </li>
                    ))}
                    </ul>
                </div>
            </div>
           
        </div>
    );
}

export default Home;

