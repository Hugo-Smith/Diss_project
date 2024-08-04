import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import NavBar from "../components/NavBar";
import checkUserAuth from "../checkUserAuth";


function Menu(){
    const navigate = useNavigate();
    
    const[user, setUser] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const response = await checkUserAuth()
            setUser(response);
        };

        checkAuth();
    }, []);

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
        navigate('/create-account');
    };
    const navigateToHome = () => {
        navigate('/');
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
                {!user && (
                    <li><button onClick={navigateToCreateAccount} className="menuButton">Create Account</button></li>
                )}
                <li><button onClick={navigateToHome} className="menuButton">Home</button></li>
            </ul>
        </div>
    ); //The create account button needs to be hidden  if userstate isn't logged in.
}

export default Menu;