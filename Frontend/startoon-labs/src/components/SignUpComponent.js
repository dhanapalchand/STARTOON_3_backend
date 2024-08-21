import { API_URL } from "./env";
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { IonIcon } from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import logo from "../images/startoon_logo.png";

export default function RegistrationComponent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');  // New state for gender
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateForm = () => {
        if (!name.trim()) {
            setErrorMessage('Username is required');
            return false;
        }

        if (!email.trim()) {
            setErrorMessage('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMessage(
                'Password must have at least 6 characters, one uppercase letter, and one number'
            );
            return false;
        }

        if (!password.trim()) {
            setErrorMessage('Password is required');
            return false;
        }

        if (!gender) {
            setErrorMessage('Gender is required');
            return false;
        }

        setErrorMessage('');
        return true;
    };

    const collectData = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/signup`,
                {
                    name,
                    email,
                    password,
                    gender,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setName('');
            setEmail('');
            setPassword('');
            setGender('');
            setErrorMessage('');
            console.log(`Submitted data: Name=${name}, Email=${email}, Gender=${gender}`);  // Log to console
            navigate('/login');
        } catch (error) {
            if (error.response) {
                setErrorMessage('User already exists with this username or email. Try Again.');
            } else if (error.request) {
                setErrorMessage('No response received from the server');
            } else {
                setErrorMessage('Error setting up the request:', error.message);
            }
        }
    };

    return (
        <div className="container-fluid">
            <section className="row">
                <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <img src={logo} />
                </div>
                <div className="vh-100 col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <div className="shadow px-4 rounded-3 w-75">
                        <div className="text-left">
                            <h4 className="mb-3">Sign Up</h4>
                            <form onSubmit={collectData}>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />

                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <div className="position-relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="form-control mb-2"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        className="password-toggle-icon position-absolute top-50 end-0 translate-middle-y px-2 pt-1"
                                        onClick={toggleConfirmPasswordVisibility}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <IonIcon icon={showConfirmPassword ? eyeOutline : eyeOffOutline} />
                                    </span>
                                </div>

                                <div className="mb-2 mx-2">
                                    <label className="form-check-label me-3">Gender:</label>
                                    <label className="form-check-label me-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            className="mx-1"
                                            checked={gender === 'male'}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        Male
                                    </label>
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            className="mx-1"
                                            checked={gender === 'female'}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        Female
                                    </label>
                                </div>
                                <br></br>

                                {errorMessage && <div className="mb-3" style={{ color: 'red' }}>{errorMessage}</div>}
                                <div className="row">
                                    <div className="col-6">

                                        <button className="btn btn-success w-75 rounded-2 text-black p-1 " type="submit">SIGN UP</button>
                                    </div>
                                    <div className="col-6">
                                        <Link to="/login" className='link'> <button className='btn btn-danger rounded-2 w-75 text-black  p-1' >SIGN IN</button></Link>
                                    </div>
                                </div>
                                <br></br>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
