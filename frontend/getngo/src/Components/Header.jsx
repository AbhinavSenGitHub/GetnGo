import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from "react-router-hash-link";
import { FaBars, FaTimes } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {

  const [clicked, setClicked] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
      const toggleMenu = () => {
        setClicked(!clicked);
      };
      const [token, setToken] = useState('');
      
      useEffect(() => {
        // Check if the user is logged in by verifying the presence of a JWT token
          const token = localStorage.getItem('token');
          console.log("token is " + token);
          if (!token) {
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
          } 
      }, [token]);
      const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        window.location.reload();
        navigate('/login');
      }
  return (
    <nav>
      <h1>GetnGo</h1>
      <main className= {` nav-bar-rs ${clicked ? "nav-rs-appear" : "nav-main-rs" }`}>
        <HashLink to = "/" className=" nav-rs">Home</HashLink> 
        {/* <HashLink to = "/servies" className="nav-rs">Services</HashLink> */}
        <HashLink to = "/carPost" className="nav-rs">Ride</HashLink>
        {!loggedIn? 
        (
          <div className="login-part">
          <Link to="/profile"><FontAwesomeIcon icon={faUser} /></Link>
          <button type="submit" onClick={handleLogout}>Logout</button>
          </div>
        ):
        <Link to = "/signup" className="nav-rs" >Sign-Up</Link> 
        }   
        
      </main>
      <div className="hamburger-btn" onClick={toggleMenu}>{clicked ? <FaBars className="hamburger" /> : <FaTimes/> }</div>
    </nav>
  )
}
export default Header;