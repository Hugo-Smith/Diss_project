import React, { useState, useEffect } from 'react';
import axios from 'axios';
import checkStaffAuth from '../checkStaffAuth';
import StaffHomeButton from '../components/StaffHomeButton';

const StaffRegistration = () => {

    // Initial form values
    const initialValues = {
        first_name: '',
        surname: '',
        email: '',
        password: '',
        confirm_password: '',
        is_active: false
    };

    // State variables
    const [formValues, setFormValues] = useState(initialValues); // stores the form values
    const [formErrors, setFormErrors] = useState({}); // Stores the form field for the validation errors
    const [isSubmitted, setIsSubmitted] = useState(false); // Tracks if form has been submitted
    const [response, setResponse] = useState({ success: false });
    const [feedback, setFeedback] = useState(''); 
    const [status, setStatus] = useState('');
    const [isChecked, setIsChecked] =useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('')

    
    useEffect(() => {
        const checkAuth = async () => {
            const response = await checkStaffAuth();
            setUser(response.user);
            setToken(response.token);
        };

        checkAuth();
    }, []);
    

    // Form validation function
    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.first_name) {
            errors.first_name = 'Firstname is required!';
        }

        if (!values.surname) {
            errors.surname = 'Surname is required!';
        }

        if (!values.email) {
            errors.email = 'Email is required!';
        } else if (!regex.test(values.email)) {
            errors.email = 'This is not a valid email format!';
        }

        if (!values.password) {
            errors.password = 'Password is required!';
        }

        if (!values.confirm_password) {
            errors.confirm_password = 'Password confirmation is required!';
        }

        if (values.password && values.confirm_password && values.password !== values.confirm_password) {
            errors.confirm_password = 'Passwords do not match!';
        }

        return errors;
    };

    // Form input handler
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const onCheckHandler = (e) => {
        const new_checked_state = !isChecked
        setIsChecked(!isChecked)
        console.log(new_checked_state)
        const { name } = e.target;
        setFormValues({ ...formValues, [name]: new_checked_state})
    }

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
                const response = await axios.post('http://localhost:5000/api/v1/staff-signup', formValues, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                setResponse(response.data);

                if (response.data.success) {
                    setFeedback('You have successfully signed up!');
                    setStatus('success');
                } else {
                    setFeedback('An error occurred: ' + response.data.error);
                    setStatus('error');
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    console.log('409 received');
                    setFeedback('Email already exists.');
                    setStatus('error');
                } else {
                    console.log(error);
                    setFeedback('An unexpected error occurred. Please try again later.');
                    setStatus('error');
                }
    
            }

            setIsSubmitted(true);
        } else {
            setFeedback('Please correct the errors in the form.');
        }

    };
    
    if (!user) {
        return <div>You are not authorised to view this page.</div>
    }
    
    // Render the component
    return (
        <>
            <div className="section">
                
                <div className="form-container">
                    <h1>Staff Registration</h1>

                    <div className="feedback">

                        <form onSubmit={handleSubmit}>

                            <div className="input-container">
                                <label htmlFor="first_name">First Name</label>

                                <input
                                    id="first_name"
                                    type="text"
                                    name="first_name"
                                    value={formValues.first_name}
                                    onChange={onChangeHandler}
                                />

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.first_name}
                                </p>
                            </div>

                            <div className="input-container">
                                <label htmlFor="surname">Surname</label>

                                <input
                                    id="surname"
                                    type="text"
                                    name="surname"
                                    value={formValues.surname}
                                    onChange={onChangeHandler}
                                />

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.surname}
                                </p>
                            </div>

                            <div className="input-container">
                                <label htmlFor="email">Email </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formValues.email}
                                    onChange={onChangeHandler}
                                />

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.email}
                                </p>
                            </div>

                            <div className="input-container">
                                <label htmlFor="password">Password</label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formValues.password}
                                    onChange={onChangeHandler}
                                />

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.password}
                                </p>
                            </div>

                            <div className="input-container">
                                <label htmlFor="confirm_password">Confirm Password</label>

                                <input
                                    id="confirm_password"
                                    type="password"
                                    name="confirm_password"
                                    value={formValues.confirm_password}
                                    onChange={onChangeHandler}
                                />

                                <p style={{ color: 'red', fontWeight: 'bold' }}>
                                    {formErrors.confirm_password}
                                </p>
                            </div>

                            <div>
                                <label htmlFor='is_active'>Active?</label>

                                <input
                                    id='is_active'
                                    type='checkbox'
                                    name='is_active'
                                    checked={isChecked}
                                    onClick={onCheckHandler}/>
                            </div>

                            <div className="btn-section">
                                <button className='menu-button'>Join Now</button>
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

export default StaffRegistration;