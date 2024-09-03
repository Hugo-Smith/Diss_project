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
                <h3 style={{color: 'white'}}>You're not logged in, please log in to access this content</h3>
                <div className='main-content'>
                    <button className='nav-button' onClick={navigateToMenu}>Return to menu</button>
                    <button className='nav-button' onClick={navigateToLogIn}>Login</button>
                </div>
            </div>
        </div>
      
    );
  };

  export default Popup;