import React, { useContext } from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {ExitToApp} from '@material-ui/icons';

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);

    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        history.push("/");
    };

    return (
      <div className="navbar-fixed">
        <nav className="teal">
          <div className="container">
              <div className="nav-wrapper">
                <span href="/" className="brand-logo">BookStore</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                  <li><NavLink to="/create">Create</NavLink></li>
                  <li><NavLink to="/books">Books</NavLink></li>
                  <li><a href="/" onClick={logoutHandler}><ExitToApp /></a></li>
                </ul>
              </div>
          </div>
        </nav> 
      </div>
    );
}