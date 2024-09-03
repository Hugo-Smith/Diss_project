import axios from "axios";


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

    // Function to get bookings
export const getBookings = async (date) => {
    try {
        setHeaders();

        const response = await axios.get(`http://localhost:5000/api/v1/bookings/${date}`);
        return response.data;
    } catch (error) {
        handleErrors(error);
    }
};