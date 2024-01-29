import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./Components/Header";
import Home from "./Components/Home";
import Signup from "./Components/Signup"
import Login from "./Components/Login";
import Host from "./Components/Host";
import Profile from "./Components/Profile";
import CarPost from "./Components/CarPost";
import Concent from "./Components/Concent"
import NotFoundPage from "./Components/NotFoundPage"
// import { initialState, reducer } from "./reducer/UseReducer";

import "./styles/App.scss";
import "./styles/header.scss";
import "./styles/home.scss";
import "./styles/signup.scss";
import "./styles/host.scss";
import "./styles/profile.scss";
import "./styles/carPost.scss";
import "./styles/concent.scss";
import "./styles/notFound.scss";
function App() {
 
  const [authenticated, setAuthenticated] = useState(false);
 
  useEffect(() => {
    // Check if the user is authenticated by verifying the presence of a JWT token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    
  }, []);
  return (
    <>
    <Router>
    
    <Header />
      <Routes>
      <Route path="/" element= {<Home/>} />
      <Route path="/signup" element= {<Signup/>} /> 
      <Route path="/login" element= {<Login/>} />   
      {/* <Route path="/host" element= {<Host/>} />  */}
      <Route path="/host" element={ authenticated ? <Host /> : <Login />} />
      <Route path="/carpost" element={ authenticated ? <CarPost/> : <Login />} />  
      <Route path="/profile" element= { authenticated ? <Profile/>: <Login/>} />
      <Route path="/concent" element= {<Concent/>} />
      <Route path="*" element= {<NotFoundPage/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
