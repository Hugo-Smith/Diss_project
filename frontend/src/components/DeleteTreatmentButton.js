import { deleteTreatment } from "../API/DeleteTreatmentAPI";
import { useEffect, useState } from "react";

const ConfirmDeleteTreatment = (props) => {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const accessToken = localStorage.getItem('accessToken')

    const handleDelete = async () => {
        
        try{
            setIsLoading(true);
            await deleteTreatment(props.treatment_id, accessToken);
            setIsLoading(false);
            window.location.reload();


        } catch (err) {
            setIsLoading(false);
            setError('Failed to delete treatment');
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
            <h4>Are you sure you want to delete this treatment?</h4>
            
            <button 
                className='menu-button'
                onClick={handleDelete}
                disabled={isLoading}>
                    {isLoading ? 'Deleting treatment...' : 'Delete Treatment'}
            </button>
        </div>
    );
};

export default ConfirmDeleteTreatment;