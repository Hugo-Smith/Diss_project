import { useState } from "react";
import axios from "axios";

const TreatmentEditor = ( props ) => {
    const initialValues = {
        'treatment_id': props.treatment_id, 
        'title': '',
        'description': '',
        'price': '', 
        'is_available': false
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState('') // Initialize with a string
    const [response, setResponse] = useState(null)

    const accessToken = localStorage.getItem('accessToken')

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        if (name === 'is_available') {
            setFormValues({ ...formValues, [name]: value === 'yes' ? true : false })
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send form data to the server
        try {
            console.log(formValues)
            const response = await axios.put(`http://localhost:5000/api/v1/treatments/${props.treatment_id}`, formValues, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setResponse(response.data);

            if (response.data.success) {
                setFeedback('Edits successful');
                setStatus('success');
            } else {
                setFeedback('An error occurred: ' + response.data.error);
                setStatus('error');
            }
        } catch (error) {
            console.log(error);
            setFeedback('An unexpected error occurred. Please try again later.');
            setStatus('error');
        }

    };

    return (
        <div className="section">
            <div className="form-container">
                <h1>Edit Treatment Details</h1>

                <div className="feedback">
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formValues.title}
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formValues.description}
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="price">Price </label>
                            <input
                                id="price"
                                type="number"
                                step={0.01}
                                name="price"
                                value={formValues.price}
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="is_available">Available for customers?</label>
                            <select
                                id="is_available"
                                name="is_available"
                                value={formValues.is_available ? 'yes' : 'no'}
                                onChange={onChangeHandler}
                            >
                                <option value={'yes'}>Yes</option>
                                <option value={'no'}>No</option>
                            </select>
                        </div>

                        <div className="btn-section">
                            <button>Confirm Changes</button>
                        </div>

                        {feedback && (
                            <div className={`feedback ${status}`}>{feedback}</div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TreatmentEditor;
