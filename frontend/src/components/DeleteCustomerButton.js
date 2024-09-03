import { deleteCustomer } from "../API/DeleteCustomerAPI.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmDeleteCustomer = (props) => {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate()

    const handleDelete = async () => {
        
        try{
            setIsLoading(true);
            await deleteCustomer(props.user, props.access_token);
            setIsLoading(false);
            localStorage.removeItem('accessToken');
            navigate('/')


        } catch (err) {
            setIsLoading(false);
            setError('Failed to delete customer');
            console.log(err.message)
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
            <p>Are you sure you want to delete your account?</p>
            <button
                className='menu-button'
                onClick={handleDelete}
                disabled={isLoading}>
                    {isLoading ? 'Deleting account...' : 'Delete account'}
            </button>
        </div>
    );
};

export default ConfirmDeleteCustomer;