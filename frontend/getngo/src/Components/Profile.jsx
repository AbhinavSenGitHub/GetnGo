import React, { useEffect, useState } from 'react'
import profile from "../assest/profile.png";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import { FaPhone } from 'react-icons/fa';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const Profile = () => {

  const Card = () => {
    return (
      <div className="card">
      <div className="profile">
        <h3>username</h3>
      </div>
 
      <Carousel>
          {/* {images.map((imagess, index) => ( */}
            <div className="image-container">
              <img src="{imagess.secure_url} "alt="{imagess.public_id}" style={{ maxWidth: "400px", margin: "5px"}}/>
            </div>
          {/* ))} */}
        </Carousel>
        <div className="card-num-info">
          <p className="cnr">company name registrationYear</p>
          <p className="number"><FaPhone size={13} color="green" /> number</p>
        </div>
         <p className="tfs">transmissionType fuleType seats seats</p>
         <p className="tag">FASTag:- fastag</p>
        <div className="location">
            <h4>₹ price /hr</h4>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> </p>
        </div>
      </div>
    )
  }
  const [userPosts, setUserPosts] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Retrieve JWT token from local storage upon component mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const getUsers = async () => {
    const response = await fetch('http://localhost:1234/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
    })
    const data = await response.json();
    console.log("response.status:- " + response.status)
    
}
  useEffect(() => {
    // Fetch user-specific posts using the user's JWT
    getUsers();
  }, [token]);

  return (
    <div className="profile-container">
      <div className="profile-img">
        <img src={profile} alt="" />
      </div>
      <div className="profile-text">
       <div>
          <h1>Hello username</h1>
          <p>Welcome to our platform on this page you can find all the posts of your vachiles you have posted on our platform!</p>
        </div> 
        <div>
        <p className='total-post'>Total POST:- 0</p>
        </div>       
      </div>

      <ul>
          {userPosts.map((post) => (
            <li key={post._id}>
              <h3>{post.username}</h3>
              <p>{post.number}</p>
            </li>
          ))}

        </ul>

      {/* <div className="main-component">
              <div  >
              <div className="outer-card" >
              <div className="notexist">
              <p>Username</p>
              <>number</>
              </div><Card/></div>
            </div>
        </div> */}
    </div>
  )
}
export default Profile;