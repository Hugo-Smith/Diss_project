import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Booking from './pages/Booking';
import LogIn from './pages/LogIn';
import Menu from './pages/Menu';
import CustomerRegistration from './pages/CustomerRegistration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/' element={<Home />} />
        <Route path='/logIn' element={<LogIn />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/createAccount' element={ <CustomerRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
