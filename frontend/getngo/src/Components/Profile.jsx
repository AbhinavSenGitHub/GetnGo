import React, { useEffect, useState } from 'react'
import profile from "../assest/profile.png";
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import { FaPhone } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

import axios from 'axios';
let number = ""
let userId = ""
const Profile = () => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [token, setToken] = useState('');
  const getUsers = async () => {
    try{
      const response = await fetch('http://localhost:1234/api/profile', {    
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const data = await response.json();
    setUserPosts(data)
    console.log(data)
    }catch (e) {
      console.log("error::--- "+ e)
    }  
}
const handleDelete =  async (userId, hostId) => {
  console.log(userId)
  console.log( hostId)
  try{
    const response = await axios.delete(`http://localhost:1234/api/delete/users/${userId}/hosts/${hostId}`)
    if (response.status === 200) {
      // Redirect to the home route after successful deletion
      alert("Your car post deleted successfully")
      navigate('/profile');
    }
  }
  catch (e) {
  console.log("error::--- "+ e)
}  
}

  const Card = ({ userId, hostId, number, images, company, name, registrationYear, transmissionType, fuleType, seats, fastag, price, cityName, postId}) => {
    return (
      <div className="card card-main"> 
      <div> <button class="custom-button" onClick={() => handleDelete(userId, hostId)}>DELETE</button></div>
      <Carousel>
          {images.map((imagess, index) => (
            <div className="image-container" key={index}>
              <img src={imagess.secure_url} alt={imagess.public_id} style={{ maxWidth: "400px", margin: "5px"}}/>
            </div>
          ))}
        </Carousel>
        <div className="card-num-info">
          <p className="cnr">{company} {name} {registrationYear}</p>
          <p className="number"><FaPhone size={13} color="green" /> {number}</p>
        </div>
         
         <p className="tfs">{transmissionType} {fuleType} {seats} seats</p>
         <p className="tag">FASTag:- {fastag}</p>
        <div className="location">
            <h4>₹ {price} /hr</h4>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {cityName}</p>
        </div>
      </div>
    ); 
  };

  useEffect(() => {
    // Fetch user-specific posts using the user's JWT
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUsers();
    }
  }, [token]);

  return (
    <div className="profile-container">
      <div className="profile-img">
        <img src={profile} alt="" />
      </div>
        {userPosts.map((user) => (
      <div className="profile-text">
       <div>
          <h1>OLLA👋  {user.username}</h1>
          <p>y dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It wa</p>
        </div> 
        <div>
          <p className='total-post'>Total POST:- {user.host.length}</p>
        </div>       
      </div>
      ))}
      <div className="main-component">
          {userPosts.map((user) => (
            <div  key={user._id}>
              <div className="outer-card" >
              <div className="notexist">
              {number = user.number}
              {userId = user._id}
              </div>
                {user.host.reverse().map((obj, index) => (  
                    <Card 
                    // key={index} 
                    userId = {userId}
                    hostId={obj.host_id}
                    number = {number}
                    images = {obj.image}
                    company={obj.company} 
                    name={obj.name} 
                    registrationYear={obj.registrationYear} 
                    transmissionType={obj.transmissionType}
                    fuleType={obj.fuleType}
                    seats={obj.seats} 
                    fastag={obj.fastag}
                    price={obj.price}
                    cityName={obj.cityName}
                    postId={obj.postId}
                    
                    />
                ))}
                </div>
            </div>
          ))}
          </div>
    </div>
  )
}
export default Profile;