import { deleteBooking } from "../API/DeleteBookingAPI";
import { useEffect, useState } from "react";

const ConfirmDeleteBooking = (props) => {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const accessToken = localStorage.getItem('accessToken');

    const handleDelete = async () => {
        
        try{
            setIsLoading(true);
            await deleteBooking(props.booking.booking_id, accessToken);
            setIsLoading(false);
            window.location.reload();


        } catch (err) {
            setIsLoading(false);
            setError('Failed to delete booking');
        }
    };

    useEffect(() => {
        return() => {
            //Clears the error when the component dismounts
            setError('');
        };
    }, []);

    return (
        <div>
            {error && <p className="error">{error}</p>}
            <p>Are you sure you want to delete this booking 
                with {props.booking.first_name} on {props.booking.date}?</p>
            <button 
                onClick={handleDelete}
                disabled={isLoading}>
                    {isLoading ? 'Deleting booking...' : 'Delete Booking'}
            </button>
        </div>
    );
};

export default ConfirmDeleteBooking;