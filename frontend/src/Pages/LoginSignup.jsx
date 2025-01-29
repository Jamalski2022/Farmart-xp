// import React from 'react'
// import './CSS/LoginSignup.css'

// const LoginSignup = () => {
//   return (
//     <div className='loginsignup'>
//       <div className="loginsignup-container">
//         <h1>Sign Up</h1>
//         <div className="loginsignup-fields">
//           <input type="text" placeholder='Your Name' />
//           <input type="email" placeholder='Email Address' />
//           <input type="password" placeholder='Password' />
//         </div>
//         <button>Continue</button>
//         <p className="loginsignup-login">Already have an account ? <span>Login here</span></p>
//         <div className="loginsignup-agree">
//           <input type="checkbox" name='' id='' />
//           <p>By continuing, I agree to use the terms of use & privacy policy.</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginSignup

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await authAPI.login({
          username: formData.username,
          password: formData.password
        });
        navigate('/');
      } else {
        await authAPI.signup(formData);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            <input
              type="text"
              name="username"
              placeholder='Username'
              value={formData.username}
              onChange={handleChange}
            />
            {!isLogin && (
              <input
                type="email"
                name="email"
                placeholder='Email Address'
                value={formData.email}
                onChange={handleChange}
              />
            )}
            <input
              type="password"
              name="password"
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Continue'}</button>
        </form>
        <p className="loginsignup-login">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up here' : 'Login here'}
          </span>
        </p>
        {!isLogin && (
          <div className="loginsignup-agree">
            <input type="checkbox" name="agree" id="agree" />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;