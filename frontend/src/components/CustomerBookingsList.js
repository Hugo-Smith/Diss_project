import { useState, useEffect } from "react";
import { getCustomerBookingDetails } from "../API/CustomerBookingsAPI";
import ConfirmDeleteBooking from "./deleteBookingButton";

const CustomerBookingsList = (customer_id) =>{

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);


    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch booking data
            const bookingData = await getCustomerBookingDetails(customer_id);
            setBookings(bookingData.bookings)

            setIsLoading(false);

        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [customer_id]);

    const handleBookingSelection = (booking) => {
        //deselects booking if clicked again
        const newBookingSelection = selectedBooking?.booking_id === booking.booking_id ? null : booking;
        setSelectedBooking(newBookingSelection);
        console.log(newBookingSelection);
    }

    return(
        <div>
            <div>
                <h2>Bookings</h2>
                {bookings && bookings.length > 0 ? (
                    <table className='booking-table'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Treatment</th>
                                <th>Staff</th>
                                <th>Note</th>
                                <th>Delete?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={index}>
                                    <td>{booking.date}</td>
                                    <td>{booking.title}</td>
                                    <td>{booking.first_name} {booking.surname}</td>
                                    <td>{booking.note}</td>
                                    <td>
                                        <input 
                                            onClick={() => handleBookingSelection(booking)}
                                            type='checkbox'>
                                        </input>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No bookings available.</p>
                )}
            </div>
            <div>
                {selectedBooking? <ConfirmDeleteBooking booking={selectedBooking} />
                : ''}
            </div>
        </div>
    )

};

export default CustomerBookingsList;