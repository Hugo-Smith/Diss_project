import axios from "axios";

const checkStaffAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if(!accessToken){
        console.error('No verification token');
        return false;
    }

    try {
        const response = await axios.post('http://localhost:5000/api/v1/verify-staff-token', {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return response.data.user;

    } catch (error) {
        console.error('Token verification failed', error);
        return false;
    }
};

export default checkStaffAuth;