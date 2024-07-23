import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar(){
    const navigate = useNavigate();

    const navigateToLogIn = () => {
        navigate('/logIn');
    };
    const navigateToMenu = () => {
        navigate('/menu');
    };

    return(
        <div className='navBar'>
            <button onClick={navigateToMenu}
            className='navButton' >Menu</button>
            <button onClick={navigateToLogIn} 
            className='navButton'>Sign In</button>
        </div>
    );
}

export default NavBar;
