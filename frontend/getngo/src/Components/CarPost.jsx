import React from 'react'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import { FaPhone } from 'react-icons/fa';
let username = '' 
let number =''

const Card = ({ username, number, images, company, name, registrationYear, transmissionType, fuleType, seats, fastag, price, cityName}) => {
    return (
      <div className="card">
      <div className="profile">
        <h3>{username}</h3>
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
const CarPost = () => {

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    const getUsers = async () => {
        const response = await fetch('http://localhost:1234/demo', {
            method: 'GET',
        })
        const data = await response.json();
        console.log(response.status)
        setUsers(data);
        
    }

    useEffect(() => {
        getUsers();
    }, [])

     useEffect(() => {
    // Filter the data based on the search query
    if (searchQuery.trim() === '') {
      // If search query is empty, show all data
      setFilteredData(users);
    } else {
      const filtered = users.filter(item =>
        item.host.some(hostItem =>
            hostItem.cityName && hostItem.cityName.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredData(filtered);
    //   console.log("filterData:- " + filteredData)
      // console.log("users:- " + users)
    }
  }, [searchQuery, users]);
  for(let i = 0; i <= 10; i++){
    
  }

    return (
        
    <div className="carPost">

    <div className="searchOption"> 
    <input type="search" 
    placeholder="Search Location"
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    /></div>
   
        <div className="main-component">
            {filteredData.map(user => 
              <div  key={user._id}>
              <div className="outer-card" >
              <div className="notexist">
              {username = user.username}
              {number = user.number}
              </div>
                {user.host.reverse().map((obj, index) => (   
                    <Card 
                    key={index} 
                    username = {username}
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
                    />
                    
                ))}
                </div>
            </div>)}
        </div>
        </div>
    )
}

export default CarPost;






// <Carousel>
//           {images.map((imagess, index) => (
//             <div className="image-container" key={index}>
//               <img src={`public//`+{imagess}} alt={`Image ${index}`} style={{ maxWidth: "400px", margin: "5px"}}/>
//             </div>
//           ))}
//         </Carousel>