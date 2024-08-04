import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Booking from './pages/AddBooking';
import LogIn from './pages/LogIn';
import Menu from './pages/Menu';
import CustomerRegistration from './pages/CustomerRegistration';
import AddTreatment from './adminPages/AddTreatment';
import Test from './pages/test';
import ViewAccountDetails from './pages/ViewAccountDetails';
import StaffLogin from './adminPages/StaffLogin';
import StaffRegistration from './adminPages/StaffRegistration';
import StaffHome from './adminPages/StaffHome';
import CustomerSearch from './adminPages/CustomerSearch';
import EditTreatments from './adminPages/EditTreatment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/create-account' element={ <CustomerRegistration />} />
        <Route path='/add-treatment' element={ <AddTreatment />} />
        <Route path='/test' element={ <Test />} />
        <Route path='/account-details' element={ <ViewAccountDetails />} />
        <Route path='/staff-login' element={ <StaffLogin />} />
        <Route path='/staff-signup' element={ <StaffRegistration />} />
        <Route path='/staff-home' element={ <StaffHome />} />
        <Route path='/customer-search' element={ <CustomerSearch />} />
        <Route path='/edit-treatment' element={ <EditTreatments />} />
      </Routes>
    </Router>
  );
}

export default App;

