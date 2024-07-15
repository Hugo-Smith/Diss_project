import React from "react";
import {useNavigate} from 'react-router-dom';
import NavBar from "./NavBar";


function Menu(){
    const navigate = useNavigate();

    const navigateToBooking = () => {
        navigate('/booking');
    };
    const navigateToAvailability = () => {
        navigate('/availability');
    };
    const navigateToContact = () => {
        navigate('/contact');
    };
    const navigateToShopLocation = () => {
        navigate('/shopLocation');
    };
    const navigateToCreateAccount = () => {
        navigate('/createAccoutn');
    };

    return(
        <div>
            <NavBar />
            <h1>Menu</h1>
            <ul className="menu">
                <li><button onClick={navigateToBooking} className="menuButton">Make a Booking</button></li>
                <li><button onClick={navigateToAvailability} className="menuButton">See Availabilty</button></li>
                <li><button onClick={navigateToContact} className="menuButton">Contact Us</button></li>
                <li><button onClick={navigateToShopLocation} className="menuButton">Shop Location</button></li>
                <li><button onClick={navigateToCreateAccount} className="menuButton">Create Account</button></li>
            </ul>
        </div>
    ); //The create account button needs to be hidden  if userstate isn't logged in.
}

export default Menu;