import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route} from 'react-router-dom'
import Navbar from './mycomponent/navbar';

const Home =()=>{
  return(
    <h1>This is Home Page</h1>
    )
}

const About =(props)=>{
  console.log(props);
  setTimeout(()=>{props.history.push("/")},5000)
  return(
    <h1>This is About Us Page</h1>
    )
}

const Contact =()=>{
  return(
    <h1>This is Contact Us Page</h1>
    )
}


function App() {
  return (
  <BrowserRouter>
    <div className="App">
    <Navbar/>
    </div>
    <Route exact path = "/" component={Home} />
    <Route path = "/about" component={About} />
    <Route path = "/contact" component={Contact} />
    </BrowserRouter>
  );
}







export default App;
