import React, { useState } from 'react';
import profile from "../assest/profile.png";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';
// import { FaGoogle } from 'react-icons/fa';
import axios from "axios";
// import { setToken } from './tokenService';
const SignIn = () => {

  // user signUp data
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [concent, setConcent] = useState(''); 
  const submit = async (e) => {
    e.preventDefault()
    try {
       const response = await axios.post('http://localhost:1234/api/signup', {
        username: username, password: password, number: number, concent: concent,
      });
      const {token} = response.data;
      if(response.status === 200){
        localStorage.setItem("token", token); 
        alert(response.data.message);
        
        navigate('/carPost'); 
        window.location.reload();     
      }else if(response.status === 409 && !response.data.success){
        alert(response.data.message);
      }else{
        alert(response.data.message)
      }
    }
    catch (error) {
      if (error.response && error.response.status === 500) {
        // Display a custom "Login failed" message to the user
        alert('SignUp failed. Please check your credentials.');
      } else {
        // Handle other errors or show a generic error message
        alert('An error occurred. Please try again later.');
      }
    }
  }

  return (
    <>
      <div className="signup-main">
        <div className="container">
          <h2>Sign-Up</h2>
          <p>Happy to see you here!</p>
          <form action="" method="post" className="input-section">
            <div className="profile-div">
              <img src={profile} alt="" />
            </div>
            <div className="input-div">
              <input type="text" name="username" onChange={(e) => { setUsername(e.target.value) }} placeholder='username'  required/>
              <input type="password" name="password" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' required/>
              <input type="text" name="number" onChange={(e) => { setNumber(e.target.value) }} placeholder='Phone number' required/>

              {/* <label>or</label> */}
              {/* <div className="google-icon">
                <div className="FaGoogle-icon"><FaGoogle /></div>
                <div className="continew-google" onClick={googleAuth}>Continue with google </div>
              </div> */}
              <div className="concent">
                
                <p> <input type="checkbox" id="agreeCheckbox" name="agreeCheckbox" onChange={(e) => { setConcent(e.target.value) }} required/> I have read and aggred to all terms and conditions <br/> <span style={{color: 'gray'}}>Read our</span> <Link style={{color: 'blue'}} to="/concent"> terms and conditions</Link> </p>
              </div>
              <button type="submit" onClick={submit} value="Submit">New account</button>
              <Link className="have-Account" to="/login">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignIn