import { useState, useEffect } from "react";
import checkStaffAuth from "../checkStaffAuth";
import { useNavigate } from "react-router-dom";
import Logout from "../components/LogOut";

const StaffHome = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const checkAuth = async () => {
            const response = await checkStaffAuth();
            setUser(response);
        };

        checkAuth();
    }, []);

    const navToCustomerSearch = () => {
        navigate('/customer-search')
    };
    const navToAddTreatment = () => {
        navigate('/add-treatment')
    };
    const navToEditTreatment = () => {
        navigate('/edit-treatment')
    };
    const navToBookingSearch = () => {
        navigate('/booking-search')
    }
    const navToStaffReg = () => {
        navigate('/staff-signup')
    }

    if (!user) {
        return <div>You are not authorised to view this page</div>
    };

    return(
        <div className="container">
            <h1>Admin Home</h1>

            <div className="lower-container">
                <button className="menu-button" onClick={navToCustomerSearch}>Customer Search</button>
                <button className="menu-button" onClick={navToStaffReg}>Staff Registration</button>
                <button className="menu-button" onClick={navToBookingSearch}>View Bookings</button>
                <button className="menu-button" onClick={navToAddTreatment}>Add Treatment</button>
                <button className="menu-button" onClick={navToEditTreatment}>Edit Treatment</button>
            </div>

            <div>
                <Logout />
            </div>
        </div>
    )
};

export default StaffHome;