import React, { useContext, useState } from 'react';
import profile from "../assest/profile.png";
import { Link } from "react-router-dom";
// import ser from ""
import { FaGoogle } from 'react-icons/fa';
import axios from "axios";
import { useNavigate } from 'react-router';
// import { UserContext } from '../App';
const Login = () => {

  // const {state, dispatch} = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // const [loggedIn, setLoggedIn] = useState(false); 

  const submit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:1234/api/login', {
        username: username,
        password: password
      })

      if(response.data.success){
        // dispatch({type:"USER", payload:true});
        navigate('/carPost');
        console.log("success")
        
      }
    }
    catch (e) {
      console.log(e);
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
              <input type="text" name="username" onChange={(e) => { setUsername(e.target.value) }} placeholder='username' />
              <input type="password" name="password" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' />
              {/* <input type="text" name="number" onChange={(e) => { setNumber(e.target.value) }} placeholder='Phone number' /> */}

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