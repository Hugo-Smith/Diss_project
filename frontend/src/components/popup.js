import { useNavigate } from 'react-router-dom';


const Popup = () => {

    const navigate = useNavigate();

    const navigateToLogIn = () => {
        navigate('/login');
    };
    const navigateToMenu = () => {
        navigate('/menu');
    };

    return (
        <div>
            <div className="overlay"></div>
            <div className="popup">
                <h3 style={{color: 'white'}}>You're not logged in, please log in to make a booking</h3>
                <div>
                    <button className='navButton' onClick={navigateToMenu}>Return to menu</button>
                    <button className='navButton' onClick={navigateToLogIn}>Login</button>
                </div>
            </div>
        </div>
      
    );
  };

  export default Popup;