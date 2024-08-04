import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate(); 

    const removeToken = async () => {
        try {
            
            const response = await axios.post('http://localhost:5000/api/v1/logout');
            console.log(response); 
            localStorage.removeItem('accessToken');
            navigate('/'); 
            window.location.reload();
        } catch (error) {
            if (error.response) {
                console.log(error.response);
            } else {
                console.log('Error:', error.message);
            }
        }
    }

    return (
        <div>
            <button 
            className='nav-button'
            onClick={removeToken}>
                Logout
            </button>
        </div>
    );
}

export default Logout;
