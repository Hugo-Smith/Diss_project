import axios from "axios";

const API_URL = 'http://localhost:5000/api/v1/customer-details';

const handleErrors = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error('API Error: ', error.response.status, error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('API Error: No response was received', error.request);
    } else {
        console.error('API Error:', error.message);
    }
    throw error;
};

// Function to set headers with Content-Type: application/json
const setHeaders = () => {
    axios.defaults.headers.common['Content-Type'] = 'application/json';
};

// Function to get details
export const getDetails = async (accessToken) => {
    try {
        setHeaders();
        const response = await axios.get(`${API_URL}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};
