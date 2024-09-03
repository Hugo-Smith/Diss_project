import { useNavigate } from "react-router-dom";

const StaffHomeButton = () => {
    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/staff-home')
    };

    return(
        <div>
            <button 
            onClick={navigateToHome}
            className="menu-button"
            >Home</button>
        </div>
    )
};

export default StaffHomeButton;