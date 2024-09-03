import { useState, useEffect } from "react";
import { getAllTreatments } from "../API/AllTreatmentsAPI";
import StaffHomeButton from "../components/StaffHomeButton";
import TreatmentEditor from "../components/TreatmentEditor";
import ConfirmDeleteTreatment from "../components/DeleteTreatmentButton";


const EditTreatments = () => {

    
    const [treatments, setTreatments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch treatment data
            const treatmentData = await getAllTreatments();
            setTreatments(treatmentData.treatments);

            setIsLoading(false);

        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTreatmentSelect = (treatment) => {
        // Deselects treatment if same button is clicked
        const newSelectedTreatment = selectedTreatment?.treatment_id === treatment.treatment_id ? null : treatment;
        setSelectedTreatment(newSelectedTreatment);
        //passes input to parent
        
    };

    return (
        <div className="container">
            <div className='treatment-list'>
                <h1>Treatments</h1>
                <ul>
                    {treatments.map(treatment => (
                        <li 
                            key={treatment.treatment_id} 
                            onClick={() => handleTreatmentSelect(treatment)}
                            style={{ 
                                backgroundColor: selectedTreatment && selectedTreatment.treatment_id === treatment.treatment_id ? 'lightblue' : 'white',
                                cursor: 'pointer',
                                padding: '10px',
                                margin: '5px 0',
                                border: '1px solid #ccc',
                                listStyleType: 'none'
                            }}
                        >
                            <div>
                                <p>Title: {treatment.title}</p> 
                                <p>Price: £{treatment.price}</p>
                                <p>Description: {treatment.description}</p>
                                <p>Available?: {treatment.is_available? 'Yes': 'No'}</p>                          
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {selectedTreatment? <TreatmentEditor treatment_id={selectedTreatment.treatment_id}/> : null}
                {selectedTreatment? <ConfirmDeleteTreatment treatment_id={selectedTreatment.treatment_id}/>: null}
            </div>
            <StaffHomeButton />
        </div>
    );
};

export default EditTreatments