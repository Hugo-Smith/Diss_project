import React, { useEffect, useState } from 'react';
import { getTreatments } from '../API/AvailableTreatmentsAPI';


function AvailableTreatments({ handleTreatmentInput }) {
    
    const [treatments, setTreatments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTreatment, setSelectedTreatment] = useState(null);


    const fetchData = async () => {
        try {
            // Fetch treatment data
            const treatmentData = await getTreatments();
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
        handleTreatmentInput(treatment);
    };

    return (
        <div>
            <div className='treatment-list'>
                <h2>Available Treatments</h2>
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
                            <h4>{treatment.title}</h4>
                            {treatment.description}
                            <h4>£{treatment.price}</h4>
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    );
}

export default AvailableTreatments;
