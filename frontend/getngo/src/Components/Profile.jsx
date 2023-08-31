import React, { useContext, useEffect, useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import profile from "../assest/profile.png";
// import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';


const Profile = () => {

  // const googleAuth = () => {
  //   window.open(
  //     `${process.env.REACT_APP_API_URL}/auth/logout`,
  //     "_self"
  //   );
  // }
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
    useEffect(() => {
        async function fetchAuthStatus() {
            try {
                const response = await fetch('http://localhost:1234/api/authenticated', {
                    credentials: 'include', // Include cookies in the request
                });
                if (response.ok) {
                  const data = await response.json();
                  
                  setAuthenticated(data.authenticated);
                  console.log("set value:- " + data.authenticated)
              }
                else {
                    console.log("not able to fetch data from the server for profile page")
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        fetchAuthStatus();
    }, []);
  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:1234/api/logout', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        });

        if(response.ok){
          navigate('/');
           // const data = await response.json()
          // setAuthenticated(data.authenticated)      
        }else{
          console.error('Logout failed:-', response.statusText);
        }
        
    } catch (error) {
        console.error('Logout error:-', error);
    }
};

  // const {state, dispatch} = useContext(UserContext);

  return (
    
    <div className="profile-container">
      <div className="profile-img">
         <img src={profile} alt="" />
      </div>
      <div className="profile-text">
      {!authenticated ? <div>
      <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      
        <button type="submit" onClick={handleLogout}>Logout</button>
        
      </div> : <div>
        <p>Regiter yourself to host your servies servies</p>
        <div className="not-login">
        <Link className="not-login-btn" to="/login">Login</Link>
        <Link className="not-login-btn" to="/signin">Register</Link>
        </div>
      </div>}
      
      </div>

    </div>
  )
}

export default Profile;