import React, {useState, useEffect } from 'react';
import axios from 'axios';

const CustomerRegistration = () => {
    //Initial form values
    const initialValues = {
        first_name : '',
        surname : '',
        email : '',
        password : '',
        birth_date : '',
    };

    //State variables
    const [formValues, setFormValues] = useState(initialValues) ; //stores the form values
    const [formErrors, setFormErrors] = useState({}); //Stores the form field for the valiudation errors
    const [isSubmitted, setIsSubmitted] = useState(false); //Tracks if form has been submitted
    const [response, setResponse] = useState({ success: false});
    const [feedback, setFeedback] = useState(''); //might need to remove
    const [status, setStatus] = useState('');
     
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

        if (!values.birth_date) {
            errors.birth_date = 'Date of birth is required!';
        }

        return errors;
    };

    //form input handler
    const onChangeHandler = (e) => {
        const {name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    //form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));

        //send form data to the server
        try {
            const response = await axios.post('/api/v1/customer-signup', formValues);
            setResponse(response.data);

            if (response.data.success) {
                setFeedback('You have successfully signed up!');
                setStatus('success');
            } else {
                setFeedback('An error occurred: ' + response.data.error);
                setStatus('error');
            }
        } catch (error) {
            console.log(error);
        }

        setIsSubmitted(true);
    };

    //send form data to the server when formValues change
    useEffect(() => {
        sendEventData();
    }, [formValues]);

    // function to send form data to the server
    async function sendEventData() {
        try {
            const response = await axios.post('/api/v1/customer-signup', formValues);
            setResponse(response.data);
        } catch (error) {
            console.log(error);
        }
    };

     // Render the component
  return (
    <>
      <div className="section">
        <div className="form-container">
          <h1>Customer Sign-up</h1>


          <div className="feedback">

            <form onSubmit={handleSubmit}>

                <div className="input-container">
                    <label htmlFor="firstname">First Name</label>

                    <input
                    id="firstname"
                    type="text"
                    name="firstname"
                    value={formValues.firstname}
                    onChange={onChangeHandler}

                    />

                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                    {formErrors.firstname}
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
                    {formErrors.lastname}
                    </p>
                </div>

                <div id="input-container">
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

                <div id="input-container">
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
                    <label htmlFor="birth_date">Birth Date</label>

                    <input
                    id="birth_date"
                    type="text"
                    name="birth_date"
                    value={formValues.birth_date}
                    onChange={onChangeHandler}
                    />
                </div>

                <div id="btn-section">    
                    <button>Join Now</button>
                </div>

                {feedback && (
                    <div className={`feedback ${status}`}>{feedback}</div>
                )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomerRegistration;