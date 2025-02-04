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
    password: '',
    role: 'customer' // Default role
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
        
        // Store token in localStorage
        localStorage.setItem("accessToken", response.data.access_token);
        
        // Check user role and redirect accordingly
        if (response.data.user.role === 'farmer') {
          navigate('/farmer/dashboard');
        } else if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Handle signup with selected role
        const signupResponse = await authAPI.signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role // Include selected role
        });
        
        // Store token from signup if provided
        if (signupResponse.data.access_token) {
          localStorage.setItem("accessToken", signupResponse.data.access_token);
        }
        
        // Switch to login form after successful signup
        setIsLogin(true);
        setError('');
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'customer'
        });
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
              required
            />
            {!isLogin && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder='Email Address'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {/* Role selection dropdown */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="farmer">Farmer</option>
                </select>
              </>
            )}
            <input
              type="password"
              name="password"
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Continue'}</button>
        </form>
        <p className="loginsignup-login">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData({
              username: '',
              email: '',
              password: '',
              role: 'customer'
            });
          }}>
            {isLogin ? 'Sign up here' : 'Login here'}
          </span>
        </p>
        {!isLogin && (
          <div className="loginsignup-agree">
            <input type="checkbox" name="agree" id="agree" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;