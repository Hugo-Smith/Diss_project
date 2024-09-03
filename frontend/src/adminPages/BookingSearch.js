import { useState } from "react";
import { getBookings } from "../API/BookingSearchAPI";
import StaffHomeButton from "../components/StaffHomeButton";

const BookingSearch = () => {
    const [date, setDate] = useState("");
    const [bookings, setBookings] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {

        setIsLoading(true);
        try {
            const bookingData = await getBookings(date);
            setBookings(bookingData.bookings);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        fetchData();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='container'>
            <h2>Bookings</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <button type="submit">Search</button>
            </form>
            {bookings && bookings.length > 0 ? (
                <table className='booking-table'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Treatment</th>
                            <th>Staff</th>
                            <th>Customer</th>
                            <th>Note</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking.date}</td>
                                <td>{booking.treatment}</td>
                                <td>{booking.s_first_name} {booking.surname}</td>
                                <td>{booking.c_first_name}</td>
                                <td>{booking.note}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No bookings available.</p>
            )}
            <StaffHomeButton />
        </div>
    );
};

export default BookingSearch;
