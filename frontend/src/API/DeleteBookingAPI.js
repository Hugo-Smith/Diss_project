import axios from "axios";

export const deleteBooking = async (booking_id, accessToken) => {
    
    try {

        const response = await axios.get(`http://localhost:5000/api/v1/booking/${booking_id}`);
        const booking = response.data;

        if (!booking) {
        throw new Error("Booking not found");
        }

        await axios.delete(`http://localhost:5000/api/v1/delete-booking/${booking_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return booking;

    } catch (err) {
        if (err.response) {
            const { status, data } = err.response;
            throw new Error(`${status}: ${data.error}`);
    } else if (err.request) {
    throw new Error('Error: No response received from server');
    } else {
    throw new Error(err.message);
    }
    }
};