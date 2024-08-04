import axios from "axios";

const API_URL = 'http://localhost:5000/api/v1/available-staff';

const handleErrors = (error) => {
    if (error.response) {
        //The request was made but the server responded witha a status code
        console.error('API Error: ', error.resposne.status, error.response.data);
    } else if (error.request) {
        //The request was made but no response received
        console.error('API Error: No response was received', error.request)
    } else {
        console.error('API Error:', error.message);
    }
    throw error;
};

    // Function to set headers with Content-Type: application/json
const setHeaders = () => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
};

// Function to get treatments
export const getStaff = async () => {
    try {
        setHeaders();
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};