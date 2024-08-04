import React, { useState } from 'react';
import axios from 'axios';
import StaffHomeButton from '../components/StaffHomeButton';

const AddTreatment = () => {
    // Initial form values
    const initialValues = {
        title: '',
        description: '',
        price: 0,
        is_available: false
    };

    const accessToken = localStorage.getItem('accessToken');

    // State variables
    const [formValues, setFormValues] = useState(initialValues); 
    const [formErrors, setFormErrors] = useState({}); 
    const [response, setResponse] = useState({ success: false });
    const [feedback, setFeedback] = useState(''); 
    const [status, setStatus] = useState('');

    // Form validation function
    const validate = (values) => {
        const errors = {};

        if (!values.title) {
            errors.title = 'Title is required!';
        }

        if (!values.description) {
            errors.description = 'Description is required!';
        }

        if (!values.price || isNaN(values.price) || values.price < 0) {
            errors.price = 'Price is required and must be greater than 0';
        }

        if (values.is_available === undefined || values.is_available === null) {
            errors.is_available = 'Availability confirmation is required!';
        }

        return errors;
    };

    // Form input handler
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        if (name==='is_available'){
            setFormValues({...formValues, [name]: value === 'yes' ? true : false})

        } else {

            setFormValues({ ...formValues, [name]: value });
        }
    };

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));

        if (isEmpty(formErrors)) { // if formErrors is empty

            // Send form data to the server
            try {
                console.log(formValues )
                const response = await axios.post('http://localhost:5000/api/v1/add-treatment', formValues, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setResponse(response.data);

                if (response.data.success) {
                    setFeedback('Treatment added!');
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

        } else {
            setFeedback('Please correct the errors in the form.');
        }

    };

    // Render the component
    return (
        <>
            <div className="section">
                <div className="form-container">
                    <h1>Add a Treatment</h1>

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

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.title}
                                </p>
                            </div>

                            <div className="input-container">
                                <label htmlFor="description">Description</label>

                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={formValues.description}
                                    onChange={onChangeHandler}
                                />

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.description}
                                </p>
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

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.price}
                                </p>
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

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.is_available}
                                </p>
                            </div>

                            <div className="btn-section">
                                <button>Add Now</button>
                            </div>

                            {feedback && (
                                <div className={`feedback ${status}`}>{feedback}</div>
                            )}
                        </form>
                    </div>
                </div>
                <StaffHomeButton />
            </div>
        </>
    );
};

export default AddTreatment;