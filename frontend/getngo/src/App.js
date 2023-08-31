import React, { createContext, useReducer } from "react";
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./Components/Header";
import Home from "./Components/Home";
import SignIn from "./Components/SignIn";
import Login from "./Components/Login";
import Host from "./Components/Host";
import Profile from "./Components/Profile";
import CarPost from "./Components/CarPost";
import Concent from "./Components/Concent"
import { initialState, reducer } from "./reducer/UseReducer";

import "./styles/App.scss";
import "./styles/header.scss";
import "./styles/home.scss";
import "./styles/signIn.scss";
import "./styles/host.scss";
import "./styles/profile.scss";
import "./styles/carPost.scss";
import "./styles/concent.scss";

export const UserContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
    <UserContext.Provider value={{state, dispatch}}>
    <Router>
    <Header />
      <Routes>
      <Route path="/" element= {<Home/>} />
      <Route path="/signin" element= {<SignIn/>} /> 
      <Route path="/login" element= {<Login/>} />   
      <Route path="/host" element= {<Host/>} /> 
      <Route path="/carpost" element= {<CarPost/>} />  
      <Route path="/profile" element= {<Profile/>} />
      <Route path="/concent" element= {<Concent/>} />              
      </Routes>
    </Router>
    </UserContext.Provider>
    </>
  );
}

export default App;
