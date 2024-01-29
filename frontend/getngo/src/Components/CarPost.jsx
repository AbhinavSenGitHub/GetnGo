import React from 'react'
import axios from "axios"
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import { FaPhone } from 'react-icons/fa';
import NoCarPage from './NoCarPage';
let username = ''
let number = ''

const Card = ({ username, number, images, company, name, registrationYear, transmissionType, fuleType, seats, fastag, price, cityName }) => {
  return (
    <div className="card">
      <div className="profile">
        <h3>{username}</h3>
      </div>
      <Carousel>
        {images.map((imagess, index) => (
          <div className="image-container" key={index}>
            <img src={imagess.secure_url} alt={imagess.public_id} style={{ maxWidth: "400px", margin: "5px" }} />
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
  const [filteredData, setFilteredData] = useState([]);

  const getUsers = async () => {
    const response = await fetch('http://localhost:1234/demo', {
      method: 'GET',
    })
    const data = await response.json();
    console.log(data)
    setUsers(data);

  }
  useEffect(() => {
    getUsers();
  }, [])

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searhResult, setSearchResults] = useState([])

  useEffect(() => {

    const fetchSearchResults = async () => {
        const response = await fetch(`http://localhost:1234/search?query=${query}`);
        const data = await response.json();
        setSearchResults(data)
        console.log(data)
      
    };

    // Fetch results whenever query changes (debounced for better performance)
    const delayTimer = setTimeout(() => {
      if (query.trim() !== '') {
        fetchSearchResults()
      } else {
        setResults(users) 
      }
    }, 500); 

    return () => clearTimeout(delayTimer); // Clear previous timer on each change
  }, [query, results]);

  return (

    <div className="carPost">
      <div className="searchOption">
        <input type="search"
          placeholder="Search Location"
          value={query}
          onChange={e => setQuery(e.target.value)}
        /></div>

      {query === '' ? (
        <div className="main-component">
          {results.map(user =>
            <div key={user._id}>
              <div className="outer-card" >
                <div className="notexist">
                  {username = user.username}
                  {number = user.number}
                </div>
                {user.host.reverse().map((obj, index) => (
                  <Card
                    // key={index} 
                    username={username}
                    number={number}
                    images={obj.image}
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
      )
        : ( Array.isArray(searhResult) && searhResult.length > 0  ? (
         
        <div className="main-component">
          {searhResult.map(user =>
            <div key={user._id}>
              <div className="outer-card" >
                <div className="notexist">
                  {username = user.username}
                  {number = user.number}
                </div>
                {typeof user.host === 'object' && user.host !== null ? (
          Object.values(user.host).reverse().map((obj, index) => (
            <Card
              key={index}
              username={username}
              number={number}
              images={obj.image}
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
          ))
        ) : (
          <p>No host information available</p>
        )}
              </div>
            </div>)}
        </div>
        ) : ( <NoCarPage/>)
        )}
    </div>

  )
}

export default CarPost;