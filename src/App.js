import React, {Component} from 'react';
import './App.css';
import { Router, Route, Switch, Link} from "react-router-dom";
import {Provider} from "react-redux";
import jwt_decode from 'jwt-decode';
import setAuthToken from './utilities/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authAction'

import store from "./store"
import Login from './Components/Login'
import Home from './Components/Home';
import Games from './Components/Games';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import { createBrowserHistory } from "history";
import Board from './Components/Board';
import Dashboard from './Components/Dashboard'
import PrivateRoute from './Components/Private-Route/PrivateRoute';
import Search from './Components/Search';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

if(localStorage.jwtToken) {
  const token = localStorage.jwtToken
  setAuthToken(token)
  const decode = jwt_decode(token)
  store.dispatch(setCurrentUser(decode))

  const currentTime = Date.now()/1000
  if(decode.exp < currentTime){
    store.dispatch(logoutUser())
    window.location.href="./login"
  }
}

const history = createBrowserHistory();

export default class App extends Component {
  render() {
    
    return(
      <Provider store={store}>
        <div className="App">
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
            integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
            crossOrigin="anonymous"
          />
          {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"></link> */}
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link> 
          <Router history={history}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/">Connect 4</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link href="/games">Active Games</Nav.Link>
                  <Nav.Link href="/profile">Profile</Nav.Link>
                  <Nav.Link href="/game/1">Board</Nav.Link>
                  <Nav.Link href="/search">Search</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/games" component={Games} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile/:id" render={props => (
                <Profile {...props} />
              )} />
              {/* <PrivateRoute exact path="/profile" component={Profile} /> */}
              <Route exact path="/game/:id" render={(props) => (
                <Board {...props} player1={1} player2={2} />
                
              )} />
              <PrivateRoute exact path="/search" component={Search} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </Router>
        </div>
      </Provider>
    )
  }
}
