import React from 'react'
import car from "../assest/myride.jpg"
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
        <div className="home1">
            <div className="home-content">
                 <h1>Unleash Your <br/> Road Adventure Today.</h1>
                 <p>
                 Discover the joy of seamless travel with us. With our wide range 
                 of well-maintained vehicles at competitive prices, and personalized 
                 customer service, we make renting a car an effortless experience.
                 </p>
                 <form>
                 <Link to="/carPost" className="home-btn">Get a Vehicle</Link>
                 {/* <Link to="/carPost" className="home-btn">Book your ride</Link> */}
                 </form>
            </div>
            <img src={car} alt="car-img" />
         </div>
    </>
  )
}

export default Home
