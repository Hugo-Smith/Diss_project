import { useEffect, useState } from 'react';
import { getDetails } from '../API/CustomerDetailsAPI';
import NavBar from '../components/NavBar';
import '../styleSheets/accountDetails.css';
import ConfirmDeleteBooking from '../components/deleteBookingButton';


function ViewAccountDetails() {

    const accessToken = localStorage.getItem('accessToken');

    const [customerDetails, setCustomerDetails] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchData = async () => {
        try {
            const customerData = await getDetails(accessToken);
            setCustomerDetails(customerData.customer);
            setBookings(customerData.bookings);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    };

    if (error) {
        return <div>Error: {error}</div>;
    };

    const handleBookingSelection = (booking) => {
        //deselects booking if clicked again
        const newBookingSelection = selectedBooking?.booking_id === booking.booking_id ? null : booking;
        setSelectedBooking(newBookingSelection);
        console.log(newBookingSelection);
    }

    return (
        <div>
            <NavBar />
            <div>
                <h1>Account Details</h1>
                {customerDetails ? (
                    <div className='account-details'>
                        <p><strong>First Name:</strong> {customerDetails.first_name}</p>
                        <p><strong>Surname:</strong> {customerDetails.surname}</p>
                        <p><strong>Email:</strong> {customerDetails.email}</p>
                    </div>
                ) : (
                    <p>No customer details available.</p>
                )}
            </div>
            <div className='container'>
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
    );
}



export default ViewAccountDetails;
