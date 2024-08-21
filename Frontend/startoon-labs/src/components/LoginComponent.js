import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../hooks/authContext";
import { API_URL } from "./env";
import logo from "../images/startoon_logo.png";
import { IonIcon } from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Invalid Email or Password. Try Again");
        return;
      }

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });
        setError("");
        navigate("/");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else if (err.request) {
        setError("An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container-fluid">
      <section className="row">
        {!isMobile && (
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
            <img src={logo} alt="Startoon Logo" />
          </div>
        )}
        <div className="vh-100 col-12 col-md-6 d-flex justify-content-center align-items-center">
          <div className="shadow p-5 rounded-3 w-75 w-md-50">
            <div className='text-left'>
              <h4 className="mb-4">Sign In</h4>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control mb-4 rounded-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mb-3 rounded-2"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon position-absolute top-50 end-0 translate-middle-y px-2 pt-1"
                  onClick={togglePasswordVisibility}
                  style={{ color: 'grey', cursor: 'pointer' }}
                >
                   <IonIcon icon={showPassword ? eyeOutline : eyeOffOutline} />
                </span>
              </div>
              <div>
                {error ? (
                  <p className="text-danger">
                    {error}
                  </p>
                ) : null}
              </div>
              <div className="row">
                <div className="col-6">
                  <button className='btn btn-success w-75 rounded-2 text-black p-1' onClick={submitHandler}>SIGN IN</button>
                </div>
                <div className="col-6">
                <Link to="/signup" className='link'> <button className='btn btn-danger rounded-2 w-75 text-black p-1' >SIGN UP</button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
