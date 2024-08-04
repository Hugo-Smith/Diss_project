import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import checkUserAuth from '../checkUserAuth';
import Logout from './LogOut';
import '../styleSheets/navBar.css'

function NavBar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const checkAuth = async () => {
            const response = await checkUserAuth();
            setUser(response);
        };

        checkAuth();
    }, []);

    const navigateToLogIn = () => {
        navigate('/login');
    };
    const navigateToMenu = () => {
        navigate('/menu');
    };

    const navigateToAccount = () => {
        navigate('/account-details');
    };

    // Displays loading indicator while checking authentication status
    if (user === null) {
        return <div className='nav-bar'>Loading...</div>;
    }

    return (
        <div className='nav-bar'>
            <button onClick={navigateToMenu} className='nav-button'>Menu</button>
            {user ? (
                <div className='nav-cluster'>
                    <button onClick={navigateToAccount} className='nav-button'>Account</button>
                    <Logout />
                </div>
            ) : (
                <div>
                    <button onClick={navigateToLogIn} className='nav-button'>Sign In</button>
                </div>
            )}
        </div>
    );
}

export default NavBar;
