import React from 'react';
import {Link} from 'react-router-dom';

function Navbar() {
  return (
    <div className="App">
    <nav>
    <div class="nav-wrapper">
      <Link to="#" class="brand-logo">App Name</Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
    </div>
  </nav>
         </div>
  );
}


export default Navbar;