import React, {Component} from 'react';
import './App.css';
import { Router, Route, Switch} from "react-router-dom";
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
import {Replay} from './Components/Replay'
import PrivateRoute from './Components/Private-Route/PrivateRoute';
import Search from './Components/Search';
import CreateGame from './Components/CreateGame'
import UserProfile from './Components/UserProfile'
import url from './actions/authAction'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'

import axios from 'axios'


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

  logout = async () => {
    const user = (await axios.get(`/api/users/`)).data
    axios.post(`/api/users/logout`, {id: user._id})
    store.dispatch(logoutUser())
    window.location.href="/"
  }

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
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link> 
          <Router history={history}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/">Connect 4</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="/games">Active Games</Nav.Link>
                  <Nav.Link href="/profile">Profile</Nav.Link>
                  <Nav.Link href="/search">Search</Nav.Link>
                  <Nav.Link href="/creategame">Play Game</Nav.Link>
                </Nav>
                <Button onClick={this.logout} variant="Secondary">Logout</Button>
              </Navbar.Collapse>
            </Navbar>
            <Switch>
              <Route exact path="/home" component={Home} />
              <PrivateRoute exact path="/" component={Profile} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/games" component={Games} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoute exact path="/profile" component={Profile} />
              <Route exact path="/game/:id" render={(props) => (
                <Board {...props} player1={1} player2={2} />
                
              )} />
              <Route exact path="/replay/:id" render={(props) => (
                <Replay {...props} replay />
              )}/>
              <Route exact path="/UserProfile/:id" render={(props) => (
                <UserProfile {...props}/>
              )}/>
              <PrivateRoute exact path="/search" component={Search} />
              <PrivateRoute exact path="/creategame" component={CreateGame} />
            </Switch>
          </Router>
        </div>
      </Provider>
    )
  }
}
