import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeButton from '../components/HomeButton';

const StaffLogin = () => {

  const navigate = useNavigate();

  //Initial form values
  const initialValues = {
    email: '',
    password: '',
  }

  const [formValues, setFormValues] = useState(initialValues);
  const [accessToken, setAccessToken] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [response, setResponse] = useState({success : false});
  const [status, setStatus] = useState('');


  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
   
    if(!values.email) {
      errors.email = 'Email is required.';
    } else if (!regex.test(values.email)) {
      errors.email = 'This is not a valid email format.';
    }

    if (!values.password){
      errors.password = 'Password is required.';
    }

    return errors;
  }

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    if(isEmpty(formErrors)){

      try {
        const response = await axios.post('http://localhost:5000/api/v1/staff-login', formValues);
        setResponse(response.data)

        if(response.data.success){
          setFeedback('You have succesfully logged in!');
          setAccessToken(response.data.access_token);
          navigate('/staff-home');
          localStorage.setItem('accessToken', response.data.access_token);
          setStatus('success'); 
        } else {
          setFeedback('An error occurred: ' + response.data.error);
          setStatus('error');
        }

      } catch(error) {
        if (error.response && error.response.status === 401) {
          console.log('401 received');

          setFeedback(error.response.data.message);
          setStatus('error');
          } else {
          console.log(error);
          setFeedback('An unexpected error occurred. Please try again later.');
          setStatus('error');
          }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value,});
  }

  return(
    <>
      <div className='section'>
        <div className='form-container'>
          <h1>Staff Login</h1>
          <form onSubmit={handleSubmit}>

            <div className='input-container'>
              <label htmlFor='email'>Email</label>

              <input
                id='email'
                type='email'
                name='email'
                value={formValues.email}
                onChange={handleChange}
                />

                <p style={{color: 'red', fontWeight: 'bold'}}> 
                  {formErrors.email}
                </p>
            </div>

            <div className='input-container'>
              <label htmlFor='password'>Password</label>

              <input 
              id='password'
              type='password'
              name='password'
              value={formValues.password}
              onChange={handleChange}
              />

              <p style={{color: 'red', fontWeight: 'bold'}}> 
                  {formErrors.password}
              </p>
            </div>

            <div className='button-section'>
              <button type='submit'>Login</button>
            </div>
            
            {feedback && (
              <div className={`feedback ${status}`}>{feedback}</div>
            )}

          </form>
        </div>
        <HomeButton />
      </div>  
    </>
  )
}
export default StaffLogin;