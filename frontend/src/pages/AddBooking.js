import React, { useEffect, useState } from 'react';
import axios from 'axios';


import checkUserAuth from '../checkUserAuth';
import AvailableTreatments from '../components/AvailableTreaments';
import AvailableStaff from '../components/AvailableStaff';
import DateTimeSelector from '../components/dateTimeSelector';
import NavBar from '../components/NavBar'
import Popup from '../components/popup';

function AddBooking() {
    const initialValues =  {
        treatment_id : '',
        staff_id : '',
        date : '',
        note : '',
    };

    const accessToken = localStorage.getItem('accessToken');
    
    const [formErrors, setFormErrors] = useState([]);
    const [formValues, setFormValues] = useState(initialValues);
    const [response, setResponse] = useState({ success : false });
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [user, setUser] = useState(null); 
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const response = await checkUserAuth();
            setUser(response);

            if(!response){
              setShowPopup(true);
            }else {
              setShowPopup(false);
            }
        };

        checkAuth();
    }, []);

    const validate = (values) => {
      const errors = {};

      if (!values.staff_id) {
          errors.staff_id = 'Please select a staff member';
      }
      if (!values.date) {
          errors.date = 'Please select a date and time.';
      }

      return errors;
    };

    const onChangeHandler = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };

    const handleDateInput = (value) => {
      setFormValues({ ...formValues, 'date' : value});
    }

    const handleTreatmentInput = (value) => {
      if(value){
        setFormValues({ ...formValues, 'treatment_id' : value.treatment_id});
      }else{
        setFormValues({ ...formValues, 'treatment_id' : null});
      }
    };

    const handleStaffInput = (value) => {
      if(value){
        setFormValues({ ...formValues, 'staff_id' : value.staff_id});
      }else {
        setFormValues({ ...formValues, 'staff_id' : null});
      }
    }

    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormErrors(validate(formValues));

      if (isEmpty(formErrors)) {

        try {
          const response = await axios.post('http://localhost:5000/api/v1/add-booking', formValues, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          setResponse(response.data);

          if (response.data.success) {
            setFeedback('You have successfully made a booking!');
            setStatus('success');
          } else {
            setFeedback('An error occured: ' + response.data.error);
            setStatus('error');
          }
        } catch (error) {
          if (error.response && error.response.status === 401){
            setFeedback(error.response.message);
            setStatus('error')
          } else if (error.response && error.response.status === 409) {
            setFeedback('A booking already exists with that staff at that time, please reselect');
            setStatus('error');
          } else {
            console.log(error);
            setFeedback('an unexpected error occured. Please try again later.');
            setStatus('error')
          }
        }

        setIsSubmitted(true);

      } else {
        setFeedback('Please correct the errors in the form.')
      }
    };
    
    return (
      <div className='container'>
        <NavBar />
        <h1>Make a Booking!</h1>
  
        <form onSubmit={handleSubmit}>
          <div className='main-content'>
            <div className='calendar'>
              <h2>Select a date and time</h2>
              <DateTimeSelector handleDateInput={handleDateInput} />
              <p style={{ color: 'red', fontWeight: 'bold' }}>
                {formErrors.date}
              </p>
            </div>
            
            <div className='right-section'>
              <div className='sub-container'>
                <AvailableStaff handleStaffInput={handleStaffInput} />
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                  {formErrors.staff_id}
                </p>
              </div>
              <div className='sub-container'>
                <AvailableTreatments handleTreatmentInput={handleTreatmentInput}/>
              </div>
            </div>
          </div>
  
          <div className='note-section'>
            <h2>Additional Notes</h2>
            <textarea
              id="note"
              name="note"
              rows='5'
              cols='30'
              value={formValues.note}
              onChange={onChangeHandler}
            />
          </div>
  
          <div className="btn-section">
            <button className='menu-button'>Confirm Booking</button>
          </div>
  
          {feedback && (
            <div className={`feedback ${status}`}>{feedback}</div>
          )}
        </form>
        
        {showPopup && <Popup />}
      </div>
  );
};



export default AddBooking;
