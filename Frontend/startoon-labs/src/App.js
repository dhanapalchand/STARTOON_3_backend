import React, { useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authContext } from './hooks/authContext';
import Login from './components/LoginComponent';
import Signup from './components/SignUpComponent';
import NavBar from './components/NavBarComponet';
import Home from './components/HomeComponent';
import Graph from './components/GraphComponent'



import './App.css';

function App() {

  const { user, dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };
  return (
 
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard/home" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard/home" />} />

        {user && (
          <Route path="/dashboard/*" element={<NavBar onLogout={logoutHandler} />}> 
            <Route path="home" element={<Home />} />
            <Route path="graph" element={<Graph />} />
          </Route>
        )}
      </Routes>
  
  );
}

export default App;
