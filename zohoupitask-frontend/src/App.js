import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPages from './components/UpiId/Mainpages';
import SignIn from './components/Signin/SignIn';
import SignUp from './components/Signup/SignUp';
import WelcomePage from './components/WelcomePages/WelcomePage';
import './App.css'; // Import your CSS file


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/main" element={<MainPages />} />
        <Route path="/welcome" element={<WelcomePage />} />

        <Route path="/SignUp" element={<SignUp/>} />
      </Routes>
    </Router>
  );
}

export default App;
