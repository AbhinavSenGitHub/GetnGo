import React, { useEffect, useState } from 'react'
import profile from "../assest/profile.png";
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import { FaPhone } from 'react-icons/fa';
let number = ""

const Profile = () => {
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
    }catch (e) {
      console.log("error::--- "+ e)
    }  
}
const handleDelete =  async (postId) => {
  console.log(" postId: " + postId)
  try{
  let deleteResponce =  await fetch(`http://localhost:1234/api/delete/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    method: 'GET',
  })
  // const data =  deleteResponce.data;
  const data = await deleteResponce.json();
  console.log("data:- " + data)
}catch (e) {
  console.log("error::--- "+ e)
}  
};

  const Card = ({ index, number, images, company, name, registrationYear, transmissionType, fuleType, seats, fastag, price, cityName, postId}) => {
    return (
      <div className="card card-main">
      <div className="profile">
      <form action="" method="post" >
      <button  className="delete-btn" >
      <FontAwesomeIcon className="delete-icon" size={1} color="black" onClick={() => handleDelete(index)}  icon={faTrash} />
      </button>
      </form>
      </div>
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
          <h1>Hello {user.username}</h1>
          <p>Welcome to our platform on this page you can find all the posts of your vachiles you have posted on our platform!</p>
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
              </div>
                {user.host.reverse().map((obj, index) => (  
                    <Card 
                    // key={index} 
                    index = {index}
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