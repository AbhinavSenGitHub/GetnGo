import React, { useState } from 'react';
import profile from "../assest/profile.png";
import { Link } from "react-router-dom";
import { FaGoogle } from 'react-icons/fa';
import axios from "axios";
import { useNavigate } from 'react-router';

const Login = () => {

  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:1234/api/login', {
        number: number,
        password: password
      })
      if (response.status === 200 && response.data.success) {
        // Handle successful login
        console.log('Login successful');
        localStorage.setItem('token', response.data.token);
        alert(response.data.message);
        navigate('/carPost');
    }else if(response.status === 401 && !response.data.success){
      alert(response.data.message);
    }else {
      alert(response.data.message); // Display error message in alert
    }
    }
    catch (e) {
      console.log("Login error:- ", e);
    }
  }

  return (
    <>
      <div className="signup-main">
        <div className="container">
          <h2>Login</h2>
          <p>Happy to see you back!</p>
          <form action="" method="post" className="input-section">
            <div className="profile-div">
              <img src={profile} alt="" />
            </div>
            <div className="input-div">
              <input type="text" name="number" onChange={(e) => { setNumber(e.target.value) }} placeholder='number' />
              <input type="password" name="password" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' />
              <label>or</label>
              <div className="google-icon">
                <div className="FaGoogle-icon"><FaGoogle /></div>
                <div className="continew-google">Continue with google </div>
              </div>
              <button type="submit" onClick={submit} value="Submit">Login</button>
              <Link className="have-Account" to="/signIn">Create in account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login;